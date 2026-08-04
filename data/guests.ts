// Guest list grouped into households, so a whole family can RSVP at once.
//
// - `members`: everyone invited under this household (shown as checkboxes).
// - Set `plusOne: true` on an individual member if THEIR invitation includes
//   an (unnamed) guest. A "Bringing a guest?" box appears under that person.
//
// A guest can look up ANY member name to pull up the whole household.
// After editing this list, re-seed the sheet roster (see seed URL).

export type Guest = { name: string; plusOne?: boolean };
export type Household = { id: string; members: Guest[] };

export const households: Household[] = [
  { id: "lamp", members: [
    { name: "Benji Lamp" },
    { name: "Alethia Lamp" },
    { name: "Michael Lamp" },
    { name: "Matthew Lamp" },
    { name: "Carmen Montemayor" },
  ] },
  { id: "lamp-grandparents", members: [
    { name: "Viki Lamp" },
    { name: "Michael Lamp (Grandpa)" }, // disambiguated: shares a name with the Michael Lamp above
  ] },
  { id: "rose", members: [
    { name: "Jake Rose" },
    { name: "Mckenna Song" },
  ] },
  { id: "guzman", members: [
    { name: "Martin Guzman" },
    { name: "Guillermo Aguilar" },
  ] },
  { id: "peed", members: [
    { name: "Nathan Peed" },
    { name: "Elizabeth Ohnesorge" },
  ] },
  { id: "underwood", members: [
    { name: "Kaylee Underwood" },
    { name: "Katie Underwood" },
    { name: "Gary Underwood" },
  ] },
  { id: "miller", members: [
    { name: "Mai Miller" },
    { name: "Eric Miller" },
  ] },
  { id: "escamilla", members: [
    { name: "Graciella Escamilla" },
    { name: "Roy Escamilla" },
  ] },
  { id: "dominguez", members: [
    { name: "Sonny Dominguez" },
  ] },
  { id: "perlman", members: [
    { name: "Julie Perlman" },
    { name: "Jamie Perlman" },
    { name: "Carson Perlman", plusOne: true },
    { name: "Brandon Perlman", plusOne: true },
  ] },
  { id: "cantu", members: [
    { name: "Mariana Cantu" },
    { name: "Jadon Morales" },
  ] },
  { id: "scheftel", members: [
    { name: "Chuck Scheftel" },
    { name: "Cari Scheftel" },
  ] },
  { id: "rositas", members: [
    { name: "Juan Carlos Rositas" },
  ] },
  { id: "resser", members: [
    { name: "Drew Resser", plusOne: true },
  ] },
  { id: "alex", members: [
    { name: "Rachel Alex", plusOne: true },
  ] },
  { id: "salazar", members: [
    { name: "Daniel Salazar", plusOne: true },
  ] },
  { id: "luna", members: [
    { name: "Yeciel Luna", plusOne: true },
  ] },
  { id: "villaruel", members: [
    { name: "Hayley Villaruel", plusOne: true },
    { name: "Sydney Villaruel", plusOne: true },
  ] },
  { id: "dolberry", members: [
    { name: "Katie Dolberry", plusOne: true },
    { name: "Les Dolberry" },
    { name: "Julia Dolberry" },
  ] },
  { id: "bowen", members: [
    { name: "Mike Bowen" },
    { name: "Mardi Bowen" },
    { name: "Drew Bowen", plusOne: true },
  ] },
  { id: "anderson", members: [
    { name: "Robin Anderson" },
    { name: "Wade Anderson" },
  ] },
  { id: "salmon", members: [
    { name: "Steve Salmon" },
    { name: "Nita Salmon" },
    { name: "Gracie Salmon" },
  ] },
];

export function findHousehold(name: string): Household | undefined {
  const n = name.trim().toLowerCase();
  return households.find((h) => h.members.some((m) => m.name.toLowerCase() === n));
}

// Flat list of every invited name (used to seed the sheet roster).
export function allInvitedNames(): string[] {
  return households.flatMap((h) => h.members.map((m) => m.name));
}
