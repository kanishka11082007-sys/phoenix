import React, { useState } from 'react';
import { Sighting, SightingSource } from '../types';
import { X, Plus, AlertCircle, MapPin, Video } from 'lucide-react';

interface AddSightingModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  caseCode: string;
  onAddSighting: (sighting: Omit<Sighting, 'id'>) => void;
}

export const AddSightingModal: React.FC<AddSightingModalProps> = ({
  isOpen,
  onClose,
  caseId,
  caseCode,
  onAddSighting,
}) => {
  const [source, setSource] = useState<SightingSource>('CCTV Upload');
  const [locationName, setLocationName] = useState('');
  const [reportedTime, setReportedTime] = useState('19:15 hrs');
  const [elapsedMinutes, setElapsedMinutes] = useState(165);
  const [description, setDescription] = useState('');
  const [clothingNotes, setClothingNotes] = useState('');
  const [sourceRef, setSourceRef] = useState('');
  const [coordX, setCoordX] = useState(60);
  const [coordY, setCoordY] = useState(60);
  const [confidenceScore, setConfidenceScore] = useState(85);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName || !description) return;

    const newCode = `RPT-${Math.floor(206 + Math.random() * 50)}`;

    onAddSighting({
      caseId,
      code: newCode,
      source,
      reportedTime,
      elapsedMinutes: Number(elapsedMinutes),
      locationName,
      coordinates: { x: Number(coordX), y: Number(coordY) },
      description,
      clothingNotes: clothingNotes || 'Attire matches primary case specifications.',
      status: 'Pending Review',
      confidenceScore: Number(confidenceScore),
      sourceRef: sourceRef || `${source} Feed — Ingest Stream #77`,
      evidenceSnippet: `Ingested Frame / Audio Log • Verified by Intake Desk`,
      investigatorNotes: 'Newly registered report awaiting primary investigator evaluation.',
      linkedSightingCodes: [],
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} color="var(--accent-orange)" />
            <h3 className="modal-title">Ingest Fictional Sighting Report</h3>
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
              <strong>Notice:</strong> Prototype demo mode. This form simulates ingestion of authorized CCTV or hotline reports for <strong>{caseCode}</strong>.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Evidence Source</label>
                <select 
                  className="form-select"
                  value={source}
                  onChange={(e) => setSource(e.target.value as SightingSource)}
                >
                  <option value="CCTV Upload">CCTV Upload</option>
                  <option value="Public Tip">Public Tip Line</option>
                  <option value="Partner Organization">Partner Organization</option>
                  <option value="Transit Scanner">Transit Scanner</option>
                </select>
              </div>

              <div className="form-group">
                <label>Reported Time</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 19:15 hrs"
                  value={reportedTime}
                  onChange={(e) => setReportedTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Location & Landmark Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Oakwood Library Courtyard or South Platform"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Source Reference Details</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Cam-12 East Hallway or Tip Caller #488"
                value={sourceRef}
                onChange={(e) => setSourceRef(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Narrative Sighting Description</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Describe subject movements, direction of travel, demeanor..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Clothing & Attire Observations</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Navy hooded jacket, yellow backpack straps, green sneakers"
                value={clothingNotes}
                onChange={(e) => setClothingNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label>Minutes After Last Seen</label>
                <input
                  type="number"
                  className="form-input"
                  value={elapsedMinutes}
                  onChange={(e) => setElapsedMinutes(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Map Grid X (0-100)</label>
                <input
                  type="number"
                  className="form-input"
                  value={coordX}
                  min={10}
                  max={90}
                  onChange={(e) => setCoordX(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Map Grid Y (0-100)</label>
                <input
                  type="number"
                  className="form-input"
                  value={coordY}
                  min={10}
                  max={90}
                  onChange={(e) => setCoordY(Number(e.target.value))}
                />
              </div>
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
              Register Sighting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
