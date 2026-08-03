// Guest list grouped into households, so a whole family can RSVP at once.
//
// - `members`: everyone invited under this household (shown as checkboxes).
// - `allowPlusOne`: set true ONLY for households whose invitation includes a
//   plus-one. When false/omitted, the plus-one field is hidden entirely.
//
// A guest can look up ANY member name to pull up the whole household.
// (These are placeholder names — replace with the real guest list.)

export type Household = {
  id: string;
  members: string[];
  allowPlusOne?: boolean;
};

export const households: Household[] = [
  { id: "smith", members: ["John Smith", "Jane Smith", "Martha Smith", "Winnie Smith"] },
  { id: "johnson", members: ["Alice Johnson", "Bob Johnson"], allowPlusOne: true },
  { id: "williams", members: ["Carol Williams", "David Williams"] },
  { id: "davis", members: ["Emma Davis", "Frank Davis"] },
  { id: "miller", members: ["Grace Miller", "Henry Miller"] },
  { id: "wilson", members: ["Isabella Wilson", "James Wilson"] },
  { id: "moore", members: ["Katherine Moore", "Liam Moore"] },
  { id: "taylor", members: ["Mia Taylor", "Noah Taylor"] },
  { id: "anderson", members: ["Olivia Anderson", "Peter Anderson"] },
  { id: "thomas", members: ["Quinn Thomas", "Rachel Thomas"] },
  { id: "jackson", members: ["Samuel Jackson", "Tina Jackson"] },
  { id: "harris", members: ["Uma Harris", "Victor Harris"] },
  { id: "martin", members: ["Wendy Martin", "Xavier Martin"] },
  { id: "garcia", members: ["Yara Garcia", "Zachary Garcia"] },
];

export function findHousehold(name: string): Household | undefined {
  const n = name.trim().toLowerCase();
  return households.find((h) => h.members.some((m) => m.toLowerCase() === n));
}
