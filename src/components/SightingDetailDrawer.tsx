import React, { useState, useEffect } from 'react';
import { Sighting } from '../types';
import { 
  FileText, 
  MapPin, 
  Clock, 
  Video, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Save, 
  Layers, 
  Sparkles,
  Link2
} from 'lucide-react';

interface SightingDetailDrawerProps {
  sighting: Sighting | null;
  onUpdateStatus: (sightingId: string, newStatus: Sighting['status'], note?: string) => void;
  onSaveNotes: (sightingId: string, notes: string) => void;
  onSelectSightingByCode: (code: string) => void;
}

export const SightingDetailDrawer: React.FC<SightingDetailDrawerProps> = ({
  sighting,
  onUpdateStatus,
  onSaveNotes,
  onSelectSightingByCode,
}) => {
  const [notes, setNotes] = useState('');
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (sighting) {
      setNotes(sighting.investigatorNotes || '');
      setHasSaved(false);
    }
  }, [sighting]);

  if (!sighting) {
    return (
      <div className="workspace-panel" style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <FileText size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
        <h4 className="font-heading" style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '6px' }}>
          No Sighting Selected
        </h4>
        <p style={{ fontSize: '13px' }}>
          Select any sighting from the timeline or map to inspect evidence frames, telemetry, and link correlations.
        </p>
      </div>
    );
  }

  const handleNotesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNotes(sighting.id, notes);
    setHasSaved(true);
    setTimeout(() => setHasSaved(false), 2500);
  };

  return (
    <div className="detail-drawer" aria-label="Sighting Inspection Drawer">
      {/* Drawer Header */}
      <div className="drawer-header">
        <div>
          <span className="drawer-code">{sighting.code}</span>
          <h3 className="font-heading" style={{ fontSize: '18px', color: 'var(--text-primary)', marginTop: '2px' }}>
            {sighting.locationName}
          </h3>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ 
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            backgroundColor: sighting.status === 'Corroborated' ? '#DCFCE7' : sighting.status === 'Dismissed' ? '#F3F4F6' : '#FEF08A',
            color: sighting.status === 'Corroborated' ? '#166534' : sighting.status === 'Dismissed' ? '#374151' : '#854D0E',
            border: '1px solid currentColor'
          }}>
            {sighting.status}
          </span>
        </div>
      </div>

      {/* Meta Specifications Grid */}
      <div className="drawer-meta-grid">
        <div className="meta-field">
          <label>Source Type</label>
          <span>{sighting.source}</span>
        </div>

        <div className="meta-field">
          <label>Reported Time</label>
          <span>{sighting.reportedTime} (+{sighting.elapsedMinutes}m)</span>
        </div>

        <div className="meta-field">
          <label>Confidence Metric</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: sighting.confidenceScore > 80 ? '#10B981' : '#F59E0B' }}>
              {sighting.confidenceScore}%
            </span>
            <div style={{ flex: 1, height: '4px', background: 'var(--border-medium)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${sighting.confidenceScore}%`, height: '100%', background: sighting.confidenceScore > 80 ? '#10B981' : '#F59E0B' }} />
            </div>
          </div>
        </div>

        <div className="meta-field">
          <label>Source Reference</label>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>{sighting.sourceRef}</span>
        </div>
      </div>

      {/* Raw Description */}
      <div>
        <label className="font-heading" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Ingested Narrative Description
        </label>
        <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px', lineHeight: '1.5', background: 'var(--bg-surface-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
          {sighting.description}
        </p>
      </div>

      {/* Attire & Physical Match Notes */}
      <div>
        <label className="font-heading" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Clothing & Feature Corroboration
        </label>
        <p style={{ fontSize: '13px', color: '#1E293B', marginTop: '4px', lineHeight: '1.5', borderLeft: '3px solid var(--accent-orange)', paddingLeft: '10px' }}>
          {sighting.clothingNotes}
        </p>
      </div>

      {/* Evidence Frame Snippet */}
      {sighting.evidenceSnippet && (
        <div style={{ background: '#121417', color: '#E2DDD5', padding: '10px 12px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
          <div style={{ color: 'var(--accent-yellow)', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Video size={12} />
            EVIDENCE SNIPPET / METADATA
          </div>
          <div>{sighting.evidenceSnippet}</div>
        </div>
      )}

      {/* Linked Sighting References */}
      {sighting.linkedSightingCodes && sighting.linkedSightingCodes.length > 0 && (
        <div>
          <label className="font-heading" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Link2 size={12} />
            Correlated Sightings in Chain
          </label>
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            {sighting.linkedSightingCodes.map((code) => (
              <button
                key={code}
                onClick={() => onSelectSightingByCode(code)}
                style={{
                  padding: '3px 8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  background: 'var(--bg-charcoal)',
                  color: 'var(--accent-yellow)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                }}
              >
                Inspect {code} →
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Investigator Notes Form */}
      <form onSubmit={handleNotesSubmit} className="investigator-notes-area">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label>Investigator Assessment Notes</label>
          {hasSaved && (
            <span style={{ fontSize: '11px', color: '#10B981', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              ✓ Saved to audit log
            </span>
          )}
        </div>
        <textarea
          placeholder="Enter investigator observations, camera angle notes, or tasking follow-up..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          type="submit"
          style={{
            alignSelf: 'flex-end',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            fontFamily: 'var(--font-heading)',
            textTransform: 'uppercase',
            fontWeight: 700,
            background: 'var(--text-primary)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
        >
          <Save size={13} />
          <span>Save Assessment</span>
        </button>
      </form>

      {/* Quick Status Adjuster */}
      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
        <label className="font-heading" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
          Investigator Decision
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            onClick={() => onUpdateStatus(sighting.id, 'Corroborated', 'Investigator verified description match with high certainty.')}
            disabled={sighting.status === 'Corroborated'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 10px',
              fontSize: '12px',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
              background: sighting.status === 'Corroborated' ? '#E5E7EB' : '#10B981',
              color: sighting.status === 'Corroborated' ? '#9CA3AF' : '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: sighting.status === 'Corroborated' ? 'default' : 'pointer',
            }}
          >
            <CheckCircle size={14} />
            <span>Corroborate</span>
          </button>

          <button
            onClick={() => onUpdateStatus(sighting.id, 'Dismissed', 'Investigator marked as uncorroborated or conflicting profile.')}
            disabled={sighting.status === 'Dismissed'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 10px',
              fontSize: '12px',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
              background: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              cursor: sighting.status === 'Dismissed' ? 'default' : 'pointer',
            }}
          >
            <XCircle size={14} />
            <span>Dismiss</span>
          </button>
        </div>
      </div>
    </div>
  );
};
