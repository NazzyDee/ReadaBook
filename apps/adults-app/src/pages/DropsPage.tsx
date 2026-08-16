import React, { useState } from 'react';
import { Gift, Check, Clock, Award, Sparkles } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

interface DropCampaign {
  id: string;
  title: string;
  gameCategory: string;
  bannerUrl: string;
  requiredMinutes: number;
  progressMinutes: number;
  rewardName: string;
  rewardType: 'badge' | 'tokens' | 'emote';
  rewardIcon: string;
  rewardDescription: string;
  claimed: boolean;
  endsInDays: number;
}

export const DropsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'inventory'>('campaigns');
  const [campaigns, setCampaigns] = useState<DropCampaign[]>([
    {
      id: 'drop_lotr_badge',
      title: 'The Lord of the Rings: Read-A-Thon Drops',
      gameCategory: 'Fantasy',
      bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      requiredMinutes: 30,
      progressMinutes: 24,
      rewardName: 'Exclusive Rivendell Lorekeeper Badge 🧝',
      rewardType: 'badge',
      rewardIcon: '🧝',
      rewardDescription: 'Equip an exclusive chat badge showing you participated in the Rivendell Community Table Read.',
      claimed: false,
      endsInDays: 4
    },
    {
      id: 'drop_sparks_500',
      title: 'Classics Literature Sprint Drop',
      gameCategory: 'Classics',
      bannerUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      requiredMinutes: 60,
      progressMinutes: 60,
      rewardName: '500 Bonus Book Sparks ✨',
      rewardType: 'tokens',
      rewardIcon: '💎',
      rewardDescription: '500 Free Sparks to cheer for your favorite storytellers and support independent narrators.',
      claimed: false,
      endsInDays: 7
    },
    {
      id: 'drop_emote_coffee',
      title: 'Cozy Rain & Tea Study Drops',
      gameCategory: 'Silent Study & Lofi',
      bannerUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
      requiredMinutes: 15,
      progressMinutes: 15,
      rewardName: 'Animated "TeaTime" Emote ☕',
      rewardType: 'emote',
      rewardIcon: '☕',
      rewardDescription: 'Permanent access to use the animated steaming tea cup emote in any channel.',
      claimed: true,
      endsInDays: 12
    }
  ]);

  const [claimToast, setClaimToast] = useState<string | null>(null);

  const handleClaim = (dropId: string) => {
    soundFX.playChestClaim();
    setCampaigns(prev =>
      prev.map(c => (c.id === dropId ? { ...c, claimed: true } : c))
    );
    const drop = campaigns.find(c => c.id === dropId);
    setClaimToast(`Claimed "${drop?.rewardName}"! Added to your inventory.`);
    setTimeout(() => setClaimToast(null), 3000);
  };

  const claimedInventory = campaigns.filter(c => c.claimed);

  return (
    <div className="drops-page-container">
      {/* Hero Header */}
      <div className="drops-hero-header">
        <div className="drops-badge">
          <Gift size={16} />
          <span>TWITCH DROPS & REWARDS</span>
        </div>
        <h1>Book Drops & Community Loot</h1>
        <p>
          Earn exclusive chat badges, free Book Sparks, and animated emotes just by watching your favorite literature streams!
        </p>

        {/* Tab Navigation */}
        <div className="drops-tabs-row">
          <button
            className={`btn-drops-tab ${activeTab === 'campaigns' ? 'active' : ''}`}
            onClick={() => setActiveTab('campaigns')}
          >
            All Campaigns ({campaigns.length})
          </button>
          <button
            className={`btn-drops-tab ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            My Drops Inventory ({claimedInventory.length})
          </button>
        </div>
      </div>

      {claimToast && (
        <div className="drops-success-toast">
          <Sparkles size={16} color="#ffd700" />
          <span>{claimToast}</span>
        </div>
      )}

      {/* CAMPAIGNS TAB */}
      {activeTab === 'campaigns' && (
        <div className="drops-campaigns-list">
          {campaigns.map(camp => {
            const pct = Math.min(100, Math.round((camp.progressMinutes / camp.requiredMinutes) * 100));
            const isCompleted = pct >= 100;

            return (
              <div key={camp.id} className="drop-campaign-card">
                <img src={camp.bannerUrl} alt="" className="campaign-thumb" />

                <div className="campaign-details">
                  <div className="campaign-top">
                    <span className="campaign-category">{camp.gameCategory}</span>
                    <span className="campaign-timer">
                      <Clock size={12} /> Ends in {camp.endsInDays} days
                    </span>
                  </div>

                  <h3>{camp.title}</h3>
                  <p className="reward-info-text">
                    Reward: <strong>{camp.rewardName}</strong> — {camp.rewardDescription}
                  </p>

                  <div className="drop-progress-section">
                    <div className="drop-progress-header">
                      <span>Watch Progress: {camp.progressMinutes} / {camp.requiredMinutes} mins</span>
                      <span className="drop-pct-tag">{pct}%</span>
                    </div>

                    <div className="drop-progress-track">
                      <div className="drop-progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>

                <div className="campaign-action-col">
                  {camp.claimed ? (
                    <div className="claimed-badge">
                      <Check size={16} />
                      <span>Claimed</span>
                    </div>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaim(camp.id)}
                      className="btn-primary btn-claim-drop"
                    >
                      <Gift size={16} />
                      <span>Claim Reward</span>
                    </button>
                  ) : (
                    <span className="in-progress-label">
                      Watch {camp.requiredMinutes - camp.progressMinutes}m more to claim
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* INVENTORY TAB */}
      {activeTab === 'inventory' && (
        <div className="drops-inventory-grid">
          {claimedInventory.length === 0 ? (
            <div className="empty-inventory-state">
              <Award size={48} color="var(--text-muted)" />
              <h3>Your Drops Inventory is empty</h3>
              <p>Watch participating live channels to start unlocking exclusive book badges and sparks!</p>
            </div>
          ) : (
            claimedInventory.map(item => (
              <div key={item.id} className="inventory-reward-card">
                <div className="inventory-icon-disc">
                  <span>{item.rewardIcon}</span>
                </div>
                <div className="inventory-reward-info">
                  <h4>{item.rewardName}</h4>
                  <p>{item.rewardDescription}</p>
                  <span className="inventory-unlocked-tag">
                    <Check size={12} /> Unlocked & Active in Account
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
