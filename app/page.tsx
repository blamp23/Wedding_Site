import Navigation from "@/components/Navigation";
import SaveTheDate from "@/components/SaveTheDate";
import Gallery from "@/components/Gallery";
import Venue from "@/components/Venue";
import Accommodations from "@/components/Accommodations";
import RSVP from "@/components/RSVP";
import Registry from "@/components/Registry";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <SaveTheDate />
        <Gallery />
        <Venue />
        <Accommodations />
        <RSVP />
        <Registry />
      </main>
      <Footer />
    </>
  );
}
