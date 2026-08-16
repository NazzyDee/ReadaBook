import React, { useState } from 'react';
import { X, ShoppingBag, Sparkles, CheckCircle2, DollarSign, Package } from 'lucide-react';
import { DEFAULT_MERCH_ITEMS, type MerchItem } from '../lib/printOnDemandData';
import { soundFX } from '../lib/soundFx';

interface PrintOnDemandMerchModalProps {
  streamerName: string;
  onClose: () => void;
}

export const PrintOnDemandMerchModal: React.FC<PrintOnDemandMerchModalProps> = ({
  streamerName,
  onClose
}) => {
  const [items] = useState<MerchItem[]>(DEFAULT_MERCH_ITEMS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleOrderTestSample = (item: MerchItem) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setToastMsg(`📦 Dispatched Printful / Fourthwall Sample Order for "${item.name}"!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="merch-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="merch-modal-header">
          <div className="merch-title-group">
            <div className="merch-badge">
              <ShoppingBag size={16} />
              <span>PRINT-ON-DEMAND MERCH HUB & IN-STREAM SHOP</span>
            </div>
            <h3>@{streamerName}'s Author & Narrator Merch Store</h3>
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

        {/* Sync Status Banner */}
        <div className="merch-hero-banner">
          <Package size={24} color="#00ff88" />
          <div className="merch-hero-info">
            <h4>Fourthwall & Printful Automatic Fulfillment</h4>
            <p>Orders placed live in stream chat are automatically produced, printed, and shipped globally with zero creator inventory risk.</p>
          </div>
        </div>

        {/* Merch Items Grid */}
        <div className="merch-items-grid">
          {items.map(item => (
            <div key={item.id} className="merch-product-tile">
              <img src={item.mockupUrl} alt={item.name} className="merch-thumb" />
              <div className="merch-tile-body">
                <span className="merch-category-tag">{item.category}</span>
                <strong>{item.name}</strong>
                <div className="merch-price-row">
                  <span className="price-tag">${item.priceUsd.toFixed(2)} USD</span>
                  <span className="sales-count">{item.salesCount} sold</span>
                </div>
                <button
                  type="button"
                  className="btn-sample-order"
                  onClick={() => handleOrderTestSample(item)}
                >
                  <DollarSign size={14} />
                  <span>Order Creator Sample</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="merch-modal-footer">
          <span className="merch-revenue-note">
            💎 100% of creator profit margin ($12-$20 per item) is deposited directly to your Connected Stripe account every Monday.
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
