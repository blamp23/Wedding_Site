import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mary-Kate & Benji | Save the Date",
  description:
    "Mary-Kate Mitchell & Benji Lamp are getting married June 5, 2027 at Anthony Chapel, Garvan Woodland Gardens, Hot Springs, Arkansas. Formal invitation to follow.",
  openGraph: {
    title: "Mary-Kate & Benji | Save the Date",
    description:
      "We're getting married June 5, 2027 in Hot Springs, Arkansas. Formal invitation to follow.",
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
