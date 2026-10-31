import React from 'react';
import { EvidenceSourceInfo } from '../types';
import { 
  Radio, 
  Video, 
  PhoneCall, 
  Users, 
  Bus, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';

interface EvidenceSourcesViewProps {
  sources: EvidenceSourceInfo[];
}

export const EvidenceSourcesView: React.FC<EvidenceSourcesViewProps> = ({ sources }) => {
  const getSourceIcon = (type: EvidenceSourceInfo['type']) => {
    switch (type) {
      case 'CCTV': return <Video size={20} color="#2563EB" />;
      case 'TRANSIT': return <Bus size={20} color="#7C3AED" />;
      case 'HOTLINE': return <PhoneCall size={20} color="#D97706" />;
      case 'PARTNER': return <Users size={20} color="#059669" />;
      default: return <Radio size={20} color="var(--accent-orange)" />;
    }
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={18} color="var(--accent-orange)" />
          <h3 className="panel-title" style={{ margin: 0 }}>
            Authorized Ingestion Feeds & Telemetry Pipeline
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="status-dot status-dot-pulse" style={{ backgroundColor: '#10B981' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#059669', fontWeight: 600 }}>
            ALL CHANNELS ACTIVE
          </span>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {sources.map((src) => (
            <div
              key={src.id}
              style={{
                background: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: '#FFFFFF', border: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getSourceIcon(src.type)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {src.name}
                    </h4>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                      TYPE: {src.type}
                    </span>
                  </div>
                </div>

                <span style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '11px', 
                  fontWeight: 700, 
                  color: '#059669', 
                  background: '#DCFCE7', 
                  padding: '3px 8px', 
                  borderRadius: 'var(--radius-sm)' 
                }}>
                  {src.status}
                </span>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Coverage: {src.coverageArea}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#FFFFFF', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>FEED LATENCY</span>
                  <strong>{src.latency}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>ACTIVE STREAMS</span>
                  <strong>{src.activeFeeds} streams</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>LAST INGEST</span>
                  <span>{src.lastIngestTime}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>ACCESS LEVEL</span>
                  <span style={{ color: 'var(--accent-orange)' }}>Secure CJIS Level 4</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-light)', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={11} /> End-to-end encrypted
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10B981' }}>
                  <CheckCircle2 size={11} /> Stream verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
