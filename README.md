# Benji & Mary-Kate — Wedding Website

Next.js wedding website focused on the July 2026 engagement party.

## Running locally

```bash
npm install
cp .env.local.example .env.local   # fill in Google Sheets credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Customizing content

| What to change | Where |
|---|---|
| Party date / time | `components/CountdownTimer.tsx` — `PARTY_DATE` constant |
| Venue name, address, dress code | `components/Venue.tsx` |
| Venue Google Map | `components/Venue.tsx` — replace the `<iframe src>` with your embed URL |
| Our Story milestones | `components/OurStory.tsx` — `milestones` array |
| Gallery photos | `components/Gallery.tsx` — `photos` array (swap Unsplash URLs for your own) |
| Registry links | `components/Registry.tsx` — `registries` array |
| Guest list | `data/guests.json` — add/remove names (full names, one per line) |
| RSVP deadline | `components/RSVP.tsx` — the date in the hint text |
| Contact email | `components/Footer.tsx` |

---

## Google Sheets RSVP setup

RSVPs are stored in a Google Sheet. Follow these steps once before deploying:

### 1 — Create the sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new sheet
2. Name the first tab `RSVPs`
3. Add headers in row 1: `Timestamp`, `Name`, `Attending`, `Dietary`, `Plus One`
4. Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/**SHEET_ID**/edit`

### 2 — Create a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use an existing one)
3. Enable the **Google Sheets API**
4. Go to **IAM & Admin → Service Accounts** → Create service account
5. Download the JSON key file

### 3 — Share the sheet

Share your Google Sheet with the service account email (found in the JSON key) — give it **Editor** access.

### 4 — Set environment variables

Fill in `.env.local`:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GOOGLE_SHEET_ID=your-sheet-id
```

> The private key must keep the `\n` characters — wrap it in double quotes.

---

## Deploying to Vercel

1. Push this repo to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Add the three env vars (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`) in the Vercel project settings
4. Deploy — Vercel auto-deploys on every push to `main`

---

## Adding your own photos

Replace the Unsplash placeholder URLs in `components/Gallery.tsx`:

```ts
const photos: Photo[] = [
  { src: "/images/your-photo.jpg", width: 800, height: 1067, alt: "Caption" },
  // ...
];
```

Put your images in `public/images/` and reference them as `/images/filename.jpg`.

---

## Tech stack

- **Next.js 14** (App Router)
- **Tailwind CSS** — cream + dark green design system
- **Framer Motion** — scroll animations
- **react-photo-album v3** + **yet-another-react-lightbox** — photo gallery
- **googleapis** — Google Sheets RSVP backend
