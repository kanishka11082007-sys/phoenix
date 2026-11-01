# PHOENIX — Sighting Intelligence & Case Review Workspace

> **SIMULATED CASEWORK NOTICE:** Prototype demonstration using strictly fictional demo data, Delhi neighbourhood locations, and neutral geometric placeholders. Designed for authorized investigative workflow evaluation. All persons, case files, sightings, and timelines are entirely fictional. Zero real-world PII, exact coordinates, or child imagery is used.

**PHOENIX** is a focused, responsive frontend prototype engineered for law enforcement and authorized case teams to organize, cross-reference, and review sightings in missing-child operations.

---

## Fictional Delhi Demonstration Dataset

The prototype comes seeded immediately with **7 fictional cases set across Delhi neighbourhoods**:

1. **`DEMO-DEL-014` — Mira Sharma** (Age 9, Connaught Place): **Active Priority 1**
   - 5 multi-source sightings across Rajiv Chowk Metro Concourse (CCTV upload), Regal Plaza shelter (Public hotline), Karol Bagh Metro Exit (CCTV upload), Karol Bagh Central Market (Partner organization — Childline), and Pusa Road overpass.
   - 3 AI suggested correlations along the DMRC Blue Line transit corridor.
2. **`DEMO-DEL-022` — Kabir Mehta** (Age 11, Dwarka): **In Review**
   - Single sighting awaiting investigator review at Dwarka Sector 12 City Centre Bus Terminus Platform 3.
3. **`DEMO-DEL-031` — Zoya Kapoor** (Age 8, Lajpat Nagar): **Active Priority 1**
   - Confirmed investigator-reviewed link established between Central Market pedestrian crossing and Violet Line Metro Concourse.
4. **`DEMO-DEL-008` — Aarav Roy** (Age 7, Rohini): **Closed Case**
   - Resolved: Safely located by Delhi Childline volunteers at Rohini West Metro Station information kiosk.
5. **`DEMO-DEL-019` — Ananya Verma** (Age 12, Hauz Khas): **In Review**
   - Public tip hotline reports near Sri Aurobindo Marg transit shelter.
6. **`DEMO-DEL-005` — Rohan Gupta** (Age 13, Saket): **Archived Case**
   - Resolved: Reunited with family via partner youth safe-harbor outreach facility.
7. **`DEMO-DEL-042` — Diya Malhotra** (Age 10, Chandni Chowk): **In Review**
   - Town Hall heritage walkway sighting reported by local shopkeeper.

---

## Key Features

- **Seeded Casework on Load**: Opens immediately into the active Delhi case workspace (`DEMO-DEL-014 Mira Sharma`).
- **Master Case Roster**: Search, filter by status (`Active Priority 1`, `In Review`, `Closed`), and open any case file.
- **Investigation Landing Page**: Hero section featuring crossed black-and-yellow hazard evidence tape (**“INVESTIGATION IN PROGRESS”**) with restrained settling motion.
- **Investigator Workspace**: Clean case specification banner, lead investigator credentials (`INV-DEL-4082`), last-known timeline, and privacy-preserving biometric silhouettes (no real photos).
- **Tactical Matrix**:
  - **Chronological Timeline**: Multi-source reports (DMRC CCTV feeds, verified public tips, Delhi Childline 1098, partner patrols).
  - **Interactive Schematic Tactical Map**: Custom SVG grid with Delhi geographic corridors (Yamuna River Arterial, Connaught Place Radial Corridor, Karol Bagh Hub, DMRC Blue Line Transit Vector), distance range rings, and directional trajectory flow.
  - **Detail Inspection Drawer**: Deep dive on camera footage IDs, optical confidence metrics, and editable investigator notes saved directly to the audit log.
- **Human-in-the-Loop AI Suggestions**:
  - Labeled **AI suggestion · Unverified** until reviewed.
  - Correlation factors breakdown (attire similarity, transit feasibility, physical biometrics) and evidence citations.
  - Investigator actions: **Confirm Link**, **Dismiss**, or **Needs More Information**.
- **Tamper-Evident Chain-of-Custody Log**: Full chronological audit trail of all investigator decisions and status updates in IST.
- **Interactive Modals**: Ingest fictional sighting reports, create new demo cases, and edit case specifications.

---

## Tech Stack & Design System

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Pure Modern Vanilla CSS with custom properties & design tokens
- **Color Palette**:
  - Warm White: `#FAF8F5`
  - Tactical Charcoal / Black: `#121316` / `#1A1D22`
  - Accent Orange: `#FF5528`
  - Yellow Caution: `#FFD84D`
  - Dividers & Borders: `#E5DFD6`
- **Typography**:
  - Display Headings: **Barlow Condensed**
  - Interface Text: **IBM Plex Sans**
  - Telemetry & Codes: **IBM Plex Mono**
  - Scoped Secondary Descriptions: **Comic Sans** (exclusively applied to small light black secondary descriptions and notes, keeping all headings, numbers, buttons, and badges in crisp technical typography)

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/kanishka11082007-sys/phoenix.git
cd phoenix

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Build & Typecheck

```bash
# Type check and build production bundle
npm run build
```

---

## Privacy & Responsible Use

1. **Synthetic Data Only**: All demo cases, identities, clothing descriptions, and sightings are entirely fictional.
2. **No Real Child Imagery**: Stylized geometric silhouettes are used strictly in place of real photos.
3. **Mandatory Human Verification**: AI models generate *unverified suggestions* only; human investigators must confirm or dismiss every correlation.
4. **General Neighbourhoods Only**: Locations are kept to general Delhi neighbourhoods (Dwarka, Rohini, Karol Bagh, Lajpat Nagar, Connaught Place, Hauz Khas, Saket, Chandni Chowk) with no real home addresses or real tracking routes.
