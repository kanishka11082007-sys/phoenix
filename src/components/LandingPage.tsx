import React from 'react';
import { EvidenceTape } from './EvidenceTape';
import { 
  ShieldAlert, 
  ArrowRight, 
  Layers, 
  MapPin, 
  Eye, 
  BrainCircuit, 
  Lock, 
  FileCheck2, 
  AlertTriangle 
} from 'lucide-react';

interface LandingPageProps {
  onOpenWorkspace: () => void;
  onOpenDemoCase: (caseId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenWorkspace,
  onOpenDemoCase,
}) => {
  return (
    <div className="landing-container">
      {/* Evidence Tape Crossing X in Hero Background */}
      <EvidenceTape phrase="INVESTIGATION IN PROGRESS" />

      {/* Top Navigation */}
      <header className="landing-nav">
        <div className="phoenix-logo-lockup">
          <div className="phoenix-icon-badge" aria-hidden="true">
            <ShieldAlert size={20} />
          </div>
          <div className="phoenix-wordmark">
            <span>PHOENIX</span>
            <span className="subtitle">SIGHTING INTELLIGENCE</span>
          </div>
        </div>

        <div className="landing-auth-badge">
          <span className="status-dot status-dot-pulse" aria-hidden="true"></span>
          <span>AUTHORIZED INVESTIGATOR ACCESS ONLY</span>
        </div>
      </header>

      {/* Hero Content Area */}
      <main className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-pill">
            <AlertTriangle size={13} color="#B45309" />
            <span>ACTIVE INCIDENT RESPONSE PLATFORM</span>
          </div>

          <h1 className="landing-headline">
            Every sighting is a clue.{' '}
            <span className="highlight">Bring them into one case view.</span>
          </h1>

          <p className="landing-description">
            PHOENIX aggregates multi-source sightings—including authorized municipal CCTV, 
            transit telemetry, and verified public reports—into a unified chronological 
            trajectory map with investigator-controlled AI correlation.
          </p>

          <div className="landing-actions">
            <button 
              id="btn-open-workspace"
              className="btn-primary" 
              onClick={onOpenWorkspace}
            >
              <span>Open Case Workspace</span>
              <ArrowRight size={18} />
            </button>

            <button 
              id="btn-view-demo-case"
              className="btn-secondary" 
              onClick={() => onOpenDemoCase('case-014')}
            >
              <span>View Demo Case (DEMO-014)</span>
              <Eye size={17} />
            </button>
          </div>

          {/* Key Capabilities Row */}
          <div className="landing-specs-row">
            <div className="spec-item">
              <Layers size={18} className="spec-item-icon" />
              <div>
                <div className="spec-item-title">Multi-Source Feeds</div>
                <div className="spec-item-desc">CCTV uploads, public hotlines, partner patrols</div>
              </div>
            </div>

            <div className="spec-item">
              <BrainCircuit size={18} className="spec-item-icon" />
              <div>
                <div className="spec-item-title">AI Link Analysis</div>
                <div className="spec-item-desc">Surfaces unverified correlations for human decision</div>
              </div>
            </div>

            <div className="spec-item">
              <MapPin size={18} className="spec-item-icon" />
              <div>
                <div className="spec-item-title">Tactical Trajectory</div>
                <div className="spec-item-desc">Chronological distance & route feasibility mapping</div>
              </div>
            </div>

            <div className="spec-item">
              <FileCheck2 size={18} className="spec-item-icon" />
              <div>
                <div className="spec-item-title">Strict Audit Log</div>
                <div className="spec-item-desc">Chain-of-custody verification for every decision</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Responsible Use & Privacy Disclaimer Footer */}
      <footer className="landing-footer">
        <div className="privacy-notice">
          <Lock size={13} />
          <span>PROTOTYPE NOTICE: Uses strictly fictional demo data, mock locations, and geometric placeholders. No real children's imagery or PII is used.</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#8891A0' }}>
          CONFIDENTIAL • RESTRICTED ACCESS
        </div>
      </footer>
    </div>
  );
};
