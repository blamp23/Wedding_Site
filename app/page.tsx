import SaveTheDate from "@/components/SaveTheDate";
import Gallery from "@/components/Gallery";

// Save-the-date phase: landing screen + photo gallery.
// The remaining full-site components (Navigation, Hero, CountdownTimer, OurStory,
// Venue, RSVP, Registry) remain in /components and can be re-added here once the
// formal invitation phase begins.
export default function Home() {
  return (
    <main>
      <SaveTheDate />
      <Gallery />
    </main>
  );
}
