import Flipbook from "@/components/Flipbook";

// Temporary preview route for the brochure flipbook — visit /brochure.
export default function BrochurePreview() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-rust p-6">
      <div className="w-full max-w-[720px]">
        <Flipbook />
      </div>
    </div>
  );
}
