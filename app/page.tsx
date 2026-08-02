import SaveTheDate from "@/components/SaveTheDate";

// Save-the-date phase: single landing screen.
// The full-site components (Navigation, Hero, CountdownTimer, OurStory, Gallery,
// Venue, RSVP, Registry) remain in /components and can be re-added here once the
// formal invitation phase begins.
export default function Home() {
  return (
    <main>
      <SaveTheDate />
    </main>
  );
}
