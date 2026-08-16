import React, { useState, useEffect } from 'react';
import { X, Flame, Users, BookOpen, Copy, Check, Sparkles, Send } from 'lucide-react';
import { MOCK_RAID_TARGETS, type RaidTargetStreamer } from '../lib/raidStationData';
import { soundFX } from '../lib/soundFx';

interface RaidStationModalProps {
  streamerName: string;
  onClose: () => void;
  onExecuteRaid?: (target: RaidTargetStreamer) => void;
}

export const RaidStationModal: React.FC<RaidStationModalProps> = ({
  streamerName,
  onClose,
  onExecuteRaid
}) => {
  const [targets] = useState<RaidTargetStreamer[]>(MOCK_RAID_TARGETS);
  const [selectedTarget, setSelectedTarget] = useState<RaidTargetStreamer>(MOCK_RAID_TARGETS[0]);
  const [raidCountdown, setRaidCountdown] = useState<number | null>(null);
  const [copiedChant, setCopiedChant] = useState(false);
  const [raidLaunched, setRaidLaunched] = useState(false);

  useEffect(() => {
    if (raidCountdown === null) return;

    if (raidCountdown > 0) {
      const timer = setTimeout(() => {
        soundFX.playPop();
        setRaidCountdown(raidCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      soundFX.playDragonRoar();
      soundFX.playApplause();
      setRaidLaunched(true);
      if (onExecuteRaid) {
        onExecuteRaid(selectedTarget);
      }
    }
  }, [raidCountdown, selectedTarget, onExecuteRaid]);

  const handleStartCountdown = () => {
    soundFX.playPop();
    setRaidCountdown(5);
  };

  const handleCancelRaid = () => {
    soundFX.playPop();
    setRaidCountdown(null);
  };

  const handleCopyChant = () => {
    soundFX.playPop();
    navigator.clipboard.writeText(selectedTarget.raidChantMessage);
    setCopiedChant(true);
    setTimeout(() => setCopiedChant(false), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="raid-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="raid-modal-header">
          <div className="raid-title-group">
            <div className="raid-badge">
              <Flame size={16} />
              <span>OUTGOING BOOK RAID STATION</span>
            </div>
            <h3>Send @{streamerName}'s Readers on a Raid</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        <p className="raid-intro-text">
          Host a channel raid at the end of your stream to send your active readers and hype directly into another live book broadcaster's channel!
        </p>

        {raidLaunched ? (
          <div className="raid-success-card">
            <Sparkles size={48} color="#ffd700" className="pulse-sparkle" />
            <h3>⚔️ RAID LAUNCHED TO @{selectedTarget.name}!</h3>
            <p>Your readers are now migrating to {selectedTarget.name}’s live read-along of <em>{selectedTarget.currentBook}</em>.</p>
            <button className="btn-primary" onClick={onClose}>
              Complete Broadcast & Close
            </button>
          </div>
        ) : (
          <div className="raid-grid-layout">
            {/* Target Streamers List */}
            <div className="raid-targets-list">
              <h4>Recommended Live Channels</h4>
              {targets.map(target => (
                <div
                  key={target.id}
                  className={`raid-target-row ${selectedTarget.id === target.id ? 'selected' : ''}`}
                  onClick={() => {
                    soundFX.playPop();
                    setSelectedTarget(target);
                  }}
                >
                  <img src={target.avatarUrl} alt={target.name} className="raid-target-avatar" />

                  <div className="raid-target-info">
                    <div className="target-name-row">
                      <strong>@{target.name}</strong>
                      {target.isMutualFollow && <span className="mutual-tag">Mutual Friend</span>}
                    </div>
                    <span className="target-book-sub">Reading: <em>{target.currentBook}</em></span>
                    <span className="target-chapter-sub">{target.currentChapter} (Page {target.currentPage})</span>
                  </div>

                  <div className="target-viewers-pill">
                    <Users size={12} />
                    <span>{target.viewersCount}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Raid Command Center */}
            <div className="raid-command-panel">
              <div className="selected-preview-card">
                <span className="preview-label">TARGET BROADCASTER</span>
                <div className="preview-streamer-meta">
                  <img src={selectedTarget.avatarUrl} alt={selectedTarget.name} />
                  <div>
                    <h4>@{selectedTarget.name}</h4>
                    <span className="genre-chip">{selectedTarget.genre}</span>
                  </div>
                </div>

                <div className="preview-book-info">
                  <BookOpen size={14} color="var(--accent-secondary)" />
                  <span>Currently on <strong>Page {selectedTarget.currentPage}</strong> of <em>{selectedTarget.currentBook}</em></span>
                </div>
              </div>

              {/* Raid Chant Copy Box */}
              <div className="raid-chant-box">
                <div className="chant-header">
                  <span>RAID CHANT MESSAGE:</span>
                  <button type="button" className="btn-copy-chant" onClick={handleCopyChant}>
                    {copiedChant ? <Check size={13} color="var(--accent-success)" /> : <Copy size={13} />}
                    <span>{copiedChant ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="chant-text">{selectedTarget.raidChantMessage}</div>
              </div>

              {/* Countdown / Trigger Action */}
              <div className="raid-actions-bottom">
                {raidCountdown !== null ? (
                  <div className="raid-countdown-active">
                    <div className="countdown-number">{raidCountdown}</div>
                    <p>Raiding @{selectedTarget.name} in {raidCountdown} seconds...</p>
                    <button className="btn-secondary btn-cancel-raid" onClick={handleCancelRaid}>
                      Cancel Raid
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn-master-raid"
                    onClick={handleStartCountdown}
                  >
                    <Send size={18} />
                    <span>Initiate Raid ({selectedTarget.viewersCount} Viewers)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
