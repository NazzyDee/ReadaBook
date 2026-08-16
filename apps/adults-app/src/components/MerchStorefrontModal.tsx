import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Sparkles, Package, CreditCard } from 'lucide-react';
import { MOCK_MERCH_ITEMS, type MerchItem } from '../lib/merchData';
import { soundFX } from '../lib/soundFx';

interface MerchStorefrontModalProps {
  streamerName: string;
  onClose: () => void;
}

export const MerchStorefrontModal: React.FC<MerchStorefrontModalProps> = ({
  streamerName,
  onClose
}) => {
  const [items] = useState<MerchItem[]>(MOCK_MERCH_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<{ item: MerchItem; quantity: number }[]>([]);
  const [checkoutToast, setCheckoutToast] = useState<string | null>(null);

  const handleAddToCart = (item: MerchItem) => {
    soundFX.playPop();
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => (i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleCheckout = () => {
    soundFX.playChestClaim();
    soundFX.playApplause();
    setCheckoutToast(`🛍️ Order Placed! Thank you for supporting @${streamerName}’s official channel store.`);
    setCart([]);
    setTimeout(() => setCheckoutToast(null), 4000);
  };

  const filteredItems = items.filter(
    i => selectedCategory === 'All' || i.category === selectedCategory
  );

  const cartTotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="merch-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="merch-modal-header">
          <div className="merch-title-group">
            <div className="merch-badge">
              <ShoppingBag size={16} />
              <span>OFFICIAL CHANNEL MERCHANDISE & BOOK BOX</span>
            </div>
            <h3>@{streamerName}'s Literary Merch Store</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {checkoutToast && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{checkoutToast}</span>
          </div>
        )}

        {/* Category Filters */}
        <div className="merch-category-chips">
          {['All', 'Bookmarks', 'Signed Editions', 'Ambience', 'Apparel'].map(cat => (
            <button
              key={cat}
              className={`merch-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setSelectedCategory(cat);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2-Column Layout: Catalog & Cart Sidebar */}
        <div className="merch-grid-layout">
          {/* Products Grid */}
          <div className="merch-items-grid">
            {filteredItems.map(item => (
              <div key={item.id} className="merch-item-card">
                <img src={item.imageUrl} alt={item.title} className="merch-thumb" />

                <div className="merch-item-info">
                  <div className="merch-cat-row">
                    <span className="merch-item-cat">{item.category}</span>
                    <span className="merch-stock-count">{item.stockCount} in stock</span>
                  </div>

                  <h4>{item.title}</h4>
                  <p className="merch-desc">{item.description}</p>

                  <div className="merch-buy-row">
                    <strong>${item.price.toFixed(2)} USD</strong>
                    <button
                      type="button"
                      className="btn-add-cart"
                      onClick={() => handleAddToCart(item)}
                    >
                      <Plus size={15} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Panel */}
          <div className="merch-cart-panel">
            <h4>
              <ShoppingBag size={16} />
              <span>Your Cart ({cart.reduce((a, c) => a + c.quantity, 0)})</span>
            </h4>

            {cart.length === 0 ? (
              <div className="cart-empty-state">
                <Package size={32} color="var(--text-muted)" />
                <p>Your cart is empty. Add literary items from the catalog!</p>
              </div>
            ) : (
              <div className="cart-items-list">
                {cart.map((c, idx) => (
                  <div key={idx} className="cart-item-row">
                    <div className="cart-item-meta">
                      <strong>{c.item.title}</strong>
                      <span>Qty: {c.quantity} × ${c.item.price.toFixed(2)}</span>
                    </div>
                    <span className="cart-item-subtotal">${(c.item.price * c.quantity).toFixed(2)}</span>
                  </div>
                ))}

                <div className="cart-total-box">
                  <div className="total-row">
                    <span>Total Amount:</span>
                    <strong>${cartTotal.toFixed(2)} USD</strong>
                  </div>

                  <button
                    type="button"
                    className="btn-primary btn-checkout-merch"
                    onClick={handleCheckout}
                  >
                    <CreditCard size={16} />
                    <span>Proceed to 1-Click Checkout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
