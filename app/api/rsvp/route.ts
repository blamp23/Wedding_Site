import { NextRequest, NextResponse } from "next/server";
import {
  getRsvpIndex,
  getSpreadsheetMeta,
  appendRsvpRow,
  updateRsvpRow,
  seedRoster,
  type RsvpData,
} from "@/lib/sheets";
import { households, allInvitedNames } from "@/data/guests";

type MemberResponse = { name: string; attending: "yes" | "no"; plusOne?: string };

const clean = (v?: string) => (v && v !== "—" ? v : "");
const responded = (status?: string) => status === "Yes" || status === "No";
const norm = (status?: string) => (status === "Yes" ? "yes" : status === "No" ? "no" : "");

const GOOGLE_VARS = ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_SHEET_ID"];
const missingGoogleVars = () => GOOGLE_VARS.filter((v) => !process.env[v]);

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;

    // Health check: env + read access + spreadsheet title.
    if (params.get("health") === "1") {
      const missing = missingGoogleVars();
      const hasAdminToken = !!process.env.RSVP_ADMIN_TOKEN;
      if (missing.length > 0) return NextResponse.json({ configured: false, missing, hasAdminToken });
      try {
        const [index, meta] = await Promise.all([getRsvpIndex(), getSpreadsheetMeta()]);
        return NextResponse.json({ configured: true, canRead: true, rowCount: index.size, title: meta.title, tabs: meta.tabs, hasAdminToken });
      } catch (e) {
        const msg = (e instanceof Error ? e.message : String(e)).slice(0, 180);
        return NextResponse.json({ configured: true, canRead: false, error: msg });
      }
    }

    // Seed/rebuild the roster from the guest list (token-protected).
    if (params.get("seed") === "1") {
      const token = params.get("token");
      if (!process.env.RSVP_ADMIN_TOKEN || token !== process.env.RSVP_ADMIN_TOKEN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (missingGoogleVars().length > 0) {
        return NextResponse.json({ error: "Google Sheets not configured." }, { status: 500 });
      }
      const result = await seedRoster(allInvitedNames());
      return NextResponse.json({ seeded: result.count, formatted: result.formatted });
    }

    // Lookup: has this household already responded?
    const householdId = params.get("householdId");
    const household = households.find((h) => h.id === householdId);
    if (!household) return NextResponse.json({ alreadyRsvped: false });
    if (missingGoogleVars().length > 0) return NextResponse.json({ alreadyRsvped: false });

    const index = await getRsvpIndex();
    const anyResponded = household.members.some((m) => responded(index.get(m.name.toLowerCase())?.data.attending));
    if (!anyResponded) return NextResponse.json({ alreadyRsvped: false });

    const rows = household.members.map((m) => index.get(m.name.toLowerCase()));
    const firstExisting = rows.find(Boolean);
    return NextResponse.json({
      alreadyRsvped: true,
      existing: {
        members: household.members.map((m) => {
          const e = index.get(m.name.toLowerCase());
          return { name: m.name, attending: norm(e?.data.attending), plusOne: clean(e?.data.plusOne) };
        }),
        dietary: clean(firstExisting?.data.dietary),
        notes: clean(firstExisting?.data.notes),
      },
    });
  } catch {
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

    const byName = new Map(household.members.map((m) => [m.name.toLowerCase(), m]));
    if (!members.every((m) => m?.name && byName.has(m.name.toLowerCase()))) {
      return NextResponse.json({ error: "Guest list mismatch." }, { status: 400 });
    }

    const missing = missingGoogleVars();
    if (missing.length > 0) {
      console.error("RSVP: missing env vars:", missing.join(", "));
      return NextResponse.json(
        { error: `Server misconfiguration: missing ${missing.join(", ")}.` },
        { status: 500 }
      );
    }

    const index = await getRsvpIndex();

    // If anyone in the household has already responded, confirm before overwriting.
    const anyResponded = members.some((m) => responded(index.get(m.name.toLowerCase())?.data.attending));
    if (anyResponded && overwrite !== "true") {
      const firstExisting = members.map((m) => index.get(m.name.toLowerCase())).find(Boolean);
      return NextResponse.json({
        alreadyRsvped: true,
        existing: {
          members: members.map((m) => {
            const e = index.get(m.name.toLowerCase());
            return { name: m.name, attending: norm(e?.data.attending), plusOne: clean(e?.data.plusOne) };
          }),
          dietary: clean(firstExisting?.data.dietary),
          notes: clean(firstExisting?.data.notes),
        },
      });
    }

    // Update each member's roster row (append if they weren't seeded).
    for (const m of members) {
      const guest = byName.get(m.name.toLowerCase());
      const data: RsvpData = {
        name: m.name,
        attending: m.attending === "yes" ? "Yes" : "No",
        dietary: dietary ?? "",
        plusOne: guest?.plusOne ? (m.plusOne ?? "").trim() : "",
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
