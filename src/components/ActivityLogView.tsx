import React from 'react';
import { ActivityLogItem } from '../types';
import { 
  FileCheck2, 
  Check, 
  X, 
  HelpCircle, 
  Plus, 
  Edit3, 
  FileText, 
  ShieldCheck, 
  Clock
} from 'lucide-react';

interface ActivityLogViewProps {
  logs: ActivityLogItem[];
  caseCode: string;
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({
  logs,
  caseCode,
}) => {
  const getActionIcon = (actionType: ActivityLogItem['actionType']) => {
    switch (actionType) {
      case 'CONFIRM_LINK':
        return <Check size={14} color="#10B981" />;
      case 'DISMISS_LINK':
        return <X size={14} color="#6B7280" />;
      case 'REQUEST_INFO':
        return <HelpCircle size={14} color="#F59E0B" />;
      case 'ADD_SIGHTING':
        return <Plus size={14} color="#2563EB" />;
      case 'EDIT_CASE':
        return <Edit3 size={14} color="var(--accent-orange)" />;
      default:
        return <FileText size={14} color="var(--text-secondary)" />;
    }
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileCheck2 size={16} color="var(--accent-orange)" />
          <h3 className="panel-title" style={{ margin: 0 }}>
            Case Activity & Chain-of-Custody Audit Log
          </h3>
        </div>
        <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Case #{caseCode} • {logs.length} Logged Entries
        </span>
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {logs.map((log) => (
            <div 
              key={log.id}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 14px',
                background: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div 
                style={{ 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  background: '#FFFFFF', 
                  border: '1px solid var(--border-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}
              >
                {getActionIcon(log.actionType)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                      {log.actor}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', background: 'var(--bg-charcoal)', color: 'var(--accent-yellow)', padding: '1px 6px', borderRadius: '2px' }}>
                      {log.actorBadge}
                    </span>
                    {log.targetCode && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-orange)', fontWeight: 600 }}>
                        Target: {log.targetCode}
                      </span>
                    )}
                  </div>

                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} />
                    {log.timestamp}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {log.summary}
                </div>

                {log.details && (
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                    {log.details}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
