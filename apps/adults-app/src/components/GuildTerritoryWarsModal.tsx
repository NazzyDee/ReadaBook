import React, { useState } from 'react';
import { X, Map, Sparkles, CheckCircle2, Shield, Swords, Flag } from 'lucide-react';
import { DEFAULT_TERRITORY_ZONES, type TerritoryZone } from '../lib/guildTerritoryData';
import { soundFX } from '../lib/soundFx';

interface GuildTerritoryWarsModalProps {
  streamerName: string;
  onClose: () => void;
}

export const GuildTerritoryWarsModal: React.FC<GuildTerritoryWarsModalProps> = ({
  streamerName,
  onClose
}) => {
  const [zones, setZones] = useState<TerritoryZone[]>(DEFAULT_TERRITORY_ZONES);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone_citadel_spire');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleContributeReading = (zone: TerritoryZone) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setZones(prev => prev.map(z => {
      if (z.id === zone.id) {
        return {
          ...z,
          controlPct: Math.min(100, z.controlPct + 5),
          totalReadingMinutesLogged: z.totalReadingMinutesLogged + 30
        };
      }
      return z;
    }));
    setToastMsg(`⚔️ Contributed 30 Reading Sprint Minutes to ${zone.name}! Guild Influence Increased.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const currentZone = zones.find(z => z.id === selectedZoneId) || zones[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="territory-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="territory-modal-header">
          <div className="territory-title-group">
            <div className="territory-badge">
              <Map size={16} />
              <span>GUILD TERRITORY WARS: WORLD MAP CONQUEST</span>
            </div>
            <h3>@{streamerName}'s Realm Conquest Map</h3>
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

        {/* Territory World Map Hero Banner */}
        <div className="territory-hero-banner">
          <div className="territory-map-canvas">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=80"
              alt="World Map"
              className="realm-map-bg"
            />
            {zones.map(z => (
              <div
                key={z.id}
                className={`zone-marker-pin ${z.id === selectedZoneId ? 'active' : ''}`}
                onClick={() => {
                  soundFX.playPop();
                  setSelectedZoneId(z.id);
                }}
              >
                <Flag size={14} />
                <span>{z.controlPct}%</span>
              </div>
            ))}
          </div>

          <div className="territory-hero-meta">
            <div className="guild-owner-row">
              <Shield size={14} color="#00ff88" />
              <span>Controlled By: <strong>{currentZone.controllingGuild.replace('_', ' ')}</strong></span>
            </div>
            <h4>{currentZone.name}</h4>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${currentZone.controlPct}%` }}></div>
            </div>
            <div className="zone-stats-row">
              <span>{currentZone.totalReadingMinutesLogged.toLocaleString()} mins read by Guild</span>
              <span className="perk-tag">{currentZone.bonusPerk}</span>
            </div>

            <button
              type="button"
              className="btn-raid-zone"
              onClick={() => handleContributeReading(currentZone)}
            >
              <Swords size={16} />
              <span>Channel Guild Sprint Power (+5% Dominance)</span>
            </button>
          </div>
        </div>

        {/* Zones List Grid */}
        <div className="territory-zones-grid">
          {zones.map(z => {
            const isSelected = z.id === selectedZoneId;
            return (
              <div
                key={z.id}
                className={`territory-zone-tile ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  soundFX.playPop();
                  setSelectedZoneId(z.id);
                }}
              >
                <div className="zone-tile-top">
                  <strong>{z.name}</strong>
                  <span className="control-pct-pill">{z.controlPct}%</span>
                </div>
                <span className="controlling-guild-sub">{z.controllingGuild}</span>
                <span className="zone-perk-sub">🎁 {z.bonusPerk}</span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="territory-modal-footer">
          <span className="footer-realm-note">
            🗺️ Realm resets every Sunday at midnight. Top Guild receives the Golden Scribe Banner.
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            <CheckCircle2 size={16} />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
