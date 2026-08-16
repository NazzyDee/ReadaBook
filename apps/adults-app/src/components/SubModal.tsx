import React, { useState } from 'react';
import {
  X,
  Star,
  Gift,
  Check,
  Heart,
  Sparkles,
  Crown
} from 'lucide-react';
import { GiftSubRouletteModal } from './GiftSubRouletteModal';
import { soundFX } from '../lib/soundFx';

interface SubModalProps {
  streamerName: string;
  onSubscribe: (tier: number, isGift?: boolean, giftCount?: number) => void;
  onClose: () => void;
}

export const SubModal: React.FC<SubModalProps> = ({ streamerName, onSubscribe, onClose }) => {
  const [subMode, setSubMode] = useState<'self' | 'gift'>('self');
  const [selectedTier, setSelectedTier] = useState<number>(1);
  const [giftCount, setGiftCount] = useState<number>(5);
  const [customGiftCount, setCustomGiftCount] = useState<string>('');
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);
  const [showRouletteModal, setShowRouletteModal] = useState(false);
  const [primeTokenAvailable, setPrimeTokenAvailable] = useState(true);

  const handleSelfSub = (tier: number, isPrime = false) => {
    soundFX.playSubAlert();
    if (isPrime) setPrimeTokenAvailable(false);
    onSubscribe(tier, false);
    setSubscribedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2200);
  };

  const handleGiftSubClick = (count: number) => {
    const finalCount = count || parseInt(customGiftCount, 10) || 5;
    soundFX.playPop();
    if (finalCount >= 3) {
      setShowRouletteModal(true);
    } else {
      soundFX.playSubAlert();
      onSubscribe(1, true, finalCount);
      setSubscribedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2200);
    }
  };

  const handleCompleteRoulette = (_recipients: string[]) => {
    const finalCount = giftCount || parseInt(customGiftCount, 10) || 5;
    soundFX.playCheer();
    onSubscribe(1, true, finalCount);
    setShowRouletteModal(false);
    setSubscribedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2200);
  };

  const tiers = [
    {
      tier: 1,
      title: 'Tier 1: Bookworm',
      price: '$4.99 / mo',
      badge: '📗 1-Month Crest',
      perks: [
        'Ad-free reading broadcasts',
        '18 exclusive custom channel emotes',
        'Custom Book Crest chat badge',
        'Monthly Book Club meeting access'
      ]
    },
    {
      tier: 2,
      title: 'Tier 2: Lorekeeper',
      price: '$9.99 / mo',
      badge: '📘 2-Month Guild Badge',
      perks: [
        'All Tier 1 perks included',
        '6 additional animated emotes (NovelHype, PlotTwist)',
        '2x multiplier on Channel Points accumulation',
        'Monthly Book Giveaway entries'
      ]
    },
    {
      tier: 3,
      title: 'Tier 3: Arch-Mage Scribe',
      price: '$24.99 / mo',
      badge: '👑 Golden Crown Crest',
      perks: [
        'All Tier 1 & 2 perks included',
        'Direct voice question during author Q&A sessions',
        'Exclusive VIP badge in chat',
        'Personal signed bookplate from streamer'
      ]
    }
  ];

  return (
    <div className="modal-backdrop">
      <div className="sub-modal-card">
        <div className="modal-header">
          <div className="modal-title-row">
            <Star size={20} color="var(--accent-primary)" fill="var(--accent-primary)" />
            <h3>Subscribe to {streamerName}</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {subscribedSuccess ? (
          <div className="sub-success-animation">
            <div className="success-sparkles">
              <Sparkles size={48} color="#ffd700" />
            </div>
            <h2>Welcome to the Reader Family!</h2>
            <p>Thank you for supporting <strong>{streamerName}</strong>!</p>
          </div>
        ) : (
          <>
            {/* Mode Switcher */}
            <div className="sub-modal-tabs">
              <button
                className={`sub-tab-btn ${subMode === 'self' ? 'active' : ''}`}
                onClick={() => setSubMode('self')}
              >
                <Heart size={16} />
                <span>Subscribe</span>
              </button>
              <button
                className={`sub-tab-btn ${subMode === 'gift' ? 'active' : ''}`}
                onClick={() => setSubMode('gift')}
              >
                <Gift size={16} />
                <span>Gift Community Subs</span>
              </button>
            </div>

            {subMode === 'self' ? (
              <div className="sub-tiers-container">
                {/* Bookworm Prime Free Monthly Option */}
                <div className="prime-sub-banner">
                  <div className="prime-sub-left">
                    <Crown size={22} color="#00e5ff" />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h4>Use Free Monthly "Bookworm Prime" Sub</h4>
                        {primeTokenAvailable ? (
                          <span className="prime-token-chip available">Token Available</span>
                        ) : (
                          <span className="prime-token-chip used">Renews in 18d</span>
                        )}
                      </div>
                      <p>Included free with your Amazon / Bookworm Prime membership</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelfSub(1, true)}
                    disabled={!primeTokenAvailable}
                    className="btn-prime-sub"
                  >
                    {primeTokenAvailable ? 'Use Free Sub' : 'Used this month'}
                  </button>
                </div>

                <div className="sub-tiers-list">
                  {tiers.map(t => (
                    <div
                      key={t.tier}
                      className={`sub-tier-box ${selectedTier === t.tier ? 'selected' : ''}`}
                      onClick={() => setSelectedTier(t.tier)}
                    >
                      <div className="sub-tier-header">
                        <div>
                          <h4>{t.title}</h4>
                          <span className="sub-tier-badge">{t.badge}</span>
                        </div>
                        <span className="sub-tier-price">{t.price}</span>
                      </div>
                      <ul className="sub-tier-perks">
                        {t.perks.map((p, idx) => (
                          <li key={idx}>
                            <Check size={14} color="var(--accent-secondary)" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelfSub(t.tier);
                        }}
                        className="btn-primary sub-action-btn"
                      >
                        Subscribe for {t.price.split(' ')[0]}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="gift-sub-container">
                <p className="gift-sub-description">
                  Gift subscriptions to other readers in <strong>{streamerName}</strong>'s chat! Community members will randomly receive a 1-month Tier 1 subscription with a live Roulette Wheel spin.
                </p>

                <div className="gift-count-presets">
                  {[1, 5, 10, 20, 50].map(count => (
                    <button
                      key={count}
                      className={`gift-count-btn ${giftCount === count && !customGiftCount ? 'active' : ''}`}
                      onClick={() => {
                        setGiftCount(count);
                        setCustomGiftCount('');
                      }}
                    >
                      <Gift size={16} />
                      <span>Gift {count} {count === 1 ? 'Sub' : 'Subs'}</span>
                      <small>${(count * 4.99).toFixed(2)}</small>
                    </button>
                  ))}
                </div>

                <div className="custom-gift-row">
                  <span>Custom amount:</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="e.g. 25"
                    value={customGiftCount}
                    onChange={(e) => setCustomGiftCount(e.target.value)}
                    className="custom-gift-input"
                  />
                </div>

                <button
                  onClick={() => handleGiftSubClick(parseInt(customGiftCount, 10) || giftCount)}
                  className="btn-gift-submit"
                >
                  <Gift size={18} />
                  <span>
                    Spin Roulette & Gift {customGiftCount || giftCount} Subs ($
                    {(((parseInt(customGiftCount, 10) || giftCount)) * 4.99).toFixed(2)})
                  </span>
                </button>
              </div>
            )}
          </>
        )}

        {/* Roulette Wheel Modal */}
        {showRouletteModal && (
          <GiftSubRouletteModal
            streamerName={streamerName}
            giftCount={parseInt(customGiftCount, 10) || giftCount}
            onCompleteCelebration={handleCompleteRoulette}
            onClose={() => setShowRouletteModal(false)}
          />
        )}
      </div>
    </div>
  );
};
