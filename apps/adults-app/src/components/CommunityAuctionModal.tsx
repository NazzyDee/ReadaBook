import React, { useState } from 'react';
import { X, Gavel, Sparkles, Clock, Flame, Award } from 'lucide-react';
import { ACTIVE_COMMUNITY_AUCTION, type AuctionItem } from '../lib/communityAuctionData';
import { soundFX } from '../lib/soundFx';

interface CommunityAuctionModalProps {
  streamerName: string;
  onClose: () => void;
}

export const CommunityAuctionModal: React.FC<CommunityAuctionModalProps> = ({
  streamerName,
  onClose
}) => {
  const [auction, setAuction] = useState<AuctionItem>(ACTIVE_COMMUNITY_AUCTION);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handlePlaceBid = (increment: number) => {
    soundFX.playPop();
    soundFX.playChestClaim();

    const newBid = auction.currentBidSparks + increment;
    setAuction(prev => ({
      ...prev,
      currentBidSparks: newBid,
      highestBidder: 'You (Winning)',
      bidCount: prev.bidCount + 1,
      secondsRemaining: Math.max(prev.secondsRemaining, 20) // Anti-snipe 20s extension
    }));

    setToastMsg(`🔨 Bid Placed! You are now the Highest Bidder at ${newBid.toLocaleString()} Sparks! (Anti-Snipe +20s added)`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleGavelStrike = () => {
    soundFX.playChestClaim();
    soundFX.playApplause();
    setToastMsg(`🏆 GAVEL STRIKE: "GOING ONCE... GOING TWICE... SOLD to ${auction.highestBidder} for ${auction.currentBidSparks.toLocaleString()} Sparks!"`);
    setTimeout(() => setToastMsg(null), 4500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="auction-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="auction-modal-header">
          <div className="auction-title-group">
            <div className="auction-badge">
              <Gavel size={16} />
              <span>LIVE RARE GRIMOIRE & SIGNED BOOK AUCTION</span>
            </div>
            <h3>@{streamerName}'s Community Auction Gauntlet</h3>
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

        {/* Auction Item Hero Card */}
        <div className="auction-hero-grid">
          <div className="auction-item-image-wrap">
            <img src={auction.imageUrl} alt={auction.title} />
            {auction.isSignedEdition && (
              <span className="signed-edition-badge">✨ SIGNED BY NARRATOR</span>
            )}
          </div>

          <div className="auction-item-details">
            <div className="auction-timer-row">
              <div className="auction-clock">
                <Clock size={16} color="#ff3b3b" />
                <strong>{auction.secondsRemaining}s Remaining</strong>
              </div>
              <span className="bids-counter">🔥 {auction.bidCount} Bids Placed</span>
            </div>

            <h4>{auction.title}</h4>
            <p className="edition-subtitle">{auction.authorOrEdition}</p>
            <p className="item-desc">{auction.description}</p>

            {/* Current High Bid Box */}
            <div className="current-bid-box">
              <div className="bid-label-col">
                <span>CURRENT HIGHEST BID:</span>
                <strong>{auction.currentBidSparks.toLocaleString()} Sparks</strong>
              </div>

              <div className="highest-bidder-pill">
                <img src={auction.highestBidderAvatar} alt="Bidder" />
                <span>@{auction.highestBidder}</span>
              </div>
            </div>

            {/* Quick Bid Increments */}
            <div className="bid-actions-row">
              <span className="bid-cta-label">QUICK BID:</span>
              <div className="bid-buttons-group">
                {[500, 1000, 2500, 5000].map(inc => (
                  <button
                    key={inc}
                    type="button"
                    className="btn-place-bid"
                    onClick={() => handlePlaceBid(inc)}
                  >
                    <Flame size={14} color="#ffd700" />
                    <span>+ {inc.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Broadcaster Gavel Controls Bar */}
        <div className="auction-broadcaster-bar">
          <div className="gavel-info">
            <Award size={16} color="#ffd700" />
            <span>Broadcaster Controls: Hammer Final Sale</span>
          </div>

          <button
            type="button"
            className="btn-gavel-strike"
            onClick={handleGavelStrike}
          >
            <Gavel size={15} />
            <span>Strike Gavel (Hammer SOLD)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
