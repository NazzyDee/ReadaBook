import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Shield, Users, Flag } from 'lucide-react';
import { DEFAULT_FACTIONS, type ReaderFaction } from '../lib/factionAlignmentData';
import { soundFX } from '../lib/soundFx';

interface FactionAlignmentModalProps {
  streamerName: string;
  onClose: () => void;
}

export const FactionAlignmentModal: React.FC<FactionAlignmentModalProps> = ({
  streamerName,
  onClose
}) => {
  const [factions, setFactions] = useState<ReaderFaction[]>(DEFAULT_FACTIONS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handlePledgeAllegiance = (fac: ReaderFaction) => {
    soundFX.playPop();
    soundFX.playHarp();
    setFactions(prev => prev.map(f => ({
      ...f,
      isUserAligned: f.id === fac.id
    })));
    setToastMsg(`🛡️ Pledged allegiance to ${fac.factionName}! Your chat name color and cosmetic aura have updated.`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="faction-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="faction-modal-header">
          <div className="faction-title-group">
            <div className="faction-badge">
              <Shield size={16} />
              <span>PERSISTENT LORE FACTION ALIGNMENT</span>
            </div>
            <h3>@{streamerName}'s Faction War Room</h3>
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

        {/* Hero Banner */}
        <div className="faction-hero-banner">
          <div className="banner-icon-dial">
            <Flag size={44} color="#00ff88" />
            <span className="war-status-tag">SEASON 4 WAR</span>
          </div>

          <div className="faction-hero-meta">
            <h4>Pledge Loyalty to an Ancient Reader Order</h4>
            <p className="faction-explainer">
              Factions compete during stream sprints, raids, and trivia for channel dominance, customized chat name cosmetics, and exclusive faction subathons.
            </p>
          </div>
        </div>

        {/* Factions Roster Grid */}
        <div className="factions-grid">
          {factions.map(fac => (
            <div
              key={fac.id}
              className={`faction-card ${fac.isUserAligned ? 'aligned' : ''}`}
              style={{ borderLeftColor: fac.accentColor }}
            >
              <div className="fac-top">
                <div className="fac-title-row">
                  <Shield size={20} color={fac.accentColor} />
                  <strong>{fac.factionName}</strong>
                </div>
                <span className="fac-control-pill" style={{ color: fac.accentColor }}>
                  {fac.territoryControlPct}% Control
                </span>
              </div>

              <p className="fac-motto"><em>{fac.motto}</em></p>
              <p className="fac-desc">{fac.loreDescription}</p>

              <div className="fac-bottom">
                <span className="members-count">
                  <Users size={12} />
                  <span>{fac.totalMembersCount.toLocaleString()} Scribes</span>
                </span>

                <button
                  type="button"
                  className={`btn-pledge-fac ${fac.isUserAligned ? 'aligned' : ''}`}
                  onClick={() => handlePledgeAllegiance(fac)}
                >
                  {fac.isUserAligned ? 'Active Allegiance' : 'Pledge Loyalty'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="faction-modal-footer">
          <span className="footer-faction-note">
            🛡️ Changing faction alignment resets weekly guild contribution points.
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
