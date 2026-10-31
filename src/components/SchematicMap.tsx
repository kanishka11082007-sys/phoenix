import React, { useState } from 'react';
import { Sighting, Case } from '../types';
import { 
  Crosshair, 
  Layers, 
  RotateCcw, 
  MapPin, 
  Maximize2,
  Navigation,
  Compass
} from 'lucide-react';

interface SchematicMapProps {
  activeCase: Case;
  sightings: Sighting[];
  selectedSightingId: string | null;
  onSelectSighting: (sightingId: string) => void;
  showTrajectoryFlow?: boolean;
}

export const SchematicMap: React.FC<SchematicMapProps> = ({
  activeCase,
  sightings,
  selectedSightingId,
  onSelectSighting,
  showTrajectoryFlow = true,
}) => {
  const [showRings, setShowRings] = useState(true);
  const [showFlow, setShowFlow] = useState(showTrajectoryFlow);
  const [zoomLevel, setZoomLevel] = useState(1);

  // SVG dimensions for coordinate calculations (viewBox 0 0 1000 600)
  const width = 1000;
  const height = 600;

  // Origin: Last Known Coordinates converted to viewBox scale
  const originX = (activeCase.lastSeenCoordinates.x / 100) * width;
  const originY = (activeCase.lastSeenCoordinates.y / 100) * height;

  // Sighting positions scaled
  const scaledSightings = sightings.map((s) => ({
    ...s,
    pixelX: (s.coordinates.x / 100) * width,
    pixelY: (s.coordinates.y / 100) * height,
  }));

  // Corroborated and AI-linked sightings in chronological sequence for trajectory path
  const trajectoryNodes = scaledSightings
    .filter((s) => s.status === 'Corroborated' || s.status === 'AI Linked')
    .sort((a, b) => a.elapsedMinutes - b.elapsedMinutes);

  const getPinColor = (status: Sighting['status'], isSelected: boolean) => {
    if (isSelected) return '#FF5528'; // Bright orange accent
    switch (status) {
      case 'Corroborated':
        return '#10B981'; // Green verified
      case 'AI Linked':
        return '#FFD84D'; // Yellow highlight
      case 'Pending Review':
        return '#F59E0B'; // Amber
      case 'Dismissed':
        return '#6B7280'; // Gray
      case 'Unverified':
      default:
        return '#EAB308'; // Yellow-gold
    }
  };

  return (
    <div className="schematic-map-container" aria-label="Schematic Tactical Investigation Map">
      {/* Controls Overlay */}
      <div className="map-controls-overlay">
        <button 
          className="map-btn" 
          onClick={() => setShowRings(!showRings)}
          title={showRings ? 'Hide Distance Radius Rings' : 'Show Distance Radius Rings'}
        >
          <Crosshair size={16} />
        </button>
        <button 
          className="map-btn" 
          onClick={() => setShowFlow(!showFlow)}
          title={showFlow ? 'Hide Trajectory Flow Corridor' : 'Show Trajectory Flow Corridor'}
        >
          <Navigation size={16} />
        </button>
        <button 
          className="map-btn" 
          onClick={() => setZoomLevel(zoomLevel === 1 ? 1.25 : 1)}
          title="Toggle Zoom Scope"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* SVG Tactical Grid Canvas */}
      <svg 
        className="map-svg-canvas" 
        viewBox={`0 0 ${width} ${height}`}
        style={{
          transform: `scale(${zoomLevel})`,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <defs>
          {/* Blueprint Grid Pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1D212A" strokeWidth="0.8" />
          </pattern>
          <pattern id="gridSubtle" width="160" height="160" patternUnits="userSpaceOnUse">
            <rect width="160" height="160" fill="none" stroke="#252A36" strokeWidth="1.2" />
          </pattern>

          {/* Glowing Filter for Selected Pin */}
          <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-yellow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Marker Arrow for Trajectory */}
          <marker 
            id="arrowhead" 
            markerWidth="8" 
            markerHeight="6" 
            refX="6" 
            refY="3" 
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#FF5528" />
          </marker>
        </defs>

        {/* Tactical Background Grid */}
        <rect width="100%" height="100%" fill="#121417" />
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#gridSubtle)" />

        {/* Fictional Geographic Schematic Landmarks */}
        {/* River corridor (schematic curve) */}
        <path 
          d="M 720 0 Q 760 250, 840 400 T 980 600" 
          fill="none" 
          stroke="#1E2A38" 
          strokeWidth="38" 
          strokeLinecap="round" 
        />
        <text x="810" y="320" fill="#3B506D" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="3">
          RIVERWALK CANAL
        </text>

        {/* Major Avenue: Maple Ave Corridor */}
        <line x1="180" y1="120" x2="680" y2="480" stroke="#2B3242" strokeWidth="12" strokeLinecap="round" />
        <text x="360" y="275" fill="#586379" fontSize="10" fontFamily="var(--font-mono)" transform="rotate(35 360 275)" letterSpacing="2">
          MAPLE AVENUE CORRIDOR
        </text>

        {/* 4th Street Crossline */}
        <line x1="280" y1="520" x2="620" y2="100" stroke="#252B39" strokeWidth="8" strokeLinecap="round" />
        <text x="440" y="300" fill="#4B5568" fontSize="9" fontFamily="var(--font-mono)" transform="rotate(-51 440 300)" letterSpacing="2">
          4TH STREET ARTERIAL
        </text>

        {/* Transit Bus Route 14 Line */}
        <path 
          d="M 440 264 Q 510 300, 580 336" 
          fill="none" 
          stroke="#6D28D9" 
          strokeWidth="3" 
          strokeDasharray="6 4" 
        />
        <text x="515" y="295" fill="#8B5CF6" fontSize="9" fontFamily="var(--font-mono)">
          BUS ROUTE 14 TRANSIT VECTOR
        </text>

        {/* Oakwood Park schematic boundary */}
        <rect 
          x="200" 
          y="140" 
          width="160" 
          height="120" 
          rx="8" 
          fill="#16231D" 
          stroke="#204033" 
          strokeWidth="1.5" 
          strokeDasharray="4 2" 
        />
        <text x="220" y="170" fill="#3D7A60" fontSize="10" fontFamily="var(--font-heading)" letterSpacing="1">
          OAKWOOD COMMUNITY PARK
        </text>

        {/* Central Junction Terminal Schematic */}
        <rect 
          x="540" 
          y="310" 
          width="80" 
          height="50" 
          rx="4" 
          fill="#1F1C2B" 
          stroke="#4C3F7A" 
          strokeWidth="1.5" 
        />
        <text x="546" y="340" fill="#9D8CDB" fontSize="9" fontFamily="var(--font-heading)" letterSpacing="1">
          CENTRAL JCT
        </text>

        {/* Concentric Distance Rings from Last Known Location */}
        {showRings && (
          <g className="range-rings" opacity="0.65">
            {/* 500m ring */}
            <circle 
              cx={originX} 
              cy={originY} 
              r="85" 
              fill="none" 
              stroke="#FF5528" 
              strokeWidth="1" 
              strokeDasharray="3 3" 
              opacity="0.4"
            />
            <text x={originX + 90} y={originY + 4} fill="#FF5528" fontSize="9" fontFamily="var(--font-mono)" opacity="0.7">
              500m (10m walk)
            </text>

            {/* 1000m ring */}
            <circle 
              cx={originX} 
              cy={originY} 
              r="170" 
              fill="none" 
              stroke="#FFD84D" 
              strokeWidth="1" 
              strokeDasharray="4 4" 
              opacity="0.35"
            />
            <text x={originX + 175} y={originY + 4} fill="#FFD84D" fontSize="9" fontFamily="var(--font-mono)" opacity="0.6">
              1.0 km (Transit perimeter)
            </text>

            {/* 2000m ring */}
            <circle 
              cx={originX} 
              cy={originY} 
              r="320" 
              fill="none" 
              stroke="#586379" 
              strokeWidth="0.8" 
              strokeDasharray="5 5" 
              opacity="0.3"
            />
            <text x={originX + 325} y={originY + 4} fill="#8895AB" fontSize="9" fontFamily="var(--font-mono)" opacity="0.5">
              2.0 km Outer Sector
            </text>
          </g>
        )}

        {/* Trajectory Corridor Connecting Confirmed/AI Linked Sightings */}
        {showFlow && trajectoryNodes.length > 1 && (
          <g className="trajectory-flow-path">
            {trajectoryNodes.map((node, i) => {
              if (i === 0) return null;
              const prev = trajectoryNodes[i - 1];
              return (
                <g key={`traj-${node.id}`}>
                  {/* Glow under line */}
                  <line 
                    x1={prev.pixelX} 
                    y1={prev.pixelY} 
                    x2={node.pixelX} 
                    y2={node.pixelY} 
                    stroke="#FF5528" 
                    strokeWidth="6" 
                    opacity="0.25" 
                  />
                  {/* Directional Path */}
                  <line 
                    x1={prev.pixelX} 
                    y1={prev.pixelY} 
                    x2={node.pixelX} 
                    y2={node.pixelY} 
                    stroke="#FF5528" 
                    strokeWidth="2.5" 
                    strokeDasharray="6 4"
                    markerEnd="url(#arrowhead)"
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* Origin Marker: Last Known Location */}
        <g transform={`translate(${originX}, ${originY})`}>
          <circle r="18" fill="none" stroke="#FF5528" strokeWidth="1.5" opacity="0.6">
            <animate attributeName="r" values="12;28;12" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle r="7" fill="#FF5528" />
          <circle r="2.5" fill="#FFFFFF" />
          <text 
            x="12" 
            y="-10" 
            fill="#FFFFFF" 
            fontSize="11" 
            fontFamily="var(--font-heading)" 
            fontWeight="bold"
            letterSpacing="0.05em"
          >
            ORIGIN: LAST KNOWN (16:30)
          </text>
        </g>

        {/* Sighting Nodes / Pins */}
        {scaledSightings.map((s, index) => {
          const isSelected = selectedSightingId === s.id;
          const pinColor = getPinColor(s.status, isSelected);

          return (
            <g 
              key={s.id} 
              className="map-pin-group"
              transform={`translate(${s.pixelX}, ${s.pixelY})`}
              onClick={() => onSelectSighting(s.id)}
              role="button"
              tabIndex={0}
              aria-label={`Sighting ${s.code}: ${s.locationName}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectSighting(s.id);
                }
              }}
            >
              {/* Radar pulse for selected pin */}
              {isSelected && (
                <circle 
                  r="14" 
                  fill="none" 
                  stroke={pinColor} 
                  strokeWidth="2" 
                  className="map-pin-pulse"
                />
              )}

              {/* Pin Base Shadow */}
              <circle r="10" fill="#121316" stroke={pinColor} strokeWidth="2.5" />

              {/* Inner Core */}
              <circle r="4" fill={pinColor} />

              {/* Sequence Badge Label */}
              <rect 
                x="12" 
                y="-18" 
                width="64" 
                height="18" 
                rx="3" 
                fill={isSelected ? '#FF5528' : '#1C2028'} 
                stroke={pinColor} 
                strokeWidth="1" 
              />
              <text 
                x="18" 
                y="-6" 
                fill={isSelected ? '#FFFFFF' : '#FFD84D'} 
                fontSize="10" 
                fontFamily="var(--font-mono)" 
                fontWeight="bold"
              >
                {s.code}
              </text>

              {/* Timestamp label below */}
              <text 
                x="12" 
                y="14" 
                fill="#E2DDD5" 
                fontSize="9" 
                fontFamily="var(--font-mono)"
                opacity="0.85"
              >
                +{s.elapsedMinutes}m ({s.reportedTime.split(' ')[0]})
              </text>
            </g>
          );
        })}
      </svg>

      {/* Map Legend */}
      <div className="map-legend">
        <span style={{ fontWeight: 700, color: '#FFFFFF' }}>STATUS:</span>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#10B981' }} />
          <span>Corroborated</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#FFD84D' }} />
          <span>AI Correlated</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#F59E0B' }} />
          <span>Pending Review</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#6B7280' }} />
          <span>Dismissed</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#FF5528' }} />
          <span>Active Selection</span>
        </div>
      </div>
    </div>
  );
};
