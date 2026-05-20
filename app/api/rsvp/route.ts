import { NextRequest, NextResponse } from "next/server";
import { findExistingRsvp, appendRsvpRow, updateRsvpRow } from "@/lib/sheets";
import guests from "@/data/guests.json";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, attending, dietary, plusOne, notes, overwrite } = body as Record<string, string>;

    if (!name || !attending) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const guestList = guests as string[];
    const isInvited = guestList.some((g) => g.toLowerCase() === name.toLowerCase());
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
        { error: `Server misconfiguration: missing ${missingVars.join(", ")}.` },
        { status: 500 }
      );
    }

    const rsvpData = { name, attending, dietary: dietary ?? "", plusOne: plusOne ?? "", notes: notes ?? "" };

    // Check if this guest has already RSVP'd
    const existing = await findExistingRsvp(name);

    if (existing && overwrite !== "true") {
      return NextResponse.json({ alreadyRsvped: true, existing: existing.data });
    }

    if (existing && overwrite === "true") {
      await updateRsvpRow(existing.rowIndex, rsvpData);
    } else {
      await appendRsvpRow(rsvpData);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("RSVP error:", message);
    return NextResponse.json({ error: `Something went wrong: ${message}` }, { status: 500 });
  }
}
