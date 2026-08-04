import { NextRequest, NextResponse } from "next/server";
import { getRsvpIndex, appendRsvpRow, updateRsvpRow, type RsvpData } from "@/lib/sheets";
import { households } from "@/data/guests";

type MemberResponse = { name: string; attending: "yes" | "no" };

const clean = (v?: string) => (v && v !== "—" ? v : "");

// Read-only lookup: has this household already responded? Used to surface the
// "you've already RSVP'd" message as soon as a name is selected.
export async function GET(req: NextRequest) {
  try {
    // Health check: reports whether the Google env vars are configured
    // (names only — never values). Visit /api/rsvp?health=1
    if (req.nextUrl.searchParams.get("health") === "1") {
      const required = ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_SHEET_ID"];
      const missing = required.filter((v) => !process.env[v]);
      return NextResponse.json({ configured: missing.length === 0, missing });
    }

    const householdId = req.nextUrl.searchParams.get("householdId");
    const household = households.find((h) => h.id === householdId);
    if (!household) return NextResponse.json({ alreadyRsvped: false });

    const missingVars = ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_SHEET_ID"].filter(
      (v) => !process.env[v]
    );
    if (missingVars.length > 0) return NextResponse.json({ alreadyRsvped: false });

    const index = await getRsvpIndex();
    const anyExisting = household.members.some((m) => index.has(m.toLowerCase()));
    if (!anyExisting) return NextResponse.json({ alreadyRsvped: false });

    const rows = household.members.map((m) => index.get(m.toLowerCase()));
    const firstExisting = rows.find(Boolean);
    const plusOneRow = rows.find((e) => e && clean(e.data.plusOne));

    return NextResponse.json({
      alreadyRsvped: true,
      existing: {
        members: household.members.map((m) => ({
          name: m,
          attending: index.get(m.toLowerCase())?.data.attending ?? "",
        })),
        dietary: clean(firstExisting?.data.dietary),
        notes: clean(firstExisting?.data.notes),
        plusOne: clean(plusOneRow?.data.plusOne),
      },
    });
  } catch {
    // Fail open — let the form load normally if the lookup errors.
    return NextResponse.json({ alreadyRsvped: false });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      householdId,
      primaryName,
      members,
      plusOne,
      dietary,
      notes,
      overwrite,
    } = body as {
      householdId?: string;
      primaryName?: string;
      members?: MemberResponse[];
      plusOne?: string;
      dietary?: string;
      notes?: string;
      overwrite?: string;
    };

    const household = households.find((h) => h.id === householdId);
    if (!household) {
      return NextResponse.json(
        { error: "We couldn't find your party. Please contact us if you think this is an error." },
        { status: 403 }
      );
    }

    if (!Array.isArray(members) || members.length === 0) {
      return NextResponse.json({ error: "No guests provided." }, { status: 400 });
    }

    // Every submitted name must belong to this household.
    const memberSet = new Set(household.members.map((m) => m.toLowerCase()));
    const allValid = members.every((m) => m?.name && memberSet.has(m.name.toLowerCase()));
    if (!allValid) {
      return NextResponse.json({ error: "Guest list mismatch." }, { status: 400 });
    }

    // Plus-one only honored when the invitation allows it.
    const plusOneName = household.allowPlusOne ? (plusOne ?? "").trim() : "";
    const primary = primaryName && memberSet.has(primaryName.toLowerCase())
      ? primaryName
      : members[0].name;

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

    const index = await getRsvpIndex();

    // If anyone in the household has already responded, ask before overwriting.
    const anyExisting = members.some((m) => index.has(m.name.toLowerCase()));
    if (anyExisting && overwrite !== "true") {
      const firstExisting = members
        .map((m) => index.get(m.name.toLowerCase()))
        .find(Boolean);
      const primaryExisting = index.get(primary.toLowerCase());
      const clean = (v?: string) => (v && v !== "—" ? v : "");
      return NextResponse.json({
        alreadyRsvped: true,
        existing: {
          members: members.map((m) => ({
            name: m.name,
            attending: index.get(m.name.toLowerCase())?.data.attending ?? "",
          })),
          dietary: clean(firstExisting?.data.dietary),
          notes: clean(firstExisting?.data.notes),
          plusOne: clean(primaryExisting?.data.plusOne),
        },
      });
    }

    // Upsert one row per member (plus-one name recorded on the primary's row).
    for (const m of members) {
      const data: RsvpData = {
        name: m.name,
        attending: m.attending === "yes" ? "yes" : "no",
        dietary: dietary ?? "",
        plusOne: m.name === primary ? plusOneName : "",
        notes: notes ?? "",
      };
      const existing = index.get(m.name.toLowerCase());
      if (existing) {
        await updateRsvpRow(existing.rowIndex, data);
      } else {
        await appendRsvpRow(data);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("RSVP error:", message);
    return NextResponse.json({ error: `Something went wrong: ${message}` }, { status: 500 });
  }
}
