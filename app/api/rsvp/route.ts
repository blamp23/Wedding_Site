import { NextRequest, NextResponse } from "next/server";
import { appendRsvpRow } from "@/lib/sheets";
import guests from "@/data/guests.json";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, attending, dietary, plusOne } = body as Record<string, string>;

    if (!name || !attending) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Verify guest is on the list (case-insensitive)
    const guestList = guests as string[];
    const isInvited = guestList.some(
      (g) => g.toLowerCase() === name.toLowerCase()
    );

    if (!isInvited) {
      return NextResponse.json(
        { error: "We couldn't find your name on the guest list. Please contact us if you think this is an error." },
        { status: 403 }
      );
    }

    const missingVars = ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_SHEET_ID"].filter(
      (v) => !process.env[v]
    );
    if (missingVars.length > 0) {
      console.error("RSVP: missing env vars:", missingVars.join(", "));
      return NextResponse.json(
        { error: `Server misconfiguration: missing ${missingVars.join(", ")}. Contact the site owner.` },
        { status: 500 }
      );
    }

    await appendRsvpRow({ name, attending, dietary: dietary ?? "", plusOne: plusOne ?? "" });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("RSVP error:", message);
    return NextResponse.json(
      { error: `Something went wrong: ${message}` },
      { status: 500 }
    );
  }
}
