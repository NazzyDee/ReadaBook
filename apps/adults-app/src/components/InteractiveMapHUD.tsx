import React, { useState } from 'react';
import {
  X,
  Compass,
  MapPin,
  ShieldAlert,
  Users,
  Footprints
} from 'lucide-react';
import {
  SAMPLE_MAPS,
  type FantasyWorldMap,
  type MapWaypoint
} from '../lib/mapData';
import { soundFX } from '../lib/soundFx';

interface InteractiveMapHUDProps {
  currentChapterNum?: number;
  onClose: () => void;
}

export const InteractiveMapHUD: React.FC<InteractiveMapHUDProps> = ({
  currentChapterNum = 4,
  onClose
}) => {
  const map: FantasyWorldMap = SAMPLE_MAPS[0];
  const [selectedWaypoint, setSelectedWaypoint] = useState<MapWaypoint | null>(
    map.waypoints.find(w => w.chapterUnlocked === currentChapterNum) || map.waypoints[0]
  );
  const [activeChapter, setActiveChapter] = useState(currentChapterNum);

  const handleSelectWaypoint = (wp: MapWaypoint) => {
    soundFX.playPop();
    setSelectedWaypoint(wp);
  };

  const handleSelectChapter = (ch: number) => {
    soundFX.playPop();
    setActiveChapter(ch);
    const target = map.waypoints.find(w => w.chapterUnlocked === ch) || map.waypoints[0];
    setSelectedWaypoint(target);
  };

  // Build SVG path string for journey
  const pathD = map.waypoints
    .filter(w => w.chapterUnlocked <= activeChapter + 1)
    .map((w, idx) => `${idx === 0 ? 'M' : 'L'} ${w.xPercent * 8} ${w.yPercent * 4.5}`)
    .join(' ');

  return (
    <div className="modal-backdrop">
      <div className="map-hud-modal-card">
        {/* Header */}
        <div className="map-hud-header">
          <div className="map-title-group">
            <Compass size={24} color="#00e5ff" className="pulse-fast" />
            <div>
              <h3>🗺️ Interactive Journey Map HUD</h3>
              <span className="modal-subtitle">{map.worldName} • {map.bookTitle}</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Chapter Journey Timeline Navigation */}
        <div className="map-timeline-bar">
          <span className="timeline-lbl">
            <Footprints size={14} color="var(--accent-secondary)" /> Chapter Waypoint:
          </span>
          <div className="timeline-steps">
            {map.waypoints.map(w => {
              const isCurrent = w.chapterUnlocked === activeChapter;
              const isPast = w.chapterUnlocked < activeChapter;

              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => handleSelectChapter(w.chapterUnlocked)}
                  className={`timeline-step-btn ${isCurrent ? 'current' : isPast ? 'past' : 'future'}`}
                  title={`${w.name} (Chapter ${w.chapterUnlocked})`}
                >
                  <span className="step-num">Ch. {w.chapterUnlocked}</span>
                  <span className="step-name">{w.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Map Canvas Container */}
        <div className="map-canvas-container">
          {/* Visual Map Background Layer */}
          <div
            className="map-visual-layer"
            style={{ backgroundImage: `url(${map.mapBackgroundUrl})` }}
          >
            {/* SVG Connecting Journey Lines */}
            <svg className="map-svg-routes" viewBox="0 0 800 450">
              <path
                d={pathD}
                fill="none"
                stroke="#00e5ff"
                strokeWidth="3"
                strokeDasharray="6 4"
                className="journey-path-anim"
              />
            </svg>

            {/* Interactive Waypoint Location Pins */}
            {map.waypoints.map(w => {
              const isSelected = selectedWaypoint?.id === w.id;
              const isCurrentLocation = w.chapterUnlocked === activeChapter;

              return (
                <div
                  key={w.id}
                  style={{ left: `${w.xPercent}%`, top: `${w.yPercent}%` }}
                  className={`map-pin-anchor ${isSelected ? 'selected' : ''} ${isCurrentLocation ? 'current-pos' : ''}`}
                  onClick={() => handleSelectWaypoint(w)}
                >
                  {isCurrentLocation && <div className="character-pulse-aura" />}
                  <div className="pin-marker">
                    <MapPin size={18} color={isCurrentLocation ? '#00e5ff' : '#ffd700'} />
                  </div>
                  <span className="pin-name-label">{w.name}</span>
                </div>
              );
            })}
          </div>

          {/* Selected Waypoint Lore Dossier Card */}
          {selectedWaypoint && (
            <div className="waypoint-dossier-card">
              <div className="dossier-header">
                <div>
                  <span className="dossier-region">{selectedWaypoint.region}</span>
                  <h4 className="dossier-name">{selectedWaypoint.name}</h4>
                </div>
                <span className={`danger-badge ${selectedWaypoint.dangerLevel.toLowerCase()}`}>
                  <ShieldAlert size={12} /> {selectedWaypoint.dangerLevel}
                </span>
              </div>

              <p className="dossier-desc">{selectedWaypoint.description}</p>

              <div className="dossier-meta-grid">
                <div className="meta-item">
                  <span className="meta-lbl">Distance Traveled</span>
                  <strong className="meta-val">{selectedWaypoint.distanceKm} km</strong>
                </div>
                <div className="meta-item">
                  <span className="meta-lbl">Story Timeline</span>
                  <strong className="meta-val">Chapter {selectedWaypoint.chapterUnlocked}</strong>
                </div>
              </div>

              <div className="dossier-characters">
                <span className="chars-lbl">
                  <Users size={12} /> Active Characters:
                </span>
                <div className="chars-chips">
                  {selectedWaypoint.activeCharacters.map((c, idx) => (
                    <span key={idx} className="char-chip">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-primary">
            Close Map HUD
          </button>
        </div>
      </div>
    </div>
  );
};
