import React, { useState } from 'react';
import { X, ShoppingBag, Sparkles, CheckCircle2, Store } from 'lucide-react';
import { DEFAULT_INDIE_STORES, type PartnerIndieBookstore } from '../lib/indieBookshopData';
import { soundFX } from '../lib/soundFx';

interface IndieBookshopAffiliateModalProps {
  streamerName: string;
  onClose: () => void;
}

export const IndieBookshopAffiliateModal: React.FC<IndieBookshopAffiliateModalProps> = ({
  streamerName,
  onClose
}) => {
  const [stores, setStores] = useState<PartnerIndieBookstore[]>(DEFAULT_INDIE_STORES);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('store_powells');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSupportIndie = (store: PartnerIndieBookstore) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setStores(prev => prev.map(s => s.id === store.id ? {
      ...s,
      totalCopiesSold: s.totalCopiesSold + 1,
      affiliateCommissionEarnedUSD: s.affiliateCommissionEarnedUSD + (s.featuredBookPriceUSD * (s.commissionSplitPct / 100))
    } : s));
    setToastMsg(`📖 Ordered from "${store.storeName}"! $${(store.featuredBookPriceUSD * (store.commissionSplitPct / 100)).toFixed(2)} affiliate commission routed to streamer & local shop.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const currentStore = stores.find(s => s.id === selectedStoreId) || stores[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="indie-store-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="indie-store-modal-header">
          <div className="indie-store-title-group">
            <div className="indie-store-badge">
              <Store size={16} />
              <span>BOOKSHOP.ORG & LOCAL INDIE BOOKSTORE AFFILIATE SPLIT</span>
            </div>
            <h3>@{streamerName}'s Indie Bookseller Partner Hub</h3>
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

        {/* Indie Store Hero Banner */}
        <div className="indie-store-hero-banner">
          <div className="store-crest-box">
            <Store size={36} color="#00ff88" />
            <span className="store-split-tag">{currentStore.commissionSplitPct}% LOCAL SHOP SPLIT</span>
          </div>

          <div className="indie-store-hero-meta">
            <div className="store-location-row">
              <span className="city-pill">📍 {currentStore.cityCountry}</span>
              <span className="copies-sold-pill">📚 {currentStore.totalCopiesSold} Copies Dispatched</span>
            </div>

            <h4>{currentStore.storeName}</h4>
            <p className="featured-book-name">Featured Book: <strong>{currentStore.featuredBookTitle}</strong> (${currentStore.featuredBookPriceUSD.toFixed(2)} USD)</p>
            <span className="commission-total-sub">Total Streamer Earnings: ${currentStore.affiliateCommissionEarnedUSD.toLocaleString()} USD</span>

            <button
              type="button"
              className="btn-order-indie"
              onClick={() => handleSupportIndie(currentStore)}
            >
              <ShoppingBag size={16} />
              <span>Buy Physical Copy & Support {currentStore.storeName}</span>
            </button>
          </div>
        </div>

        {/* Stores Grid */}
        <div className="indie-stores-grid">
          {stores.map(s => (
            <div
              key={s.id}
              className={`indie-store-tile ${s.id === selectedStoreId ? 'selected' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setSelectedStoreId(s.id);
              }}
            >
              <div className="store-tile-top">
                <strong>{s.storeName}</strong>
                <span className="store-split-badge">{s.commissionSplitPct}% Rev</span>
              </div>
              <span className="store-location-sub">{s.cityCountry}</span>
              <span className="store-featured-sub">📖 {s.featuredBookTitle}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="indie-store-modal-footer">
          <span className="footer-indie-note">
            🏷️ 100% of non-streamer profit goes directly to independent physical brick-and-mortar bookshops.
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
