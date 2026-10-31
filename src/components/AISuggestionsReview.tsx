import React from 'react';
import { AISuggestion, AISuggestionStatus } from '../types';
import { 
  Sparkles, 
  AlertTriangle, 
  Check, 
  X, 
  HelpCircle, 
  ArrowRight, 
  FileSearch, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface AISuggestionsReviewProps {
  suggestions: AISuggestion[];
  onDecision: (
    suggestionId: string, 
    status: AISuggestionStatus, 
    decisionNote?: string
  ) => void;
  onInspectSighting: (sightingCode: string) => void;
}

export const AISuggestionsReview: React.FC<AISuggestionsReviewProps> = ({
  suggestions,
  onDecision,
  onInspectSighting,
}) => {
  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--accent-orange)" />
          <h3 className="panel-title" style={{ margin: 0 }}>
            AI Suggested Sighting Links
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#10B981" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
            HUMAN-IN-THE-LOOP REQUIRED
          </span>
        </div>
      </div>

      <div style={{ padding: '12px 16px', background: '#FFFBEB', borderBottom: '1px solid #FDE68A', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <AlertTriangle size={16} color="#B45309" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '12px', color: '#92400E', lineHeight: '1.4' }}>
          <strong>Investigator Notice:</strong> AI suggestions are probabilistic models based on clothing geometry, transit timetables, and walking velocity. 
          All suggestions remain <em>Unverified</em> until explicitly confirmed by the lead investigator.
        </div>
      </div>

      <div className="panel-body">
        <div className="ai-suggestions-container">
          {suggestions.map((sugg) => {
            const isUnverified = sugg.reviewStatus === 'Unverified';
            const isConfirmed = sugg.reviewStatus === 'Confirmed';
            const isDismissed = sugg.reviewStatus === 'Dismissed';
            const isNeedsInfo = sugg.reviewStatus === 'Needs More Info';

            return (
              <div 
                key={sugg.id} 
                className={`ai-suggestion-card ${
                  isConfirmed ? 'card-confirmed' : isDismissed ? 'card-dismissed' : 'card-unverified'
                }`}
              >
                {/* Header: Status & Confidence */}
                <div className="ai-card-header">
                  <div className="ai-tag-group">
                    {isUnverified && (
                      <span className="ai-unverified-pill">
                        <AlertTriangle size={12} />
                        UNVERIFIED SUGGESTION
                      </span>
                    )}
                    {isConfirmed && (
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        padding: '3px 8px', 
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-mono)', 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        background: '#DCFCE7', 
                        color: '#15803D' 
                      }}>
                        <CheckCircle2 size={13} />
                        CONFIRMED LINK
                      </span>
                    )}
                    {isDismissed && (
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        padding: '3px 8px', 
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-mono)', 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        background: '#F3F4F6', 
                        color: '#4B5563' 
                      }}>
                        <X size={13} />
                        DISMISSED
                      </span>
                    )}
                    {isNeedsInfo && (
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        padding: '3px 8px', 
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-mono)', 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        background: '#FEF3C7', 
                        color: '#B45309' 
                      }}>
                        <HelpCircle size={13} />
                        AWAITING INFORMATION
                      </span>
                    )}
                  </div>

                  <div className="ai-confidence-indicator">
                    <span style={{ color: sugg.confidencePercentage > 85 ? '#059669' : sugg.confidencePercentage > 50 ? '#D97706' : '#6B7280' }}>
                      {sugg.confidenceLabel} ({sugg.confidencePercentage}%)
                    </span>
                  </div>
                </div>

                {/* Sighting Nodes Trajectory Link */}
                <div className="ai-link-trajectory">
                  <button 
                    onClick={() => onInspectSighting(sugg.primaryCode)}
                    className="link-node-chip"
                    style={{ border: 'none', cursor: 'pointer' }}
                    title={`Inspect report ${sugg.primaryCode}`}
                  >
                    {sugg.primaryCode}
                  </button>
                  <ArrowRight size={16} className="link-arrow" />
                  <button 
                    onClick={() => onInspectSighting(sugg.targetCode)}
                    className="link-node-chip"
                    style={{ border: 'none', cursor: 'pointer' }}
                    title={`Inspect report ${sugg.targetCode}`}
                  >
                    {sugg.targetCode}
                  </button>
                </div>

                {/* Explanation */}
                <p className="ai-explanation">
                  {sugg.explanation}
                </p>

                {/* Match Factors */}
                <div className="ai-factors-list">
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Correlation Factors
                  </div>
                  {sugg.matchFactors.map((factor, idx) => (
                    <div key={idx} className="factor-item">
                      <span className={`factor-dot ${factor.matchLevel}`} />
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>{factor.factor}: </strong>
                        <span style={{ color: 'var(--text-secondary)' }}>{factor.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Source References */}
                <div className="source-references-box">
                  <div className="source-refs-title">Evidence Source References</div>
                  {sugg.sourceReferences.map((ref, idx) => (
                    <div key={idx} className="ref-item">
                      <FileSearch size={12} color="var(--accent-orange)" />
                      <span><strong>{ref.title}</strong> [{ref.id}] • {ref.timestamp} — {ref.detail}</span>
                    </div>
                  ))}
                </div>

                {/* Decision Stamp if reviewed */}
                {sugg.reviewedBy && (
                  <div style={{ margin: '8px 0 12px', padding: '6px 10px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                    <span>Reviewed by {sugg.reviewedBy} at {sugg.reviewedAt}</span>
                    {sugg.decisionNote && <div>Note: "{sugg.decisionNote}"</div>}
                  </div>
                )}

                {/* Interactive Investigator Actions */}
                <div className="ai-actions-toolbar">
                  <button 
                    id={`btn-confirm-${sugg.id}`}
                    className="btn-confirm-link"
                    onClick={() => onDecision(sugg.id, 'Confirmed', 'Investigator verified continuous trajectory and clothing correspondence.')}
                    disabled={isConfirmed}
                    style={{ opacity: isConfirmed ? 0.6 : 1 }}
                  >
                    <Check size={14} />
                    <span>Confirm Link</span>
                  </button>

                  <button 
                    id={`btn-dismiss-${sugg.id}`}
                    className="btn-dismiss-link"
                    onClick={() => onDecision(sugg.id, 'Dismissed', 'Investigator dismissed link due to conflicting evidence.')}
                    disabled={isDismissed}
                    style={{ opacity: isDismissed ? 0.6 : 1 }}
                  >
                    <X size={14} />
                    <span>Dismiss</span>
                  </button>

                  <button 
                    id={`btn-defer-${sugg.id}`}
                    className="btn-defer-link"
                    onClick={() => onDecision(sugg.id, 'Needs More Info', 'Investigator requested patrol team to verify camera footage.')}
                    disabled={isNeedsInfo}
                    style={{ opacity: isNeedsInfo ? 0.6 : 1 }}
                  >
                    <HelpCircle size={14} />
                    <span>Needs More Information</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
