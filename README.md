# PHOENIX — Sighting Intelligence & Case Review Workspace

> **Notice:** Prototype demonstration using strictly fictional demo data, mock locations, and neutral geometric placeholders. Designed for authorized investigative workflow evaluation.

**PHOENIX** is a focused, responsive frontend prototype engineered for law enforcement and authorized case teams to organize, cross-reference, and review sightings in missing-child operations.

---

## Key Features

- **Investigation Landing Page**: Hero section featuring crossed black-and-yellow hazard evidence tape (**“INVESTIGATION IN PROGRESS”**) with restrained settling motion and reduced-motion compliance.
- **Investigator Workspace**: Clean case specification banner, lead investigator credentials (`INV-4082`), last-known timeline, and privacy-preserving biometric silhouettes (no real photos).
- **Tactical Matrix**:
  - **Chronological Timeline**: Multi-source reports (authorized municipal CCTV, verified public tips, partner youth patrols, transit scanners).
  - **Interactive Schematic Tactical Map**: Custom SVG grid with named sectors, distance range rings (500m, 1.0km, 2.0km), and connected directional trajectory lines.
  - **Detail Inspection Drawer**: Deep dive on camera footage IDs, confidence metrics, and editable investigator notes saved directly to the audit log.
- **Human-in-the-Loop AI Suggestions**:
  - Unverified probabilistic correlation cards with correlation factor breakdown and evidence citations.
  - Investigator actions: **Confirm Link**, **Dismiss**, or **Needs More Information**.
- **Tamper-Evident Chain-of-Custody Log**: Full chronological audit trail of all investigator decisions and status updates.
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
2. **No Real Child Imagery**: Stylized geometric avatars are used strictly in place of real photos.
3. **Mandatory Human Verification**: AI models generate *unverified suggestions* only; human investigators must confirm or dismiss every correlation.
4. **Restricted Distribution**: No autonomous alerts or public broadcasting features.
