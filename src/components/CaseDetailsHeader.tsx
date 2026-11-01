import React from 'react';
import { Case } from '../types';
import { 
  MapPin, 
  Clock, 
  User, 
  ShieldAlert, 
  Plus, 
  Edit3, 
  Layers, 
  Lock,
  ChevronDown,
  FolderSearch
} from 'lucide-react';

interface CaseDetailsHeaderProps {
  activeCase: Case;
  casesList: Case[];
  onSelectCase: (caseId: string) => void;
  onOpenAddSightingModal: () => void;
  onOpenEditCaseModal: () => void;
  onOpenCaseRoster?: () => void;
}

export const CaseDetailsHeader: React.FC<CaseDetailsHeaderProps> = ({
  activeCase,
  casesList,
  onSelectCase,
  onOpenAddSightingModal,
  onOpenEditCaseModal,
  onOpenCaseRoster,
}) => {
  const getStatusBadgeClass = (status: Case['status']) => {
    switch (status) {
      case 'Active Priority 1':
        return 'badge-active';
      case 'In Review':
        return 'badge-review';
      case 'Closed':
      case 'Archived':
        return 'badge-closed';
      default:
        return 'badge-review';
    }
  };

  return (
    <section className="case-banner" aria-label="Active Case Details">
      <div className="case-banner-inner">
        {/* Neutral Geometric Silhouette Biometric Placeholder (Zero real child photos!) */}
        <div className="case-avatar-box" title="Geometric Biometric Silhouette (Privacy Guard Enabled)">
          <svg 
            className="case-avatar-silhouette" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            aria-hidden="true"
          >
            <circle cx="12" cy="7" r="4.5" />
            <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
          <div className="privacy-lock-tag">
            <Lock size={8} style={{ display: 'inline', marginRight: '2px' }} />
            SYNTHETIC
          </div>
        </div>

        {/* Case Info Main Column */}
        <div className="case-info-main">
          <div className="case-meta-top">
            <span className="case-code-chip">{activeCase.code}</span>
            <span 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                background: '#FEF08A',
                color: '#713F12',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #EAB308',
                letterSpacing: '0.05em'
              }}
            >
              {activeCase.simulationBadge || 'SIMULATED CASE'}
            </span>
            {activeCase.neighbourhood && (
              <span 
                style={{
                  padding: '2px 8px',
                  background: 'var(--bg-surface-subtle)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-medium)'
                }}
              >
                DELHI • {activeCase.neighbourhood}
              </span>
            )}
            <h2 className="case-title">
              {activeCase.title}
              <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-muted)' }}>
                (Age {activeCase.age} • Alias: "{activeCase.alias}")
              </span>
            </h2>

            <div className={`case-status-badge ${getStatusBadgeClass(activeCase.status)}`}>
              <span className="status-dot" style={{ backgroundColor: 'currentColor' }} />
              <span>{activeCase.status}</span>
            </div>

            {/* Quick Case Switcher */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <select
                  id="case-switcher-select"
                  aria-label="Switch active case"
                  value={activeCase.id}
                  onChange={(e) => onSelectCase(e.target.value)}
                  style={{
                    padding: '3px 24px 3px 10px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-surface-subtle)',
                    cursor: 'pointer',
                    appearance: 'none',
                  }}
                >
                  {casesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      Switch Case: {c.code} ({c.title})
                    </option>
                  ))}
                </select>
                <ChevronDown 
                  size={12} 
                  style={{ 
                    position: 'absolute', 
                    right: '8px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    pointerEvents: 'none',
                    color: 'var(--text-muted)'
                  }} 
                />
              </div>

              {onOpenCaseRoster && (
                <button
                  id="btn-view-all-cases"
                  onClick={onOpenCaseRoster}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-heading)',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-surface-subtle)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                  }}
                  title="Open Master Case Roster"
                >
                  <FolderSearch size={12} color="var(--accent-orange)" />
                  <span>Case Roster ({casesList.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Last Seen Details */}
          <div className="case-descriptors-row">
            <div className="descriptor-item">
              <MapPin size={15} color="var(--accent-orange)" />
              <span>Last Known: <strong>{activeCase.lastSeenLocation}</strong></span>
            </div>
            <div className="descriptor-item">
              <Clock size={15} color="var(--accent-orange)" />
              <span>Reported: <strong>{activeCase.lastSeenTime}</strong></span>
            </div>
            <div className="descriptor-item">
              <User size={15} color="var(--text-muted)" />
              <span>Lead: <strong>{activeCase.leadInvestigator}</strong> ({activeCase.investigatorBadge})</span>
            </div>
          </div>

          {/* Physical & Clothing Description */}
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Physical Profile: </strong> 
            {activeCase.physicalDescription}
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Last Attire: </strong> 
            {activeCase.clothingDescription}
          </div>

          {/* Clothing Tag Chips */}
          <div className="case-clothing-tags">
            {activeCase.clothingTags.map((tag, i) => (
              <span key={i} className="clothing-tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="case-banner-actions">
          <button 
            id="btn-add-sighting-modal"
            className="btn-primary" 
            style={{ fontSize: '14px', padding: '10px 16px' }}
            onClick={onOpenAddSightingModal}
          >
            <Plus size={16} />
            <span>Add Sighting</span>
          </button>

          <button 
            id="btn-edit-case-modal"
            className="btn-secondary" 
            style={{ fontSize: '13px', padding: '8px 14px' }}
            onClick={onOpenEditCaseModal}
          >
            <Edit3 size={14} />
            <span>Edit Case Specs</span>
          </button>
        </div>
      </div>
    </section>
  );
};
