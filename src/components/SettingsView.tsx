import React from 'react';
import { 
  Settings, 
  RotateCcw, 
  ShieldCheck, 
  Lock, 
  Eye, 
  UserCheck, 
  Sliders, 
  Database,
  CheckCircle2
} from 'lucide-react';

interface SettingsViewProps {
  onResetDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetDemoData }) => {
  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={18} color="var(--accent-orange)" />
          <h3 className="panel-title" style={{ margin: 0 }}>
            Investigator Workspace & Protocol Settings
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#10B981" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#10B981' }}>
            CJIS COMPLIANT PROFILE
          </span>
        </div>
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '840px' }}>
        {/* Active Investigator Profile */}
        <div style={{ background: 'var(--bg-surface-subtle)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={16} color="var(--accent-orange)" />
            Authenticated Investigator Credentials
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '13px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>OFFICER / INVESTIGATOR</span>
              <strong>Det. Sarah Vance</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>BADGE NUMBER</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>INV-4082</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>UNIT / DIVISION</span>
              <strong>Major Case & Special Victims Unit</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>CLEARANCE LEVEL</span>
              <strong style={{ color: '#059669' }}>Level 4 (Full Audit Trail Active)</strong>
            </div>
          </div>
        </div>

        {/* Responsible Use & Privacy Policy Mandates */}
        <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={16} color="var(--accent-orange)" />
            Privacy & Responsible Use Mandates (Immutable)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span><strong>Synthetic Biometric Silhouette Mode:</strong> Enforced. Real photographs of children are prohibited in prototype ingestion.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span><strong>Strict Human-in-the-Loop Verification:</strong> AI correlations are restricted to suggestions. No autonomous decision or case closure permitted.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span><strong>No Public Broadcast Without Court Order:</strong> Sighting correlations are restricted to authorized investigative teams only.</span>
            </div>
          </div>
        </div>

        {/* Prototype Reset Controls */}
        <div style={{ background: '#FFF7ED', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid #FFEDD5' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#9A3412', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={16} color="var(--accent-orange)" />
            Prototype Demo Data Management
          </h4>
          <p style={{ fontSize: '13px', color: '#7C2D12', marginBottom: '14px', lineHeight: '1.4' }}>
            Restore the initial fictional cases, sightings for Child A (DEMO-014), AI suggestion states, and chain-of-custody activity logs to the baseline demonstration state.
          </p>
          <button
            id="btn-reset-demo-data"
            onClick={onResetDemoData}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: '#EA580C',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-heading)',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={15} />
            <span>Reset To Default Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
