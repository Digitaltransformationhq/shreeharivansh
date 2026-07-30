/**
 * Radha Vatika — brochure lead collector.
 *
 * SETUP (once, ~5 minutes)
 * -----------------------------------------------------------------------------
 * 1. Create a Google Sheet (sheets.new). Name it e.g. "Radha Vatika Leads".
 * 2. In that Sheet: Extensions → Apps Script. Delete whatever is in Code.gs
 *    and paste this whole file in.
 * 3. Change SHARED_SECRET below to your own long random string. Keep a copy —
 *    the website needs the identical value.
 * 4. Click Deploy → New deployment → gear icon → "Web app".
 *      - Description:    brochure leads
 *      - Execute as:     Me
 *      - Who has access: Anyone            <-- required; the secret is the guard
 *    Click Deploy, then Authorize access and accept the Google warning screen
 *    ("Advanced" → "Go to <project> (unsafe)" — it's your own script).
 * 5. Copy the Web app URL. It ends in /exec — NOT /dev.
 * 6. Put both values in the website's environment:
 *      GOOGLE_SHEETS_WEBHOOK_URL = <the /exec URL>
 *      GOOGLE_SHEETS_SHARED_SECRET = <the same secret as below>
 *    Locally that's .env.local; on Vercel it's Settings → Environment
 *    Variables, then redeploy.
 *
 * IMPORTANT: after ANY edit to this script, run Deploy → Manage deployments →
 * edit → Version: "New version" → Deploy. Saving alone does not publish.
 */

var SHARED_SECRET = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING';
var SHEET_NAME = 'Brochure Leads';
var HEADERS = ['Timestamp', 'Name', 'Mobile', 'Email', 'Source'];

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

    var sheet = getSheet_();

    sheet.appendRow([
      new Date(),
      body.name || '',
      // Leading apostrophe keeps Sheets from mangling the number
      // (dropping a leading 0, or rendering 9.87654321E9).
      "'" + String(body.mobile || ''),
      body.email || '',
      body.source || 'Website',
    ]);

    return jsonOut({ success: true });
  } catch (err) {
    return jsonOut({ success: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Lets you confirm the deployment is live by opening the /exec URL in a tab. */
function doGet() {
  return jsonOut({ success: true, status: 'Radha Vatika lead collector is live' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 180);
    sheet.setColumnWidth(3, 140);
    sheet.setColumnWidth(4, 220);
  }

  return sheet;
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
