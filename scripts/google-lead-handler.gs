/**
 * Radha Vatika — website lead handler.
 *
 * Emails every submission to you AND appends it to a sheet as a permanent
 * record. Handles both website forms: the brochure download form and the
 * "Send Enquiry" contact form (they're told apart by the Source column).
 *
 * SETUP (once, ~5 minutes)
 * -----------------------------------------------------------------------------
 * 1. Create a Google Sheet (sheets.new). Name it e.g. "Radha Vatika Leads".
 * 2. In that Sheet: Extensions → Apps Script. Delete whatever is in Code.gs
 *    and paste this whole file in.
 * 3. Set MAIL_TO and SHARED_SECRET below. Use a long random string for the
 *    secret and keep a copy — the website needs the identical value.
 * 4. Click Deploy → New deployment → gear icon → "Web app".
 *      - Description:    website leads
 *      - Execute as:     Me                  <-- required, so it may send mail
 *      - Who has access: Anyone              <-- required; the secret is the guard
 *    Click Deploy, then Authorize access. Google will ask for permission to
 *    send email as you — that's MailApp, and it's why this step is needed.
 *    Accept the warning screen ("Advanced" → "Go to <project> (unsafe)");
 *    it's your own script.
 * 5. Copy the Web app URL. It ends in /exec — NOT /dev.
 * 6. Put both values in the website's environment:
 *      GOOGLE_SHEETS_WEBHOOK_URL   = <the /exec URL>
 *      GOOGLE_SHEETS_SHARED_SECRET = <the same secret as below>
 *    Locally that's .env.local; on Vercel it's Settings → Environment
 *    Variables, then redeploy.
 *
 * IMPORTANT: after ANY edit to this script, run Deploy → Manage deployments →
 * edit → Version: "New version" → Deploy. Saving alone does not publish.
 *
 * NOTE ON LIMITS: a free consumer Gmail account can send ~100 emails/day via
 * MailApp. Every lead is also written to the sheet, so even if that quota is
 * ever hit you do not lose the lead — only the notification.
 */

var MAIL_TO = 'shreeharivansh2555@gmail.com';
var SHARED_SECRET = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING';
var SHEET_NAME = 'Website Leads';
var HEADERS = ['Timestamp', 'Name', 'Phone', 'Email', 'Message', 'Source'];
var TIMEZONE = 'Asia/Kolkata';

function doPost(e) {
  // Serialise appends so two visitors submitting at once can't collide.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return jsonOut({ success: false, error: 'busy' });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOut({ success: false, error: 'empty body' });
    }

    var body = JSON.parse(e.postData.contents);

    if (body.secret !== SHARED_SECRET) {
      return jsonOut({ success: false, error: 'unauthorized' });
    }

    var lead = {
      name: String(body.name || '').trim(),
      phone: String(body.phone || '').trim(),
      email: String(body.email || '').trim(),
      message: String(body.message || '').trim(),
      source: String(body.source || 'Website').trim(),
      at: new Date(),
    };

    // Record first, notify second. If sending mail fails (quota, transient
    // Google error) the lead is already safely stored.
    appendRow_(lead);

    var mailError = '';
    try {
      sendNotification_(lead);
    } catch (err) {
      mailError = String(err);
      console.error('Lead saved but email failed: ' + mailError);
    }

    return jsonOut({ success: true, mailed: !mailError, mailError: mailError });
  } catch (err) {
    return jsonOut({ success: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Lets you confirm the deployment is live by opening the /exec URL in a tab. */
function doGet() {
  return jsonOut({ success: true, status: 'Radha Vatika lead handler is live' });
}

function appendRow_(lead) {
  var sheet = getSheet_();
  sheet.appendRow([
    lead.at,
    lead.name,
    // Leading apostrophe keeps Sheets from mangling the number (dropping a
    // leading 0, or rendering 9.87654321E9).
    "'" + lead.phone,
    lead.email,
    lead.message,
    lead.source,
  ]);
}

function sendNotification_(lead) {
  var stamp = Utilities.formatDate(lead.at, TIMEZONE, "d MMM yyyy 'at' h:mm a");

  var lines = [
    lead.source,
    '',
    'Name:    ' + lead.name,
    'Phone:   ' + lead.phone,
    'Email:   ' + (lead.email || '—'),
    '',
    'Message:',
    lead.message || '—',
    '',
    'Received ' + stamp + ' IST',
  ];

  var html =
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#16130f">' +
    '<p style="margin:0 0 16px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#b4643c">' +
    esc_(lead.source) +
    '</p>' +
    '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse">' +
    row_('Name', lead.name) +
    row_('Phone', lead.phone) +
    row_('Email', lead.email || '—') +
    '</table>' +
    (lead.message
      ? '<p style="margin:18px 0 6px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#4a453d">Message</p>' +
        '<p style="margin:0;white-space:pre-wrap;line-height:1.6">' +
        esc_(lead.message) +
        '</p>'
      : '') +
    '<p style="margin:22px 0 0;font-size:12px;color:#4a453d">Received ' +
    esc_(stamp) +
    ' IST</p>' +
    '</div>';

  var options = {
    to: MAIL_TO,
    subject:
      lead.source +
      ' — ' +
      (lead.name || 'Website visitor') +
      (lead.phone ? ' (' + lead.phone + ')' : ''),
    body: lines.join('\n'),
    htmlBody: html,
    name: 'Radha Vatika Website',
  };

  // Reply goes straight to the enquirer when they gave an address.
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    options.replyTo = lead.email;
  }

  MailApp.sendEmail(options);
}

function row_(label, value) {
  return (
    '<tr>' +
    '<td style="padding:3px 18px 3px 0;color:#4a453d;white-space:nowrap">' +
    esc_(label) +
    '</td>' +
    '<td style="padding:3px 0;font-weight:bold">' +
    esc_(value) +
    '</td>' +
    '</tr>'
  );
}

function esc_(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Write headers on a fresh sheet, and repair them if an earlier version of
  // this script created a narrower header row.
  if (sheet.getLastRow() === 0 || sheet.getLastColumn() < HEADERS.length) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 170);
    sheet.setColumnWidth(2, 170);
    sheet.setColumnWidth(3, 140);
    sheet.setColumnWidth(4, 210);
    sheet.setColumnWidth(5, 380);
    sheet.setColumnWidth(6, 160);
  }

  return sheet;
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
