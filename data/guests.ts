// Guest list grouped into households, so a whole family can RSVP at once.
//
// - `members`: everyone invited under this household (shown as checkboxes).
// - Set `plusOne: true` on an individual member if THEIR invitation includes
//   a guest. A "Bringing a guest?" box appears under that person only.
//
// A guest can look up ANY member name to pull up the whole household.
// After editing this list, re-seed the sheet roster (see README / seed URL).

export type Guest = { name: string; plusOne?: boolean };
export type Household = { id: string; members: Guest[] };

export const households: Household[] = [
  // Add real households here, for example:
  // { id: "fortune", members: [{ name: "Sarah Fortune", plusOne: true }, { name: "Tom Fortune" }] },
];

export function findHousehold(name: string): Household | undefined {
  const n = name.trim().toLowerCase();
  return households.find((h) => h.members.some((m) => m.name.toLowerCase() === n));
}

// Flat list of every invited name (used to seed the sheet roster).
export function allInvitedNames(): string[] {
  return households.flatMap((h) => h.members.map((m) => m.name));
}
