import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Sighting, Case } from '../types';
import { 
  Crosshair, 
  RotateCcw, 
  Navigation,
  ZoomIn,
  ZoomOut
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
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // SVG dimensions for coordinate calculations (viewBox 0 0 1000 600)
  const width = 1000;
  const height = 600;

  // Interaction tracking refs
  const startPointerPos = useRef({ x: 0, y: 0 });
  const startPan = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  // Origin: Last Known Coordinates converted to viewBox scale
  const originX = (activeCase.lastSeenCoordinates.x / 100) * width;
  const originY = (activeCase.lastSeenCoordinates.y / 100) * height;

  // Sighting positions scaled
  const scaledSightings = useMemo(() => {
    return sightings.map((s) => ({
      ...s,
      pixelX: (s.coordinates.x / 100) * width,
      pixelY: (s.coordinates.y / 100) * height,
    }));
  }, [sightings]);

  // Corroborated and AI-linked sightings in chronological sequence for trajectory path
  const trajectoryNodes = useMemo(() => {
    return scaledSightings
      .filter((s) => s.status === 'Corroborated' || s.status === 'AI Linked')
      .slice()
      .sort((a, b) => a.elapsedMinutes - b.elapsedMinutes);
  }, [scaledSightings]);

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

  // Pointer Drag Handlers (Smooth Pan without touch buffer lag)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag with primary mouse button or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    // Do not initiate pan if clicking on an interactive control button
    const target = e.target as HTMLElement;
    if (target.closest('.map-controls-overlay') || target.closest('button')) {
      return;
    }

    setIsDragging(true);
    startPointerPos.current = { x: e.clientX, y: e.clientY };
    startPan.current = { x: pan.x, y: pan.y };
    hasMovedRef.current = false;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored for non-capture browsers
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const dx = e.clientX - startPointerPos.current.x;
    const dy = e.clientY - startPointerPos.current.y;

    if (Math.hypot(dx, dy) > 4) {
      hasMovedRef.current = true;
    }

    setPan({
      x: startPan.current.x + dx,
      y: startPan.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    }
  };

  // Non-passive wheel zoom centered on tactical map
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 0.89;
    setZoom((z) => Math.max(0.75, Math.min(2.5, Number((z * factor).toFixed(2)))));
  };

  // Zoom button handlers
  const handleZoomIn = () => {
    setZoom((z) => Math.min(2.5, Number((z * 1.2).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(0.75, Number((z / 1.2).toFixed(2))));
  };

  const handleResetView = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div 
      className={`schematic-map-container ${isDragging ? 'is-panning' : ''}`}
      aria-label="Schematic Tactical Investigation Map"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onWheel={handleWheel}
    >
      {/* Controls Overlay */}
      <div className="map-controls-overlay">
        <button 
          className="map-btn" 
          onClick={handleZoomIn}
          title="Zoom In (+)"
          aria-label="Zoom in"
        >
          <ZoomIn size={16} />
        </button>
        <button 
          className="map-btn" 
          onClick={handleZoomOut}
          title="Zoom Out (-)"
          aria-label="Zoom out"
        >
          <ZoomOut size={16} />
        </button>
        <button 
          className="map-btn" 
          onClick={handleResetView}
          title="Reset View Orientation"
          aria-label="Reset view"
        >
          <RotateCcw size={16} />
        </button>
        <button 
          className={`map-btn ${showRings ? 'active' : ''}`}
          onClick={() => setShowRings(!showRings)}
          title={showRings ? 'Hide Distance Radius Rings' : 'Show Distance Radius Rings'}
          aria-label="Toggle distance rings"
        >
          <Crosshair size={16} />
        </button>
        <button 
          className={`map-btn ${showFlow ? 'active' : ''}`}
          onClick={() => setShowFlow(!showFlow)}
          title={showFlow ? 'Hide Trajectory Flow Corridor' : 'Show Trajectory Flow Corridor'}
          aria-label="Toggle trajectory flow"
        >
          <Navigation size={16} />
        </button>
      </div>

      {/* SVG Tactical Grid Canvas */}
      <svg 
        className="map-svg-canvas" 
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          {/* Blueprint Grid Pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1D212A" strokeWidth="0.8" />
          </pattern>
          <pattern id="gridSubtle" width="160" height="160" patternUnits="userSpaceOnUse">
            <rect width="160" height="160" fill="none" stroke="#252A36" strokeWidth="1.2" />
          </pattern>

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

        {/* Tactical Background Grid (Fixed base layer) */}
        <rect width="100%" height="100%" fill="#121417" />
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#gridSubtle)" />

        {/* Dynamic Zoom & Pan Coordinate Space */}
        <g 
          transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
          style={{ 
            transformOrigin: '500px 300px',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out' 
          }}
        >
          {/* Fictional Geographic Schematic Landmarks - Delhi Sectors */}
          {/* River corridor (schematic curve) */}
          <path 
            d="M 720 0 Q 760 250, 840 400 T 980 600" 
            fill="none" 
            stroke="#1E2A38" 
            strokeWidth="38" 
            strokeLinecap="round" 
            pointerEvents="none"
          />
          <text x="790" y="320" fill="#3B506D" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="3" pointerEvents="none">
            YAMUNA RIVER ARTERIAL
          </text>

          {/* Major Avenue: Connaught Place Radial Corridor */}
          <line x1="180" y1="120" x2="680" y2="480" stroke="#2B3242" strokeWidth="12" strokeLinecap="round" pointerEvents="none" />
          <text x="340" y="275" fill="#586379" fontSize="10" fontFamily="var(--font-mono)" transform="rotate(35 340 275)" letterSpacing="2" pointerEvents="none">
            CONNAUGHT PLACE RADIAL CORRIDOR
          </text>

          {/* Karol Bagh Arterial Crossline */}
          <line x1="280" y1="520" x2="620" y2="100" stroke="#252B39" strokeWidth="8" strokeLinecap="round" pointerEvents="none" />
          <text x="440" y="300" fill="#4B5568" fontSize="9" fontFamily="var(--font-mono)" transform="rotate(-51 440 300)" letterSpacing="2" pointerEvents="none">
            KAROL BAGH ARTERIAL
          </text>

          {/* Delhi Metro Blue Line Transit Vector */}
          <path 
            d="M 440 264 Q 510 300, 580 336" 
            fill="none" 
            stroke="#0284C7" 
            strokeWidth="3.5" 
            strokeDasharray="6 4" 
            pointerEvents="none"
          />
          <text x="495" y="295" fill="#38BDF8" fontSize="9" fontFamily="var(--font-mono)" pointerEvents="none">
            DMRC BLUE LINE TRANSIT VECTOR
          </text>

          {/* Central Park Sector boundary */}
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
            pointerEvents="none"
          />
          <text x="215" y="170" fill="#3D7A60" fontSize="10" fontFamily="var(--font-heading)" letterSpacing="1" pointerEvents="none">
            CENTRAL PARK SECTOR
          </text>

          {/* Karol Bagh Hub Schematic */}
          <rect 
            x="540" 
            y="310" 
            width="90" 
            height="50" 
            rx="4" 
            fill="#1F1C2B" 
            stroke="#4C3F7A" 
            strokeWidth="1.5" 
            pointerEvents="none"
          />
          <text x="546" y="340" fill="#9D8CDB" fontSize="9" fontFamily="var(--font-heading)" letterSpacing="1" pointerEvents="none">
            KAROL BAGH HUB
          </text>

          {/* Concentric Distance Rings from Last Known Location */}
          {showRings && (
            <g className="range-rings" opacity="0.65" pointerEvents="none">
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
            <g className="trajectory-flow-path" pointerEvents="none">
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

          {/* Origin Marker: Last Known Location (Crisp Tactical Crosshair - No Buffering Animation) */}
          <g transform={`translate(${originX}, ${originY})`} pointerEvents="none">
            <circle r="22" fill="none" stroke="#FF5528" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
            <line x1="-26" y1="0" x2="26" y2="0" stroke="#FF5528" strokeWidth="1" opacity="0.5" />
            <line x1="0" y1="-26" x2="0" y2="26" stroke="#FF5528" strokeWidth="1" opacity="0.5" />
            <circle r="7" fill="#FF5528" />
            <circle r="2.5" fill="#FFFFFF" />
            <text 
              x="14" 
              y="-10" 
              fill="#FFFFFF" 
              fontSize="11" 
              fontFamily="var(--font-heading)" 
              fontWeight="bold"
              letterSpacing="0.05em"
            >
              ORIGIN: {activeCase.neighbourhood ? activeCase.neighbourhood.toUpperCase() : 'LAST KNOWN'} ({activeCase.lastSeenTime.split(' ')[0]})
            </text>
          </g>

          {/* Sighting Nodes / Pins */}
          {scaledSightings.map((s) => {
            const isSelected = selectedSightingId === s.id;
            const pinColor = getPinColor(s.status, isSelected);

            return (
              <g 
                key={s.id} 
                className="map-pin-group"
                transform={`translate(${s.pixelX}, ${s.pixelY})`}
                onClick={() => {
                  if (!hasMovedRef.current) {
                    onSelectSighting(s.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Sighting ${s.code}: ${s.locationName}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectSighting(s.id);
                  }
                }}
              >
                {/* Tactical Target Reticle for selected pin (Crisp Static Selection Ring - Zero Buffering Look) */}
                {isSelected && (
                  <g pointerEvents="none">
                    <circle 
                      r="17" 
                      fill="none" 
                      stroke={pinColor} 
                      strokeWidth="1.8" 
                      strokeDasharray="4 2" 
                    />
                    <circle 
                      r="22" 
                      fill="none" 
                      stroke={pinColor} 
                      strokeWidth="1" 
                      opacity="0.4" 
                    />
                    {/* Tactical Reticle Cardinal Ticks */}
                    <line x1="-25" y1="0" x2="-19" y2="0" stroke={pinColor} strokeWidth="1.5" />
                    <line x1="19" y1="0" x2="25" y2="0" stroke={pinColor} strokeWidth="1.5" />
                    <line x1="0" y1="-25" x2="0" y2="-19" stroke={pinColor} strokeWidth="1.5" />
                    <line x1="0" y1="19" x2="0" y2="25" stroke={pinColor} strokeWidth="1.5" />
                  </g>
                )}

                {/* Pin Base Shadow */}
                <circle r="10" fill="#121316" stroke={pinColor} strokeWidth={isSelected ? '3' : '2.2'} />

                {/* Inner Core */}
                <circle r="4" fill={pinColor} />

                {/* Sequence Badge Label */}
                <rect 
                  x="12" 
                  y="-18" 
                  width="68" 
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
                  opacity="0.9"
                  pointerEvents="none"
                >
                  +{s.elapsedMinutes}m ({s.reportedTime.split(' ')[0]})
                </text>
              </g>
            );
          })}
        </g>
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
        <span style={{ color: '#8891A0', marginLeft: '6px' }}>• DRAG TO PAN • SCROLL TO ZOOM</span>
      </div>
    </div>
  );
};
