import React, { useState } from 'react';
import { Sighting, SightingSource } from '../types';
import { 
  Clock, 
  Video, 
  PhoneCall, 
  Users, 
  Bus, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Filter,
  Search
} from 'lucide-react';

interface SightingTimelineProps {
  sightings: Sighting[];
  selectedSightingId: string | null;
  onSelectSighting: (sightingId: string) => void;
}

export const SightingTimeline: React.FC<SightingTimelineProps> = ({
  sightings,
  selectedSightingId,
  onSelectSighting,
}) => {
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sort chronologically by elapsed time
  const sorted = [...sightings].sort((a, b) => a.elapsedMinutes - b.elapsedMinutes);

  const filtered = sorted.filter((s) => {
    if (sourceFilter !== 'ALL' && s.source !== sourceFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.code.toLowerCase().includes(q) ||
        s.locationName.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.clothingNotes.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSourceIcon = (source: SightingSource) => {
    switch (source) {
      case 'CCTV Upload':
        return <Video size={12} />;
      case 'Public Tip':
        return <PhoneCall size={12} />;
      case 'Partner Organization':
        return <Users size={12} />;
      case 'Transit Scanner':
        return <Bus size={12} />;
      default:
        return <Video size={12} />;
    }
  };

  const getSourcePillClass = (source: SightingSource) => {
    switch (source) {
      case 'CCTV Upload':
        return 'pill-cctv';
      case 'Public Tip':
        return 'pill-tip';
      case 'Partner Organization':
        return 'pill-partner';
      case 'Transit Scanner':
        return 'pill-transit';
      default:
        return 'pill-cctv';
    }
  };

  const getStatusBadge = (status: Sighting['status']) => {
    switch (status) {
      case 'Corroborated':
        return (
          <span style={{ color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            <CheckCircle2 size={12} />
            Corroborated
          </span>
        );
      case 'AI Linked':
        return (
          <span style={{ color: '#D97706', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            <Sparkles size={12} />
            AI Linked
          </span>
        );
      case 'Dismissed':
        return (
          <span style={{ color: '#6B7280', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            Dismissed
          </span>
        );
      case 'Pending Review':
      default:
        return (
          <span style={{ color: '#D97706', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            <AlertCircle size={12} />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <h3 className="panel-title">
          <Clock size={16} color="var(--accent-orange)" />
          <span>Chronological Timeline</span>
        </h3>
        <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {filtered.length} of {sightings.length} Reports
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--bg-surface-subtle)' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search location, code, clothing..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px 6px 30px',
              fontSize: '12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-medium)',
              background: '#FFFFFF',
            }}
          />
        </div>

        {/* Source Pills */}
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
          {['ALL', 'CCTV Upload', 'Public Tip', 'Partner Organization'].map((src) => (
            <button
              key={src}
              onClick={() => setSourceFilter(src)}
              style={{
                padding: '3px 8px',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                borderRadius: 'var(--radius-full)',
                border: sourceFilter === src ? '1px solid var(--accent-orange)' : '1px solid var(--border-medium)',
                background: sourceFilter === src ? 'var(--accent-orange-subtle)' : '#FFFFFF',
                color: sourceFilter === src ? 'var(--accent-orange)' : 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {src}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="panel-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
            <AlertCircle size={24} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
            <p style={{ fontSize: '13px' }}>No sightings match the selected filter criteria.</p>
          </div>
        ) : (
          <div className="timeline-list">
            {filtered.map((s) => {
              const isSelected = selectedSightingId === s.id;
              return (
                <div
                  key={s.id}
                  id={`timeline-item-${s.id}`}
                  className={`timeline-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectSighting(s.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectSighting(s.id);
                    }
                  }}
                >
                  <div className="timeline-header">
                    <div className="timeline-time-group">
                      <span className="timeline-code">{s.code}</span>
                      <span className="timeline-elapsed">+{s.elapsedMinutes}m</span>
                    </div>

                    <span className={`timeline-source-pill ${getSourcePillClass(s.source)}`}>
                      {getSourceIcon(s.source)}
                      <span>{s.source.split(' ')[0]}</span>
                    </span>
                  </div>

                  <div className="timeline-location" title={s.locationName}>
                    {s.locationName}
                  </div>

                  <div className="timeline-snippet">
                    {s.description}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed var(--border-light)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                      {s.reportedTime}
                    </span>
                    {getStatusBadge(s.status)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
