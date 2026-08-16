import React, { useState } from 'react';
import { X, Star, Gift, Check, Sparkles, Heart, Crown, Shield } from 'lucide-react';
import { SUB_TIERS, GIFT_PACKAGES, type SubTier, type GiftPackage } from '../lib/subscriptionData';
import { soundFX } from '../lib/soundFx';

interface SubscriptionModalProps {
  streamerName: string;
  streamerId: string;
  avatarUrl?: string;
  onClose: () => void;
  onSubscribed?: (tierName: string) => void;
  onGifted?: (count: number, total: number) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  streamerName,
  avatarUrl,
  onClose,
  onSubscribed,
  onGifted
}) => {
  const [activeTab, setActiveTab] = useState<'subscribe' | 'gift'>('subscribe');
  const [selectedTier, setSelectedTier] = useState<SubTier>(SUB_TIERS[0]);
  const [selectedGiftPkg, setSelectedGiftPkg] = useState<GiftPackage>(GIFT_PACKAGES[1]);
  const [customGiftCount, setCustomGiftCount] = useState<number>(5);
  const [giftRecipientType, setGiftRecipientType] = useState<'community' | 'specific'>('community');
  const [specificUsername, setSpecificUsername] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = () => {
    setIsProcessing(true);
    soundFX.playPop();

    setTimeout(() => {
      setIsProcessing(false);
      soundFX.playApplause();
      soundFX.playHarp();
      setSuccessToast(`🎉 Congratulations! You are now subscribed to ${streamerName} at ${selectedTier.name}!`);

      if (onSubscribed) {
        onSubscribed(selectedTier.name);
      }

      setTimeout(() => {
        setSuccessToast(null);
        onClose();
      }, 2500);
    }, 800);
  };

  const handleGiftSubs = () => {
    setIsProcessing(true);
    soundFX.playPop();

    const count = selectedGiftPkg.count;
    const total = selectedGiftPkg.totalPrice;

    setTimeout(() => {
      setIsProcessing(false);
      soundFX.playApplause();
      soundFX.playHarp();
      setSuccessToast(`🎁 AMAZING! You gifted ${count} sub${count > 1 ? 's' : ''} to ${streamerName}'s community!`);

      if (onGifted) {
        onGifted(count, total);
      }

      setTimeout(() => {
        setSuccessToast(null);
        onClose();
      }, 2500);
    }, 800);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="sub-modal-card" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="sub-modal-header">
          <div className="sub-header-streamer-badge">
            {avatarUrl ? (
              <img src={avatarUrl} alt={streamerName} className="sub-streamer-avatar" />
            ) : (
              <div className="sub-streamer-avatar-placeholder">📖</div>
            )}
            <div>
              <div className="sub-header-tag">CREATOR SUBSCRIPTIONS</div>
              <h3>Subscribe to {streamerName}</h3>
            </div>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="sub-modal-tabs">
          <button
            className={`sub-tab-btn ${activeTab === 'subscribe' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playPop();
              setActiveTab('subscribe');
            }}
          >
            <Star size={16} />
            <span>Subscribe ($4.99/mo)</span>
          </button>
          <button
            className={`sub-tab-btn ${activeTab === 'gift' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playPop();
              setActiveTab('gift');
            }}
          >
            <Gift size={16} />
            <span>Gift a Sub</span>
          </button>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={20} color="#ffd700" />
            <span>{successToast}</span>
          </div>
        )}

        {/* TAB 1: SUBSCRIBE */}
        {activeTab === 'subscribe' && (
          <div className="sub-tab-content">
            <p className="sub-intro-text">
              Support <strong>{streamerName}</strong> directly, unlock ad-free live reading streams, custom subscriber badges, and channel-exclusive emotes!
            </p>

            {/* Tier Selector Grid */}
            <div className="sub-tier-cards-grid">
              {SUB_TIERS.map(tier => {
                const isSelected = selectedTier.id === tier.id;

                return (
                  <div
                    key={tier.id}
                    className={`sub-tier-select-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      soundFX.playPop();
                      setSelectedTier(tier);
                    }}
                  >
                    <div className="sub-tier-card-header">
                      <span className="tier-badge-icon" style={{ borderColor: tier.badgeColor }}>
                        {tier.badgeIcon}
                      </span>
                      <div className="tier-name-col">
                        <h4>{tier.name.split(' (')[0]}</h4>
                        <span className="tier-badge-sub">{tier.badgeName}</span>
                      </div>
                      <div className="tier-price-pill">${tier.price.toFixed(2)}/mo</div>
                    </div>

                    <ul className="tier-perks-list">
                      {tier.perks.map((p, idx) => (
                        <li key={idx}>
                          <Check size={14} color="var(--accent-success)" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Emote Preview */}
                    <div className="tier-emotes-preview">
                      <span className="emotes-label">Sub Emotes:</span>
                      <div className="emotes-row">
                        {tier.exclusiveEmotes.map((em, i) => (
                          <span key={i} className="sub-emote-icon">{em}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkout Action */}
            <div className="sub-modal-footer">
              <div className="sub-footer-summary">
                <span>Renews monthly • Cancel anytime in Settings</span>
                <strong>${selectedTier.price.toFixed(2)} / month</strong>
              </div>

              <button
                className="btn-primary btn-subscribe-action"
                onClick={handleSubscribe}
                disabled={isProcessing}
              >
                <Crown size={18} />
                <span>{isProcessing ? 'Processing...' : `Subscribe with ${selectedTier.name.split(' (')[0]} ($${selectedTier.price.toFixed(2)})`}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: GIFT SUBS */}
        {activeTab === 'gift' && (
          <div className="sub-tab-content">
            <p className="sub-intro-text">
              Spread the literary love! Gift subscriptions to fellow readers in chat to boost channel hype, trigger on-screen confetti, and earn the <strong>Gifter Champion</strong> badge!
            </p>

            {/* Recipient Type Toggle */}
            <div className="gift-recipient-toggle">
              <button
                className={`gift-type-chip ${giftRecipientType === 'community' ? 'active' : ''}`}
                onClick={() => setGiftRecipientType('community')}
              >
                <Heart size={14} />
                <span>Gift to Community (Random Chatters)</span>
              </button>
              <button
                className={`gift-type-chip ${giftRecipientType === 'specific' ? 'active' : ''}`}
                onClick={() => setGiftRecipientType('specific')}
              >
                <Shield size={14} />
                <span>Gift to a Specific Reader</span>
              </button>
            </div>

            {giftRecipientType === 'specific' && (
              <div className="specific-gift-input-row">
                <input
                  type="text"
                  placeholder="Enter reader username (e.g. NovelEnthusiast)"
                  value={specificUsername}
                  onChange={e => setSpecificUsername(e.target.value)}
                  className="gift-user-input"
                />
              </div>
            )}

            {/* Quick Gift Packages */}
            <div className="gift-packages-grid">
              {GIFT_PACKAGES.map(pkg => {
                const isSelected = selectedGiftPkg.count === pkg.count;

                return (
                  <div
                    key={pkg.count}
                    className={`gift-pkg-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      soundFX.playPop();
                      setSelectedGiftPkg(pkg);
                    }}
                  >
                    {pkg.discountBadge && (
                      <span className="gift-pkg-badge">{pkg.discountBadge}</span>
                    )}
                    <div className="gift-count-big">
                      <Gift size={20} color="var(--accent-secondary)" />
                      <span>{pkg.count}</span>
                    </div>
                    <span className="gift-pkg-label">{pkg.label}</span>
                    <strong className="gift-pkg-price">${pkg.totalPrice.toFixed(2)}</strong>
                  </div>
                );
              })}
            </div>

            {/* Custom Gift Input */}
            <div className="custom-gift-row">
              <label>Or enter custom gift quantity:</label>
              <div className="custom-qty-wrapper">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={customGiftCount}
                  onChange={e => {
                    const val = parseInt(e.target.value) || 1;
                    setCustomGiftCount(val);
                    setSelectedGiftPkg({
                      count: val,
                      label: `Gift ${val} Subs`,
                      totalPrice: parseFloat((val * 4.99).toFixed(2))
                    });
                  }}
                  className="custom-qty-input"
                />
                <span className="custom-qty-cost">
                  = ${(customGiftCount * 4.99).toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* Gift Checkout Action */}
            <div className="sub-modal-footer">
              <div className="sub-footer-summary">
                <span>Instantly distributed to active chatters</span>
                <strong>{selectedGiftPkg.count} Tier 1 Subs (${selectedGiftPkg.totalPrice.toFixed(2)})</strong>
              </div>

              <button
                className="btn-primary btn-gift-action"
                onClick={handleGiftSubs}
                disabled={isProcessing}
              >
                <Gift size={18} />
                <span>{isProcessing ? 'Gifting...' : `Gift ${selectedGiftPkg.count} Sub${selectedGiftPkg.count > 1 ? 's' : ''} ($${selectedGiftPkg.totalPrice.toFixed(2)})`}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
