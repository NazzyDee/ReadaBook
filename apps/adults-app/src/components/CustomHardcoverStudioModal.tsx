import React, { useState } from 'react';
import { X, Book, Sparkles, CheckCircle2, ShoppingBag } from 'lucide-react';
import { DEFAULT_HARDCOVER_CONFIG, type HardcoverCustomization } from '../lib/customHardcoverStudioData';
import { soundFX } from '../lib/soundFx';

interface CustomHardcoverStudioModalProps {
  streamerName: string;
  onClose: () => void;
}

export const CustomHardcoverStudioModal: React.FC<CustomHardcoverStudioModalProps> = ({
  streamerName,
  onClose
}) => {
  const [config, setConfig] = useState<HardcoverCustomization>(DEFAULT_HARDCOVER_CONFIG);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleOrderCustomHardcover = () => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setToastMsg(`📖 Ordered custom artisan edition with ${config.foilColor.replace(/_/g, ' ')} foil & ${config.coverMaterial.replace(/_/g, ' ')}! Proof sent to bindery.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="hardcover-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="hardcover-modal-header">
          <div className="hardcover-title-group">
            <div className="hardcover-badge">
              <Book size={16} />
              <span>CUSTOM HARDCOVER SLIPCASE & FOIL PRINTING STUDIO</span>
            </div>
            <h3>@{streamerName}'s Custom Book Bindery Studio</h3>
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

        {/* 3D Book Preview Hero Banner */}
        <div className="hardcover-hero-banner">
          <div className="book-3d-render-stage">
            <div className={`book-cover-mockup ${config.coverMaterial.toLowerCase()}`}>
              <div className="book-spine"></div>
              <div className={`foil-title-emboss foil_${config.foilColor.toLowerCase()}`}>
                <strong>{config.customEmbossedTitle}</strong>
                <span className="author-sub">by @{streamerName}</span>
              </div>
              <div className={`ribbon-bookmark ${config.ribbonColor.toLowerCase()}`}></div>
              <div className={`sprayed-edges ${config.sprayedEdgePattern.toLowerCase()}`}></div>
            </div>
            <span className="price-tag-est">${config.estimatedPriceUSD.toFixed(2)} USD</span>
          </div>

          {/* Config Controls */}
          <div className="hardcover-controls-meta">
            <h4>Bindery Customization Options</h4>

            <div className="form-group">
              <label>Embossed Title Text</label>
              <input
                type="text"
                value={config.customEmbossedTitle}
                onChange={e => setConfig({ ...config, customEmbossedTitle: e.target.value })}
                className="input-custom-title"
              />
            </div>

            <div className="options-selectors-grid">
              <div className="select-box">
                <label>Cover Material</label>
                <select
                  value={config.coverMaterial}
                  onChange={e => setConfig({ ...config, coverMaterial: e.target.value as any })}
                >
                  <option value="MIDNIGHT_ITALIAN_LEATHER">Midnight Italian Leather</option>
                  <option value="EMERALD_BUCKRAM_CLOTH">Emerald Buckram Cloth</option>
                  <option value="ROYAL_PURPLE_VELVET">Royal Purple Velvet</option>
                </select>
              </div>

              <div className="select-box">
                <label>Foil Stamping</label>
                <select
                  value={config.foilColor}
                  onChange={e => setConfig({ ...config, foilColor: e.target.value as any })}
                >
                  <option value="24K_GOLD">24K Gold Leaf</option>
                  <option value="HOLOGRAPHIC_SILVER">Holographic Silver</option>
                  <option value="ROSE_COPPER">Rose Copper Metallic</option>
                </select>
              </div>

              <div className="select-box">
                <label>Sprayed Edges</label>
                <select
                  value={config.sprayedEdgePattern}
                  onChange={e => setConfig({ ...config, sprayedEdgePattern: e.target.value as any })}
                >
                  <option value="DRAGON_SCALES">Dragon Scales Foil</option>
                  <option value="GALAXY_STARS">Starlit Galaxy Edge</option>
                  <option value="SOLID_BLACK_MATTE">Solid Matte Black</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              className="btn-order-hardcover"
              onClick={handleOrderCustomHardcover}
            >
              <ShoppingBag size={16} />
              <span>Order Artisan Print-on-Demand Edition (${config.estimatedPriceUSD.toFixed(2)})</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="hardcover-modal-footer">
          <span className="footer-bindery-note">
            📦 Printed on archival 80lb acid-free paper by boutique partner bookbinders.
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
