import { NextRequest, NextResponse } from "next/server";
import { getRsvpIndex, appendRsvpRow, updateRsvpRow, type RsvpData } from "@/lib/sheets";
import { households } from "@/data/guests";

type MemberResponse = { name: string; attending: "yes" | "no"; plusOne?: string };

const clean = (v?: string) => (v && v !== "—" ? v : "");

// Read-only lookup: has this household already responded? Also serves a
// health check (?health=1) reporting whether the Google env vars are set.
export async function GET(req: NextRequest) {
  try {
    if (req.nextUrl.searchParams.get("health") === "1") {
      const required = ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_SHEET_ID"];
      const missing = required.filter((v) => !process.env[v]);
      if (missing.length > 0) return NextResponse.json({ configured: false, missing });
      try {
        const index = await getRsvpIndex();
        return NextResponse.json({ configured: true, canRead: true, rowCount: index.size });
      } catch (e) {
        const msg = (e instanceof Error ? e.message : String(e)).slice(0, 180);
        return NextResponse.json({ configured: true, canRead: false, error: msg });
      }
    }

    const householdId = req.nextUrl.searchParams.get("householdId");
    const household = households.find((h) => h.id === householdId);
    if (!household) return NextResponse.json({ alreadyRsvped: false });

    const missingVars = ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_SHEET_ID"].filter(
      (v) => !process.env[v]
    );
    if (missingVars.length > 0) return NextResponse.json({ alreadyRsvped: false });

    const index = await getRsvpIndex();
    const anyExisting = household.members.some((m) => index.has(m.name.toLowerCase()));
    if (!anyExisting) return NextResponse.json({ alreadyRsvped: false });

    const rows = household.members.map((m) => index.get(m.name.toLowerCase()));
    const firstExisting = rows.find(Boolean);

    return NextResponse.json({
      alreadyRsvped: true,
      existing: {
        members: household.members.map((m) => {
          const e = index.get(m.name.toLowerCase());
          return { name: m.name, attending: e?.data.attending ?? "", plusOne: clean(e?.data.plusOne) };
        }),
        dietary: clean(firstExisting?.data.dietary),
        notes: clean(firstExisting?.data.notes),
      },
    });
  } catch {
    // Fail open: let the form load normally if the lookup errors.
    return NextResponse.json({ alreadyRsvped: false });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { householdId, members, dietary, notes, overwrite } = body as {
      householdId?: string;
      members?: MemberResponse[];
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
    const byName = new Map(household.members.map((m) => [m.name.toLowerCase(), m]));
    const allValid = members.every((m) => m?.name && byName.has(m.name.toLowerCase()));
    if (!allValid) {
      return NextResponse.json({ error: "Guest list mismatch." }, { status: 400 });
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

    const index = await getRsvpIndex();

    // If anyone in the household has already responded, ask before overwriting.
    const anyExisting = members.some((m) => index.has(m.name.toLowerCase()));
    if (anyExisting && overwrite !== "true") {
      const firstExisting = members.map((m) => index.get(m.name.toLowerCase())).find(Boolean);
      return NextResponse.json({
        alreadyRsvped: true,
        existing: {
          members: members.map((m) => {
            const e = index.get(m.name.toLowerCase());
            return { name: m.name, attending: e?.data.attending ?? "", plusOne: clean(e?.data.plusOne) };
          }),
          dietary: clean(firstExisting?.data.dietary),
          notes: clean(firstExisting?.data.notes),
        },
      });
    }

    // Upsert one row per member; a plus-one is honored only if that member is
    // flagged for one in the guest list.
    for (const m of members) {
      const guest = byName.get(m.name.toLowerCase());
      const plusOne = guest?.plusOne ? (m.plusOne ?? "").trim() : "";
      const data: RsvpData = {
        name: m.name,
        attending: m.attending === "yes" ? "yes" : "no",
        dietary: dietary ?? "",
        plusOne,
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
