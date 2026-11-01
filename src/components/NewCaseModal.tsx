import React, { useState } from 'react';
import { Case, CaseStatus } from '../types';
import { X, PlusCircle, ShieldAlert } from 'lucide-react';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCase: (newCase: Case) => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  onClose,
  onCreateCase,
}) => {
  const [code, setCode] = useState(`DEMO-DEL-0${Math.floor(50 + Math.random() * 40)}`);
  const [title, setTitle] = useState('');
  const [alias, setAlias] = useState('');
  const [age, setAge] = useState<number>(10);
  const [status, setStatus] = useState<CaseStatus>('Active Priority 1');
  const [neighbourhood, setNeighbourhood] = useState('Dwarka');
  const [lastSeenLocation, setLastSeenLocation] = useState('');
  const [lastSeenTime, setLastSeenTime] = useState('15:45 hrs today');
  const [clothingDescription, setClothingDescription] = useState('');
  const [physicalDescription, setPhysicalDescription] = useState('');
  const [leadInvestigator, setLeadInvestigator] = useState('Det. Sarah Vance');
  const [summary, setSummary] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !lastSeenLocation) return;

    const newCaseItem: Case = {
      id: `case-${Date.now()}`,
      code: code.trim() || `DEMO-DEL-${Math.floor(100 + Math.random() * 900)}`,
      title,
      alias: alias || title,
      age: Number(age),
      status,
      neighbourhood: neighbourhood || 'Delhi Central',
      simulationBadge: 'SIMULATED CASE',
      openedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      lastSeenLocation: `${neighbourhood} — ${lastSeenLocation}`,
      lastSeenTime,
      lastSeenCoordinates: { x: 50, y: 50, lat: 28.6139, lng: 77.2090 },
      clothingDescription: clothingDescription || 'Attire details pending intake verification.',
      physicalDescription: physicalDescription || 'Height ~135 cm, average build.',
      clothingTags: clothingDescription
        ? clothingDescription.split(',').map((t) => t.trim()).filter(Boolean)
        : ['Profile Ingested'],
      leadInvestigator,
      investigatorBadge: 'INV-DEL-4082',
      summary: summary || 'Newly opened investigative inquiry. Initial sighting intake initiated.',
      avatarPlaceholderType: 'child_silhouette_a',
    };

    onCreateCase(newCaseItem);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={18} color="var(--accent-orange)" />
            <h3 className="modal-title">Initiate New Fictional Case File</h3>
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
            <div style={{ background: '#FFFBEB', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #FDE68A', fontSize: '12px', color: '#92400E' }}>
              <strong>Privacy Requirement:</strong> All case files in this prototype are strictly fictional. Never enter real children's names, photos, or personally identifiable data.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Case Identifier Code</label>
                <input
                  type="text"
                  className="form-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject Alias / Code Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Child D"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Age (Years)</label>
                <input
                  type="number"
                  className="form-input"
                  value={age}
                  min={1}
                  max={17}
                  onChange={(e) => setAge(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
                </select>
              </div>

              <div className="form-group">
                <label>Last Seen Approximate Time</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 15:45 hrs today"
                  value={lastSeenTime}
                  onChange={(e) => setLastSeenTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Last Known Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Westside Community Center or North Athletic Field"
                value={lastSeenLocation}
                onChange={(e) => setLastSeenLocation(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Clothing & Outerwear Specification</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="e.g. Yellow jacket, blue denim, black sneakers, purple baseball cap..."
                value={clothingDescription}
                onChange={(e) => setClothingDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Physical Description & Characteristics</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="e.g. Height ~135 cm, dark curly hair, brown eyes, birthmark..."
                value={physicalDescription}
                onChange={(e) => setPhysicalDescription(e.target.value)}
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
              Open New Case Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
