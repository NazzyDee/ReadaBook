import React, { useState } from 'react';
import { X, Castle, Sparkles, CheckCircle2, Trophy, Crown } from 'lucide-react';
import { DEFAULT_CITADEL_TROPHIES, type CitadelTrophyItem } from '../lib/readerCitadelData';
import { soundFX } from '../lib/soundFx';

interface ReaderCitadelBookshelfModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ReaderCitadelBookshelfModal: React.FC<ReaderCitadelBookshelfModalProps> = ({
  streamerName,
  onClose
}) => {
  const [trophies] = useState<CitadelTrophyItem[]>(DEFAULT_CITADEL_TROPHIES);
  const [selectedTrophyId, setSelectedTrophyId] = useState<string>('trophy_quill_100k');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleInspectTrophy = (t: CitadelTrophyItem) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setSelectedTrophyId(t.id);
    setToastMsg(`🏰 Inspected Citadel Artifact: "${t.name}"!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const currentTrophy = trophies.find(t => t.id === selectedTrophyId) || trophies[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="citadel-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="citadel-modal-header">
          <div className="citadel-title-group">
            <div className="citadel-badge">
              <Castle size={16} />
              <span>READER CITADEL & 3D DIGITAL BOOKSHELF TROPHY ROOM</span>
            </div>
            <h3>@{streamerName}'s Personal Sanctuary Citadel</h3>
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

        {/* 3D Bookshelf Mahogany Display Banner */}
        <div className="citadel-hero-banner">
          <div className="citadel-shelf-stage">
            {/* Shelf 1 */}
            <div className="mahogany-shelf">
              <div className="shelf-items-row">
                {trophies.filter(t => t.shelfTier === 1).map(t => (
                  <div
                    key={t.id}
                    className={`trophy-shelf-item ${t.id === selectedTrophyId ? 'selected' : ''}`}
                    onClick={() => handleInspectTrophy(t)}
                    style={{ borderColor: t.glowColor, boxShadow: `0 0 15px ${t.glowColor}44` }}
                  >
                    <span>{t.type === 'GOLD_QUILL' ? '🪶' : t.type === 'LEATHER_FOLIO' ? '📕' : '⏳'}</span>
                  </div>
                ))}
              </div>
              <div className="shelf-wood-plank"></div>
            </div>

            {/* Shelf 2 */}
            <div className="mahogany-shelf">
              <div className="shelf-items-row">
                {trophies.filter(t => t.shelfTier === 2).map(t => (
                  <div
                    key={t.id}
                    className={`trophy-shelf-item ${t.id === selectedTrophyId ? 'selected' : ''}`}
                    onClick={() => handleInspectTrophy(t)}
                    style={{ borderColor: t.glowColor, boxShadow: `0 0 15px ${t.glowColor}44` }}
                  >
                    <span>⏳</span>
                  </div>
                ))}
              </div>
              <div className="shelf-wood-plank"></div>
            </div>
          </div>

          <div className="citadel-hero-meta">
            <div className="citadel-rank-badge">
              <Crown size={14} color="#ffd700" />
              <span>Citadel Level 14: Grand Archivist Sanctuary</span>
            </div>
            <h4>{currentTrophy.name}</h4>
            <p className="trophy-obtained-sub">Achievement: {currentTrophy.obtainedFrom}</p>
            <div className="shelf-specs-pill">
              <span>Location: Shelf Tier {currentTrophy.shelfTier} • Slot {currentTrophy.shelfPosition}</span>
            </div>
          </div>
        </div>

        {/* Trophy Grid */}
        <div className="citadel-trophies-grid">
          {trophies.map(t => (
            <div
              key={t.id}
              className={`trophy-tile ${t.id === selectedTrophyId ? 'selected' : ''}`}
              onClick={() => handleInspectTrophy(t)}
            >
              <Trophy size={18} color={t.glowColor} />
              <div className="trophy-tile-info">
                <strong>{t.name}</strong>
                <span>{t.obtainedFrom}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="citadel-modal-footer">
          <span className="footer-citadel-note">
            🏰 Viewers can visit each other's 3D Bookcases directly from channel chat usernames.
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
