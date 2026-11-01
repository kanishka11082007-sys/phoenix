import React, { useState } from 'react';
import { Case, CaseStatus } from '../types';
import { 
  FolderSearch, 
  PlusCircle, 
  Search, 
  MapPin, 
  Clock, 
  User, 
  ArrowRight,
  ShieldAlert,
  Lock
} from 'lucide-react';

interface CaseListViewProps {
  cases: Case[];
  activeCaseId: string;
  onSelectCase: (caseId: string) => void;
  onOpenNewCaseModal: () => void;
}

export const CaseListView: React.FC<CaseListViewProps> = ({
  cases,
  activeCaseId,
  onSelectCase,
  onOpenNewCaseModal,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filtered = cases.filter((c) => {
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.alias.toLowerCase().includes(q) ||
        c.lastSeenLocation.toLowerCase().includes(q) ||
        c.leadInvestigator.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case 'Active Priority 1':
        return (
          <span className="case-status-badge badge-active">
            <span className="status-dot" style={{ backgroundColor: 'currentColor' }} />
            {status}
          </span>
        );
      case 'In Review':
        return (
          <span className="case-status-badge badge-review">
            {status}
          </span>
        );
      case 'Closed':
      case 'Archived':
        return (
          <span className="case-status-badge badge-closed">
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FolderSearch size={18} color="var(--accent-orange)" />
          <h3 className="panel-title" style={{ margin: 0 }}>
            Master Case Roster
          </h3>
        </div>

        <button 
          id="btn-create-case-roster"
          className="btn-primary" 
          style={{ fontSize: '13px', padding: '8px 14px' }}
          onClick={onOpenNewCaseModal}
        >
          <PlusCircle size={15} />
          <span>New Demo Case</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ padding: '14px 18px', background: 'var(--bg-surface-subtle)', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search case code, alias, lead investigator, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 32px',
              fontSize: '13px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-medium)',
              background: '#FFFFFF',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'Active Priority 1', 'In Review', 'Closed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '6px 12px',
                fontSize: '11px',
                fontFamily: 'var(--font-heading)',
                textTransform: 'uppercase',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: filterStatus === st ? '1px solid var(--accent-orange)' : '1px solid var(--border-medium)',
                background: filterStatus === st ? 'var(--accent-orange)' : '#FFFFFF',
                color: filterStatus === st ? '#FFFFFF' : 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Case Cards Grid */}
      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
        {filtered.map((c) => {
          const isActive = c.id === activeCaseId;
          return (
            <div
              key={c.id}
              style={{
                background: isActive ? '#FFFDFB' : '#FFFFFF',
                border: isActive ? '2px solid var(--accent-orange)' : '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="case-code-chip">{c.code}</span>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', background: '#FEF08A', color: '#713F12', padding: '1px 6px', borderRadius: '3px', fontWeight: 700 }}>
                      {c.simulationBadge || 'SIMULATED CASE'}
                    </span>
                    {c.neighbourhood && (
                      <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', background: 'var(--bg-surface-subtle)', color: 'var(--text-secondary)', padding: '1px 6px', borderRadius: '3px', border: '1px solid var(--border-medium)' }}>
                        DELHI • {c.neighbourhood}
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                    {c.title}
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '6px' }}>
                      (Age {c.age} • Alias: "{c.alias}")
                    </span>
                  </h4>
                </div>

                {getStatusBadge(c.status)}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={13} color="var(--accent-orange)" />
                  <span>Last Seen: <strong>{c.lastSeenLocation}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={13} color="var(--accent-orange)" />
                  <span>Time: <strong>{c.lastSeenTime}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={13} color="var(--text-muted)" />
                  <span>Lead: <strong>{c.leadInvestigator}</strong> ({c.investigatorBadge})</span>
                </div>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', background: 'var(--bg-surface-subtle)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                {c.summary}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {c.clothingTags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="clothing-tag" style={{ fontSize: '10px' }}>
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  id={`btn-open-case-${c.id}`}
                  onClick={() => onSelectCase(c.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-heading)',
                    textTransform: 'uppercase',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    background: isActive ? 'var(--accent-orange)' : 'var(--bg-charcoal)',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  <span>{isActive ? 'Active Workspace' : 'Open Case'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
