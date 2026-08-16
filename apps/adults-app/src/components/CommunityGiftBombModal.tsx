import React, { useState } from 'react';
import { X, Gift, Sparkles, CheckCircle2, Zap, Trophy, Users } from 'lucide-react';
import { GIFT_BOMB_TIERS, MOCK_ACTIVE_CHATTERS, type GiftBombTier } from '../lib/giftBombData';
import { soundFX } from '../lib/soundFx';

interface CommunityGiftBombModalProps {
  streamerName: string;
  onClose: () => void;
  onGiftBombSuccess?: (tier: GiftBombTier, recipients: string[]) => void;
}

export const CommunityGiftBombModal: React.FC<CommunityGiftBombModalProps> = ({
  streamerName,
  onClose,
  onGiftBombSuccess
}) => {
  const [selectedTierId, setSelectedTierId] = useState('bomb_10');
  const [customMsg, setCustomMsg] = useState('Enjoy the reading stream, everyone! 📖✨');
  const [isProcessing, setIsProcessing] = useState(false);
  const [luckyRecipients, setLuckyRecipients] = useState<string[] | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const selectedTier = GIFT_BOMB_TIERS.find(t => t.id === selectedTierId) || GIFT_BOMB_TIERS[1];

  const handlePurchaseGiftBomb = () => {
    soundFX.playChestClaim();
    setIsProcessing(true);

    setTimeout(() => {
      // Pick random recipients
      const shuffled = [...MOCK_ACTIVE_CHATTERS].sort(() => 0.5 - Math.random());
      const recipients = shuffled.slice(0, Math.min(selectedTier.quantity, shuffled.length));

      setLuckyRecipients(recipients);
      setIsProcessing(false);
      soundFX.playDragonRoar();
      soundFX.playApplause();

      if (onGiftBombSuccess) {
        onGiftBombSuccess(selectedTier, recipients);
      }

      setSuccessToast(`🎉 GIFT BOMB EXPLOSION! You gifted ${selectedTier.quantity} subscriptions to @${streamerName}'s community!`);
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="gift-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="gift-modal-header">
          <div className="gift-title-group">
            <div className="gift-badge">
              <Gift size={16} />
              <span>COMMUNITY GIFT BOMB & GUILD MONETIZATION</span>
            </div>
            <h3>Gift Subscriptions to @{streamerName}'s Chat</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Lucky Recipients Explosion View */}
        {luckyRecipients ? (
          <div className="lucky-recipients-container">
            <div className="explosion-header">
              <Trophy size={28} color="#ffd700" />
              <h4>Gift Bomb Delivered to {luckyRecipients.length} Lucky Readers!</h4>
              <p>Each reader has been granted 1 month of ad-free reading and custom channel runes.</p>
            </div>

            <div className="recipients-grid-chips">
              {luckyRecipients.map((user, idx) => (
                <div key={idx} className="recipient-chip">
                  <CheckCircle2 size={13} color="var(--accent-success)" />
                  <span>@{user}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn-primary btn-close-recipients"
              onClick={onClose}
            >
              <span>Awesome! Back to Stream</span>
            </button>
          </div>
        ) : (
          <>
            <p className="gift-intro-text">
              Support @{streamerName} and delight fellow readers by gifting subscriptions to active community members in chat!
            </p>

            {/* Gift Packages Grid */}
            <div className="gift-tiers-grid">
              {GIFT_BOMB_TIERS.map(tier => (
                <button
                  key={tier.id}
                  type="button"
                  className={`gift-tier-card ${selectedTierId === tier.id ? 'active' : ''}`}
                  style={{ borderColor: selectedTierId === tier.id ? tier.glowColor : undefined }}
                  onClick={() => {
                    soundFX.playPop();
                    setSelectedTierId(tier.id);
                  }}
                >
                  {tier.isPopular && <span className="popular-ribbon">MOST POPULAR</span>}
                  <div className="tier-quantity-circle" style={{ borderColor: tier.glowColor, color: tier.glowColor }}>
                    <strong>{tier.quantity}</strong>
                    <span>SUBS</span>
                  </div>

                  <div className="tier-info-text">
                    <h4>{tier.title}</h4>
                    <span className="tier-badge-label">{tier.badge}</span>
                  </div>

                  <div className="tier-price-box">
                    <strong>${tier.priceUsd.toFixed(2)}</strong>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Message */}
            <div className="gift-msg-box">
              <label>Attach a celebration note to chat:</label>
              <input
                type="text"
                value={customMsg}
                onChange={e => setCustomMsg(e.target.value)}
                placeholder="Write an encouraging note..."
              />
            </div>

            {/* Footer */}
            <div className="gift-modal-footer">
              <div className="footer-recipients-note">
                <Users size={14} color="var(--text-muted)" />
                <span>Subs will be randomly gifted to active chatters without active subscriptions.</span>
              </div>

              <button
                type="button"
                className="btn-primary btn-launch-bomb"
                disabled={isProcessing}
                onClick={handlePurchaseGiftBomb}
              >
                <Zap size={16} />
                <span>{isProcessing ? 'Processing Gift Bomb...' : `Gift ${selectedTier.quantity} Subs ($${selectedTier.priceUsd.toFixed(2)})`}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
