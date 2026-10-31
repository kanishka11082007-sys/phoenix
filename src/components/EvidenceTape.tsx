import React from 'react';

interface EvidenceTapeProps {
  phrase?: string;
}

export const EvidenceTape: React.FC<EvidenceTapeProps> = ({
  phrase = 'INVESTIGATION IN PROGRESS',
}) => {
  // Repeating text generator for infinite track
  const repeatCount = 18;
  const items = Array.from({ length: repeatCount });

  return (
    <div className="tape-stage" aria-hidden="true">
      {/* Tape 1: Slanted left-to-right (Negative degree angle) */}
      <div className="tape-banner tape-banner-1" title="Evidence Boundary — Investigation in Progress">
        <div className="tape-track">
          {items.map((_, i) => (
            <span key={`tape-1-${i}`} className="tape-phrase">
              <span className="tape-slash">///</span>
              {phrase}
              <span className="tape-divider">•</span>
              <span className="font-mono" style={{ fontSize: '12px', opacity: 0.75, letterSpacing: '0.05em' }}>
                AUTH-REF #{4080 + (i % 8)}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Tape 2: Slanted right-to-left (Positive degree angle) crossing in an X shape */}
      <div className="tape-banner tape-banner-2" title="Evidence Boundary — Investigation in Progress">
        <div className="tape-track tape-track-reverse">
          {items.map((_, i) => (
            <span key={`tape-2-${i}`} className="tape-phrase">
              <span className="tape-slash">///</span>
              {phrase}
              <span className="tape-divider">•</span>
              <span className="font-mono" style={{ fontSize: '12px', opacity: 0.75, letterSpacing: '0.05em' }}>
                LEO SIGHTINGS MATRIX
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
