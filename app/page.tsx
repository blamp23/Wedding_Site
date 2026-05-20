import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CountdownTimer from "@/components/CountdownTimer";
import OurStory from "@/components/OurStory";
import Gallery from "@/components/Gallery";
import Venue from "@/components/Venue";
import RSVP from "@/components/RSVP";
import Registry from "@/components/Registry";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <CountdownTimer />
        <OurStory />
        <Gallery />
        <Venue />
        <RSVP />
        <Registry />
      </main>
      <Footer />
    </>
  );
}
