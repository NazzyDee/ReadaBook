import React, { useState } from 'react';
import {
  ShoppingBag,
  Star,
  Bookmark,
  CheckCircle2,
  Store,
  Sparkles
} from 'lucide-react';
import { type Book } from '../lib/booksData';
import { soundFX } from '../lib/soundFx';

interface BookCommercePanelProps {
  book: Book;
  streamerName: string;
  onSendChatMessage?: (msg: string) => void;
}

export const BookCommercePanel: React.FC<BookCommercePanelProps> = ({
  book,
  streamerName,
  onSendChatMessage
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'hardcover' | 'paperback' | 'ebook' | 'audio'>('hardcover');
  const [isSavedShelf, setIsSavedShelf] = useState(false);
  const [shelfType] = useState<'goodreads' | 'storygraph'>('storygraph');
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  const formatPrices = {
    hardcover: { label: 'Hardcover Collector Edition', price: '$26.99', desc: 'Embossed foil & ribbon bookmark' },
    paperback: { label: 'Trade Paperback', price: '$15.99', desc: 'Premium acid-free paper' },
    ebook: { label: 'Kindle / E-Pub Edition', price: '$9.99', desc: 'Instant wireless delivery' },
    audio: { label: 'Audible / ReadaBook Master', price: '$18.99', desc: 'Full multi-voice narration' }
  };

  const handleToggleShelf = () => {
    soundFX.playChestClaim();
    setIsSavedShelf(!isSavedShelf);
    if (!isSavedShelf && onSendChatMessage) {
      onSendChatMessage(`📚 Added "${book.title}" to my ${shelfType === 'storygraph' ? 'The StoryGraph' : 'Goodreads'} Want-to-Read shelf!`);
    }
  };

  const handleBuy = (storeName: string) => {
    soundFX.playChestClaim();
    const currentPrice = formatPrices[selectedFormat].price;
    setPurchaseSuccess(`Purchased ${formatPrices[selectedFormat].label} via ${storeName} for ${currentPrice}! 10% commission credited to @${streamerName}.`);
    if (onSendChatMessage) {
      onSendChatMessage(`🛍️ Just bought "${book.title}" (${formatPrices[selectedFormat].label}) supporting @${streamerName}! 💖`);
    }
  };

  return (
    <div className="book-commerce-panel-card">
      {purchaseSuccess && (
        <div className="purchase-success-banner">
          <CheckCircle2 size={18} color="#00ff88" className="pulse-fast" />
          <div className="success-text">
            <strong>Order Placed Successfully! 🎉</strong>
            <p>{purchaseSuccess}</p>
          </div>
          <button onClick={() => setPurchaseSuccess(null)} className="btn-close-banner">
            ✕
          </button>
        </div>
      )}

      <div className="book-commerce-main-layout">
        {/* Book Cover */}
        <div className="commerce-cover-wrapper">
          <img src={book.coverUrl} alt={book.title} className="commerce-book-cover" />
          <div className="creator-support-badge">
            <Sparkles size={12} color="#ffd700" />
            <span>Supports @{streamerName} (10%)</span>
          </div>
        </div>

        {/* Details & Metadata */}
        <div className="commerce-details-col">
          <div className="commerce-header-row">
            <div>
              <h3 className="commerce-book-title">{book.title}</h3>
              <span className="commerce-book-author">by {book.author} • {book.genre}</span>
            </div>
            <div className="commerce-rating-pill">
              <Star size={14} fill="#ffd700" color="#ffd700" />
              <strong>4.8</strong>
              <span className="rating-count">(2.4M ratings)</span>
            </div>
          </div>

          <p className="commerce-synopsis">{book.description}</p>

          {/* Edition Formats Selector */}
          <div className="edition-formats-selector">
            <label className="section-label">Choose Edition Format:</label>
            <div className="formats-buttons-grid">
              {(['hardcover', 'paperback', 'ebook', 'audio'] as const).map(fmt => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => {
                    soundFX.playPop();
                    setSelectedFormat(fmt);
                  }}
                  className={`btn-format-card ${selectedFormat === fmt ? 'active' : ''}`}
                >
                  <div className="fmt-top">
                    <strong>{fmt.toUpperCase()}</strong>
                    <span className="fmt-price">{formatPrices[fmt].price}</span>
                  </div>
                  <span className="fmt-desc">{formatPrices[fmt].desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Row: 1-Click Purchase & Shelf Sync */}
          <div className="commerce-actions-row">
            {/* Buy Local / Bookshop.org */}
            <button
              type="button"
              onClick={() => handleBuy('Bookshop.org (Indie Books)')}
              className="btn-buy-indie"
              title="Support local independent bookshops + broadcaster"
            >
              <Store size={16} />
              <div>
                <strong>Buy Indie (Bookshop.org)</strong>
                <span>{formatPrices[selectedFormat].price} • Ships in 2 days</span>
              </div>
            </button>

            {/* Buy Kindle / Amazon */}
            <button
              type="button"
              onClick={() => handleBuy('Amazon / Kindle')}
              className="btn-buy-amazon"
              title="1-Click Kindle Instant Delivery"
            >
              <ShoppingBag size={16} />
              <div>
                <strong>Amazon / Kindle</strong>
                <span>1-Click Instant Delivery</span>
              </div>
            </button>

            {/* Want-to-Read Shelf Sync */}
            <button
              type="button"
              onClick={handleToggleShelf}
              className={`btn-shelf-sync ${isSavedShelf ? 'saved' : ''}`}
              title="Add to Want-to-Read Shelf"
            >
              <Bookmark size={16} fill={isSavedShelf ? '#ffd700' : 'none'} color={isSavedShelf ? '#ffd700' : 'currentColor'} />
              <span>{isSavedShelf ? 'On Want-to-Read' : 'Add to Shelf'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
