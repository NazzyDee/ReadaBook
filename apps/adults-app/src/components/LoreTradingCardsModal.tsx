import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Layers, Gem } from 'lucide-react';
import { DEFAULT_LORE_CARDS, type LoreCard } from '../lib/loreTradingCardsData';
import { soundFX } from '../lib/soundFx';

interface LoreTradingCardsModalProps {
  streamerName: string;
  onClose: () => void;
}

export const LoreTradingCardsModal: React.FC<LoreTradingCardsModalProps> = ({
  streamerName,
  onClose
}) => {
  const [cards] = useState<LoreCard[]>(DEFAULT_LORE_CARDS);
  const [selectedCardId, setSelectedCardId] = useState<string>('card_anduril');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleShowcaseCard = (card: LoreCard) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setSelectedCardId(card.id);
    setToastMsg(`🌟 Showcased "${card.name}" [${card.rarity.replace('_', ' ')}] on Live Broadcast Overlay!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const currentCard = cards.find(c => c.id === selectedCardId) || cards[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="lore-cards-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="lore-cards-modal-header">
          <div className="lore-cards-title-group">
            <div className="lore-cards-badge">
              <Layers size={16} />
              <span>CHARACTER INVENTORY & LORE DECK TRADING CARDS (HOLO-FOIL)</span>
            </div>
            <h3>@{streamerName}'s Lore Trading Card Binder</h3>
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

        {/* Holo Card Showcase Banner */}
        <div className="holo-showcase-banner">
          <div className={`trading-card-3d ${currentCard.rarity.toLowerCase()}`}>
            <div className="card-holo-shine"></div>
            <img src={currentCard.cardImageUrl} alt={currentCard.name} className="card-art-img" />
            <div className="card-banner-bottom">
              <span className="card-rarity-pill">{currentCard.rarity}</span>
              <strong>{currentCard.name}</strong>
              <p className="card-quote-sub">{currentCard.loreQuote}</p>
              <div className="card-power-badge">⚡ PWR {currentCard.attackPower}</div>
            </div>
          </div>

          <div className="holo-showcase-meta">
            <div className="binder-stat-row">
              <Gem size={14} color="#ffd700" />
              <span>Unlocked via Reading Chapter Drops & Sparks Chests</span>
            </div>
            <h4>{currentCard.name}</h4>
            <p>
              Trading cards drop to viewers during climactic chapter boss raids and character deaths. Cards can be upgraded to Holographic Foil using Sparks.
            </p>
            <div className="copies-owned-pill">
              <span>Copies in your Vault: <strong>{currentCard.copiesOwned}</strong></span>
            </div>

            <button
              type="button"
              className="btn-showcase-card"
              onClick={() => handleShowcaseCard(currentCard)}
            >
              <Sparkles size={16} />
              <span>Showcase Card to Stream Overlay</span>
            </button>
          </div>
        </div>

        {/* Cards Binder Grid */}
        <div className="lore-cards-binder-grid">
          {cards.map(c => {
            const isSelected = c.id === selectedCardId;
            return (
              <div
                key={c.id}
                className={`binder-card-thumb ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  soundFX.playPop();
                  setSelectedCardId(c.id);
                }}
              >
                <img src={c.cardImageUrl} alt={c.name} />
                <div className="thumb-info-bar">
                  <strong>{c.name}</strong>
                  <span className="thumb-rarity">{c.rarity.split('_')[0]}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="lore-cards-modal-footer">
          <span className="footer-binder-note">
            🃏 Peer-to-peer card trading enabled in subscriber book club salons.
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
