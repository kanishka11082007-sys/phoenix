import React, { useState } from 'react';
import { Sighting, SightingSource, SightingStatus } from '../types';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Video, 
  PhoneCall, 
  Users, 
  Bus, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface SightingTableProps {
  sightings: Sighting[];
  selectedSightingId: string | null;
  onSelectSighting: (sightingId: string) => void;
}

export const SightingTable: React.FC<SightingTableProps> = ({
  sightings,
  selectedSightingId,
  onSelectSighting,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');

  const filtered = sightings.filter((s) => {
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (sourceFilter !== 'ALL' && s.source !== sourceFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.code.toLowerCase().includes(q) ||
        s.locationName.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.clothingNotes.toLowerCase().includes(q) ||
        s.sourceRef.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSourceIcon = (source: SightingSource) => {
    switch (source) {
      case 'CCTV Upload': return <Video size={13} />;
      case 'Public Tip': return <PhoneCall size={13} />;
      case 'Partner Organization': return <Users size={13} />;
      case 'Transit Scanner': return <Bus size={13} />;
      default: return <Video size={13} />;
    }
  };

  const getStatusBadge = (status: SightingStatus) => {
    switch (status) {
      case 'Corroborated':
        return <span style={{ color: '#059669', fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '11px' }}>● Corroborated</span>;
      case 'AI Linked':
        return <span style={{ color: '#D97706', fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '11px' }}>★ AI Linked</span>;
      case 'Dismissed':
        return <span style={{ color: '#6B7280', fontWeight: 500, fontFamily: 'var(--font-mono)', fontSize: '11px' }}>✕ Dismissed</span>;
      default:
        return <span style={{ color: '#EAB308', fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '11px' }}>▲ Pending</span>;
    }
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <h3 className="panel-title">
          <span>Incoming Sightings Master Roster</span>
        </h3>
        <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {filtered.length} Ingested Records
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ padding: '14px 18px', background: 'var(--bg-surface-subtle)', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search report ID, keywords, clothing tags, location..."
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

        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-medium)',
            background: '#FFFFFF',
          }}
        >
          <option value="ALL">All Sources</option>
          <option value="CCTV Upload">CCTV Upload</option>
          <option value="Public Tip">Public Tip</option>
          <option value="Partner Organization">Partner Organization</option>
          <option value="Transit Scanner">Transit Scanner</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-medium)',
            background: '#FFFFFF',
          }}
        >
          <option value="ALL">All Statuses</option>
          <option value="Corroborated">Corroborated</option>
          <option value="AI Linked">AI Linked</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Dismissed">Dismissed</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface-subtle)', borderBottom: '1px solid var(--border-medium)', fontFamily: 'var(--font-heading)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px 16px' }}>Report ID</th>
              <th style={{ padding: '10px 16px' }}>Source / Ingest Ref</th>
              <th style={{ padding: '10px 16px' }}>Reported Time</th>
              <th style={{ padding: '10px 16px' }}>Location</th>
              <th style={{ padding: '10px 16px' }}>Corroboration Notes</th>
              <th style={{ padding: '10px 16px' }}>Status</th>
              <th style={{ padding: '10px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const isSelected = selectedSightingId === s.id;
              return (
                <tr
                  key={s.id}
                  style={{
                    borderBottom: '1px solid var(--border-light)',
                    backgroundColor: isSelected ? 'var(--accent-orange-subtle)' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onClick={() => onSelectSighting(s.id)}
                >
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {s.code}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                      {getSourceIcon(s.source)}
                      <span>{s.source}</span>
                    </div>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {s.sourceRef}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                    <div>{s.reportedTime}</div>
                    <div style={{ color: 'var(--accent-orange)', fontSize: '11px' }}>+{s.elapsedMinutes}m elapsed</div>
                  </td>
                  <td style={{ padding: '12px 16px', maxWidth: '240px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.locationName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.description}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', maxWidth: '220px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {s.clothingNotes}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {getStatusBadge(s.status)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSighting(s.id);
                      }}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-heading)',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'var(--accent-orange)' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                        cursor: 'pointer',
                      }}
                    >
                      {isSelected ? 'Inspecting' : 'Inspect'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
