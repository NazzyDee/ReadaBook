import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Home, Castle, Plus } from 'lucide-react';
import { DEFAULT_GUILD_FURNITURE, type GuildFurnitureItem } from '../lib/guildHouseArchitectData';
import { soundFX } from '../lib/soundFx';

interface GuildHouseArchitectModalProps {
  streamerName: string;
  onClose: () => void;
}

export const GuildHouseArchitectModal: React.FC<GuildHouseArchitectModalProps> = ({
  streamerName,
  onClose
}) => {
  const [items, setItems] = useState<GuildFurnitureItem[]>(DEFAULT_GUILD_FURNITURE);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handlePurchaseFurniture = (item: GuildFurnitureItem) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, isUnlocked: true } : i));
    setToastMsg(`🏰 Unlocked and placed "${item.itemName}" in the 3D Guild Hall (+${item.prestigeBoost} Guild Prestige)!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const totalPrestige = items.filter(i => i.isUnlocked).reduce((acc, i) => acc + i.prestigeBoost, 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="guild-architect-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="guild-architect-modal-header">
          <div className="guild-architect-title-group">
            <div className="guild-architect-badge">
              <Castle size={16} />
              <span>GUILD HOUSE ARCHITECT (3D VIRTUAL LIBRARY DECORATOR)</span>
            </div>
            <h3>@{streamerName}'s Shared Guild Sanctum</h3>
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
        <div className="guild-architect-hero-banner">
          <div className="castle-dial-box">
            <Castle size={44} color="#ffd700" />
            <span className="prestige-score-num">{totalPrestige.toLocaleString()}</span>
            <span className="prestige-sub-label">GUILD PRESTIGE</span>
          </div>

          <div className="guild-architect-hero-meta">
            <h4>Collaborative 3D Guild House Decorator</h4>
            <p className="guild-architect-explainer">
              Pool Sparks with your book guild to buy medieval furniture, stained-glass windows, illuminated parchment desks, and floating candles.
            </p>
          </div>
        </div>

        {/* Furniture Catalog */}
        <div className="furniture-catalog-list">
          <h4>Guild Hall Decor Catalog</h4>
          {items.map(item => (
            <div key={item.id} className="furniture-card">
              <div className="furn-left">
                <Home size={22} color={item.isUnlocked ? '#00ff88' : 'var(--text-muted)'} />
                <div className="furn-info">
                  <span className="category-pill">{item.category.replace(/_/g, ' ')}</span>
                  <strong>{item.itemName}</strong>
                  <span className="furn-sub">+{item.prestigeBoost} Prestige • {item.sparkCost.toLocaleString()} Sparks</span>
                </div>
              </div>

              <div className="furn-right">
                {item.isUnlocked ? (
                  <span className="placed-pill">
                    <CheckCircle2 size={12} />
                    <span>PLACED IN 3D ROOM</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="btn-buy-furn"
                    onClick={() => handlePurchaseFurniture(item)}
                  >
                    <Plus size={14} />
                    <span>Unlock ({item.sparkCost} Sparks)</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="guild-architect-modal-footer">
          <span className="footer-guild-note">
            🏰 3D Sanctum viewable by all guild members in VR / WebGL mode!
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
