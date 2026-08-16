import React, { useState } from 'react';
import { X, MapPin, Sparkles, Compass, Navigation } from 'lucide-react';
import { REALM_MAP_LOCATIONS, type MapLocationPoi } from '../lib/worldLoreAtlasData';
import { soundFX } from '../lib/soundFx';

interface WorldLoreAtlasModalProps {
  streamerName: string;
  onClose: () => void;
}

export const WorldLoreAtlasModal: React.FC<WorldLoreAtlasModalProps> = ({
  streamerName,
  onClose
}) => {
  const [selectedPoi, setSelectedPoi] = useState<MapLocationPoi>(
    REALM_MAP_LOCATIONS.find(p => p.isNarratorCurrentLocation) || REALM_MAP_LOCATIONS[0]
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSelectPoi = (poi: MapLocationPoi) => {
    soundFX.playPop();
    soundFX.playPageRustle();
    setSelectedPoi(poi);
    setToastMsg(`🗺️ Discovered Lore for "${poi.name}" (${poi.distanceFromStartLeagues} Leagues from Start)!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="atlas-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="atlas-modal-header">
          <div className="atlas-title-group">
            <div className="atlas-badge">
              <Compass size={16} />
              <span>WORLD LORE ATLAS & INTERACTIVE REALM MAP</span>
            </div>
            <h3>@{streamerName}'s Middle-Earth Cartography</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Interactive Map Canvas Container */}
        <div className="atlas-map-canvas">
          <div className="map-texture-bg">
            {/* Map POI Markers */}
            {REALM_MAP_LOCATIONS.map(poi => {
              const isSelected = selectedPoi.id === poi.id;
              return (
                <div
                  key={poi.id}
                  className={`map-poi-marker ${isSelected ? 'selected' : ''} ${poi.isNarratorCurrentLocation ? 'current-live' : ''}`}
                  style={{ left: `${poi.coordinates.x}%`, top: `${poi.coordinates.y}%` }}
                  onClick={() => handleSelectPoi(poi)}
                >
                  <MapPin size={22} color={poi.isNarratorCurrentLocation ? '#00ff88' : isSelected ? '#ffd700' : '#fff'} />
                  <span className="poi-label">{poi.name}</span>
                  {poi.isNarratorCurrentLocation && (
                    <span className="live-narrator-radar">LIVE NARRATION</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected POI Lore Details Card */}
        <div className="poi-lore-details-card">
          <div className="poi-details-top">
            <div className="poi-title-col">
              <h4>{selectedPoi.name}</h4>
              <span className="poi-region-tag">{selectedPoi.region}</span>
            </div>

            <div className="distance-badge">
              <Navigation size={14} color="#ffd700" />
              <span>{selectedPoi.distanceFromStartLeagues} Leagues Journeyed</span>
            </div>
          </div>

          <p className="poi-lore-summary">{selectedPoi.loreSummary}</p>
        </div>

        {/* Footer */}
        <div className="atlas-modal-footer">
          <span className="atlas-notice">
            ✨ Interactive Cartography automatically syncs with chapter changes in broadcast stream.
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            <span>Close Atlas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
