import React, { useState } from 'react';
import { usePoints } from '../lib/PointsContext';
import { DEFAULT_CHANNEL_REWARDS, type ChannelReward } from '../lib/pointsData';
import { X, Check, AlertCircle } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

interface ChannelPointsShopProps {
  streamerName?: string;
  onClose: () => void;
}

export const ChannelPointsShop: React.FC<ChannelPointsShopProps> = ({ onClose }) => {
  const { points, redeemReward } = usePoints();
  const [selectedReward, setSelectedReward] = useState<ChannelReward | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectReward = (reward: ChannelReward) => {
    soundFX.playPop();
    setSelectedReward(reward);
    setInputVal('');
    setErrorMsg(null);
    setRedeemSuccess(null);
  };

  const handleConfirmRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReward) return;

    if (points < selectedReward.cost) {
      soundFX.playPop();
      setErrorMsg(`Not enough Book Tokens! You need ${selectedReward.cost - points} more.`);
      return;
    }

    if (selectedReward.requiresInput && !inputVal.trim()) {
      setErrorMsg('Please enter the required information.');
      return;
    }

    const ok = redeemReward(selectedReward, inputVal.trim());
    if (ok) {
      // Play appropriate sound effect
      const t = selectedReward.title.toLowerCase();
      if (t.includes('dragon') || selectedReward.icon.includes('🐉')) {
        soundFX.playDragonRoar();
      } else if (t.includes('harp') || t.includes('lofi') || selectedReward.icon.includes('🎶')) {
        soundFX.playHarp();
      } else if (t.includes('cheer') || t.includes('applause') || selectedReward.icon.includes('👏')) {
        soundFX.playApplause();
      } else if (t.includes('rain') || t.includes('thunder') || selectedReward.icon.includes('⛈️')) {
        soundFX.playThunder();
      } else {
        soundFX.playChestClaim();
      }

      setRedeemSuccess(`Successfully redeemed "${selectedReward.title}"!`);
      setTimeout(() => {
        setSelectedReward(null);
        setRedeemSuccess(null);
      }, 2000);
    } else {
      setErrorMsg('Failed to redeem reward. Please try again.');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="points-shop-card">
        <div className="modal-header">
          <div className="modal-title-row">
            <div className="points-badge-icon">🪙</div>
            <div>
              <h3>Channel Rewards Store</h3>
              <p className="points-balance-sub">
                Balance: <strong>{points.toLocaleString()}</strong> Book Tokens
              </p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {selectedReward ? (
          <div className="reward-confirm-container">
            <button onClick={() => setSelectedReward(null)} className="btn-back-link">
              ← Back to Rewards
            </button>

            <div className="reward-detail-card" style={{ borderColor: selectedReward.color }}>
              <span className="reward-detail-icon">{selectedReward.icon}</span>
              <h4>{selectedReward.title}</h4>
              <p>{selectedReward.description}</p>
              <div className="reward-detail-cost">
                🪙 {selectedReward.cost.toLocaleString()} Tokens
              </div>

              {selectedReward.requiresInput && (
                <div className="reward-input-group">
                  <label>{selectedReward.inputPrompt || 'Your input:'}</label>
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Enter details..."
                    className="reward-input"
                    autoFocus
                  />
                </div>
              )}

              {errorMsg && (
                <div className="reward-error-banner">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {redeemSuccess && (
                <div className="reward-success-banner">
                  <Check size={16} />
                  <span>{redeemSuccess}</span>
                </div>
              )}

              <div className="reward-action-row">
                <button
                  type="button"
                  onClick={() => setSelectedReward(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRedeem}
                  disabled={points < selectedReward.cost}
                  className="btn-primary"
                  style={{ background: selectedReward.color }}
                >
                  Redeem Reward
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rewards-grid">
            {DEFAULT_CHANNEL_REWARDS.map(reward => {
              const canAfford = points >= reward.cost;
              return (
                <div
                  key={reward.id}
                  className={`reward-item-card ${canAfford ? 'affordable' : 'locked'}`}
                  onClick={() => handleSelectReward(reward)}
                >
                  <div className="reward-item-icon-wrapper" style={{ backgroundColor: `${reward.color}22` }}>
                    <span className="reward-item-icon">{reward.icon}</span>
                  </div>
                  <div className="reward-item-info">
                    <h5>{reward.title}</h5>
                    <p>{reward.description}</p>
                    <span className="reward-cost-tag">
                      🪙 {reward.cost.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
