import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Benji & Mary-Kate | Engagement Party",
  description: "Join us in celebrating the engagement of Benji Lamp and Mary-Kate Mitchell.",
  openGraph: {
    title: "Benji & Mary-Kate | Engagement Party",
    description: "Join us in celebrating our engagement. RSVP for our July party.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
