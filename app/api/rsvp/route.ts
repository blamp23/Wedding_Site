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

    await appendRsvpRow({ name, attending, dietary: dietary ?? "", plusOne: plusOne ?? "" });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("RSVP error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}
