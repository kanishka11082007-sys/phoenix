import React, { useState, useEffect } from 'react';
import { Case, CaseStatus } from '../types';
import { X, Edit3, Save } from 'lucide-react';

interface EditCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: Case;
  onSaveCase: (updatedCase: Case) => void;
}

export const EditCaseModal: React.FC<EditCaseModalProps> = ({
  isOpen,
  onClose,
  caseItem,
  onSaveCase,
}) => {
  const [clothing, setClothing] = useState(caseItem.clothingDescription);
  const [physical, setPhysical] = useState(caseItem.physicalDescription);
  const [location, setLocation] = useState(caseItem.lastSeenLocation);
  const [time, setTime] = useState(caseItem.lastSeenTime);
  const [status, setStatus] = useState<CaseStatus>(caseItem.status);
  const [summary, setSummary] = useState(caseItem.summary);

  useEffect(() => {
    setClothing(caseItem.clothingDescription);
    setPhysical(caseItem.physicalDescription);
    setLocation(caseItem.lastSeenLocation);
    setTime(caseItem.lastSeenTime);
    setStatus(caseItem.status);
    setSummary(caseItem.summary);
  }, [caseItem]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Case = {
      ...caseItem,
      clothingDescription: clothing,
      physicalDescription: physical,
      lastSeenLocation: location,
      lastSeenTime: time,
      status,
      summary,
      clothingTags: clothing
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };
    onSaveCase(updated);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Edit3 size={18} color="var(--accent-orange)" />
            <h3 className="modal-title">Edit Case Specifications: {caseItem.code}</h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Case Status Priority</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as CaseStatus)}
              >
                <option value="Active Priority 1">Active Priority 1</option>
                <option value="In Review">In Review</option>
                <option value="Closed">Closed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div className="form-group">
              <label>Last Known Location</label>
              <input
                type="text"
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Reported Last-Seen Time</label>
              <input
                type="text"
                className="form-input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Clothing & Attire Markers (Comma separated tags)</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={clothing}
                onChange={(e) => setClothing(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Physical Profile Details</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={physical}
                onChange={(e) => setPhysical(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Case Summary & Briefing</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: '14px' }}
            >
              Save Case Updates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
