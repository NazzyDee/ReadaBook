import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  CheckCircle2,
  Trash2,
  CreditCard,
  Coins
} from 'lucide-react';
import { MERCH_CATALOG, type MerchItem } from '../lib/merchData';
import { soundFX } from '../lib/soundFx';

interface GrandBazaarModalProps {
  onClose: () => void;
}

export const GrandBazaarModal: React.FC<GrandBazaarModalProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<{ item: MerchItem; quantity: number }[]>([
    { item: MERCH_CATALOG[0], quantity: 1 }
  ]);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isOrdered, setIsOrdered] = useState(false);

  const filteredItems = selectedCategory === 'all'
    ? MERCH_CATALOG
    : MERCH_CATALOG.filter(i => i.category === selectedCategory);

  const handleAddToCart = (item: MerchItem) => {
    soundFX.playPop();
    const existing = cart.find(c => c.item.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    soundFX.playPop();
    setCart(cart.filter(c => c.item.id !== itemId));
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'READA10' || promoCode.trim().toUpperCase() === 'BOOKWORM') {
      soundFX.playChestClaim();
      setDiscountPercent(15);
    } else {
      soundFX.playPop();
      alert('Invalid promo code. Try "READA10" for 15% off!');
    }
  };

  const handleCheckout = () => {
    soundFX.playApplause();
    setIsOrdered(true);
  };

  const subtotal = cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0);
  const discount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discount);

  return (
    <div className="modal-backdrop">
      <div className="bazaar-modal-card">
        {/* Header */}
        <div className="bazaar-modal-header">
          <div className="bazaar-title-group">
            <ShoppingBag size={24} color="#ffd700" className="pulse-fast" />
            <div>
              <h3>🛍️ The Grand Literary Bazaar & Swag Shop</h3>
              <span className="modal-subtitle">Official Broadcaster Merch, Signed Bookplates & Bookish Goods</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {isOrdered ? (
          <div className="bazaar-success-card">
            <CheckCircle2 size={48} color="#00ff88" className="pulse-fast" />
            <h3>Order Confirmed! 📦✨</h3>
            <p>Thank you for supporting literary broadcasters! Your physical tracking number has been sent to your email.</p>
            <button type="button" onClick={onClose} className="btn-primary">
              Return to Stream
            </button>
          </div>
        ) : (
          <div className="bazaar-body-layout">
            {/* Left: Merch Catalog */}
            <div className="bazaar-catalog-col">
              {/* Category Filter Pills */}
              <div className="bazaar-cats-row">
                {[
                  { id: 'all', label: 'All Swag' },
                  { id: 'bookmarks', label: '🔖 Bookmarks' },
                  { id: 'candles', label: '🕯️ Candles' },
                  { id: 'apparel', label: '👕 Apparel' },
                  { id: 'bookplates', label: '✍️ Bookplates' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      soundFX.playPop();
                      setSelectedCategory(cat.id);
                    }}
                    className={`bazaar-cat-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Products Grid */}
              <div className="bazaar-items-grid">
                {filteredItems.map(item => (
                  <div key={item.id} className="bazaar-item-card">
                    <div className="item-thumb-box">
                      <img src={item.imageUrl} alt="" className="item-thumb" />
                      {item.badge && <span className="item-badge-pill">{item.badge}</span>}
                    </div>

                    <div className="item-details">
                      <strong className="item-title">{item.title}</strong>
                      <p className="item-desc">{item.description}</p>

                      <div className="item-pricing-row">
                        <span className="price-usd">${item.price.toFixed(2)}</span>
                        <span className="price-tokens">
                          <Coins size={12} color="#ffd700" /> {item.tokensPrice.toLocaleString()} Tokens
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="btn-add-cart"
                      >
                        + Add to Bag
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Cart Summary */}
            <div className="bazaar-cart-col">
              <h4 className="cart-heading">🛒 Your Literary Bag ({cart.reduce((s, c) => s + c.quantity, 0)})</h4>

              {cart.length === 0 ? (
                <div className="empty-cart-box">
                  <p>Your bag is empty. Explore the artisan collection!</p>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cart.map(c => (
                    <div key={c.item.id} className="cart-item-row">
                      <img src={c.item.imageUrl} alt="" className="cart-item-img" />
                      <div className="cart-item-info">
                        <strong className="cart-item-name">{c.item.title}</strong>
                        <span className="cart-item-qty">Qty: {c.quantity} × ${c.item.price.toFixed(2)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFromCart(c.item.id)}
                        className="btn-del-cart"
                        title="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  {/* Promo Code Input */}
                  <div className="promo-code-box">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value)}
                      placeholder="Promo (try READA10)"
                      className="promo-input"
                    />
                    <button type="button" onClick={handleApplyPromo} className="btn-apply-promo">
                      Apply
                    </button>
                  </div>

                  {/* Total Calculations */}
                  <div className="cart-totals-box">
                    <div className="total-row">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="total-row discount">
                        <span>Promo Discount ({discountPercent}%):</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="total-row final">
                      <strong>Total Due:</strong>
                      <strong>${total.toFixed(2)}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="btn-checkout-bazaar"
                  >
                    <CreditCard size={16} /> 1-Click Secure Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
