// Guest list grouped into households, so a whole family can RSVP at once.
//
// - `members`: everyone invited under this household (shown as checkboxes).
// - Set `plusOne: true` on an individual member if THEIR invitation includes
//   a guest. A "Bringing a guest?" box then appears under that person only.
//
// A guest can look up ANY member name to pull up the whole household.
// (These are placeholder names; replace with the real guest list.)

export type Guest = { name: string; plusOne?: boolean };
export type Household = { id: string; members: Guest[] };

export const households: Household[] = [
  { id: "smith", members: [{ name: "John Smith" }, { name: "Jane Smith" }, { name: "Martha Smith" }, { name: "Winnie Smith" }] },
  { id: "johnson", members: [{ name: "Alice Johnson", plusOne: true }, { name: "Bob Johnson" }] },
  { id: "williams", members: [{ name: "Carol Williams" }, { name: "David Williams" }] },
  { id: "davis", members: [{ name: "Emma Davis" }, { name: "Frank Davis" }] },
  { id: "miller", members: [{ name: "Grace Miller" }, { name: "Henry Miller" }] },
  { id: "wilson", members: [{ name: "Isabella Wilson" }, { name: "James Wilson" }] },
  { id: "moore", members: [{ name: "Katherine Moore" }, { name: "Liam Moore" }] },
  { id: "taylor", members: [{ name: "Mia Taylor" }, { name: "Noah Taylor" }] },
  { id: "anderson", members: [{ name: "Olivia Anderson" }, { name: "Peter Anderson" }] },
  { id: "thomas", members: [{ name: "Quinn Thomas" }, { name: "Rachel Thomas" }] },
  { id: "jackson", members: [{ name: "Samuel Jackson" }, { name: "Tina Jackson" }] },
  { id: "harris", members: [{ name: "Uma Harris" }, { name: "Victor Harris" }] },
  { id: "martin", members: [{ name: "Wendy Martin" }, { name: "Xavier Martin" }] },
  { id: "garcia", members: [{ name: "Yara Garcia" }, { name: "Zachary Garcia" }] },
];

export function findHousehold(name: string): Household | undefined {
  const n = name.trim().toLowerCase();
  return households.find((h) => h.members.some((m) => m.name.toLowerCase() === n));
}
