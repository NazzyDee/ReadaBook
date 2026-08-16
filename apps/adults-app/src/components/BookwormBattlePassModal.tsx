import React, { useState } from 'react';
import {
  X,
  Award,
  Crown,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  Gift
} from 'lucide-react';
import {
  SAMPLE_PASS_TIERS,
  INITIAL_QUESTS,
  type BattlePassQuest
} from '../lib/battlePassData';
import { usePoints } from '../lib/PointsContext';
import { soundFX } from '../lib/soundFx';

interface BookwormBattlePassModalProps {
  onClose: () => void;
}

export const BookwormBattlePassModal: React.FC<BookwormBattlePassModalProps> = ({ onClose }) => {
  const [level, setLevel] = useState(4);
  const [xp, setXp] = useState(650);
  const [isPremium, setIsPremium] = useState(false);
  const [claimedTiers, setClaimedTiers] = useState<number[]>([1, 2, 3]);
  const [quests, setQuests] = useState<BattlePassQuest[]>(INITIAL_QUESTS);
  const [activeTab, setActiveTab] = useState<'pass' | 'quests'>('pass');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const { addPoints } = usePoints();
  const xpPerLevel = 1000;

  const handleClaimTier = (tierLevel: number) => {
    if (claimedTiers.includes(tierLevel) || tierLevel > level) return;
    soundFX.playChestClaim();
    setClaimedTiers([...claimedTiers, tierLevel]);
    addPoints(100);
    setToastMsg(`Claimed Level ${tierLevel} rewards (+100 Tokens & Badge)!`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleClaimAll = () => {
    soundFX.playChestClaim();
    const newClaimed = [...claimedTiers];
    for (let i = 1; i <= level; i++) {
      if (!newClaimed.includes(i)) newClaimed.push(i);
    }
    setClaimedTiers(newClaimed);
    addPoints(250);
    setToastMsg('Claimed all available tier rewards (+250 Tokens)!');
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleUpgradePremium = () => {
    soundFX.playChestClaim();
    setIsPremium(true);
    addPoints(500); // bonus starter tokens
    setToastMsg('Upgraded to Premium Odyssey Pass! All premium tracks unlocked! 🎉');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleClaimQuest = (questId: string, xpReward: number) => {
    soundFX.playChestClaim();
    setQuests(prev =>
      prev.map(q => (q.id === questId ? { ...q, isClaimed: true } : q))
    );

    // Add XP and level up if threshold reached
    const totalXp = xp + xpReward;
    if (totalXp >= xpPerLevel) {
      setLevel(l => l + 1);
      setXp(totalXp - xpPerLevel);
      setToastMsg(`Quest complete! +${xpReward} XP — LEVEL UP TO LEVEL ${level + 1}! 🎉`);
    } else {
      setXp(totalXp);
      setToastMsg(`Quest complete! +${xpReward} XP added to Odyssey Pass.`);
    }
    setTimeout(() => setToastMsg(null), 2500);
  };

  const xpPercent = Math.min(100, Math.round((xp / xpPerLevel) * 100));

  return (
    <div className="modal-backdrop">
      <div className="battlepass-modal-card">
        {/* Header */}
        <div className="battlepass-modal-header">
          <div className="pass-title-group">
            <Award size={24} color="#ffd700" />
            <div>
              <h3>🏆 Bookworm Odyssey Pass</h3>
              <span className="modal-subtitle">Season 4: The Fellowship Expedition • 50 Tiers of Literary Unlocks</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {toastMsg && (
          <div className="pass-toast-banner">
            <CheckCircle2 size={16} color="#00ff88" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Level Progression & Premium Status Hero Bar */}
        <div className="pass-hero-banner">
          {/* Level Progress */}
          <div className="pass-level-box">
            <div className="level-badge-circle">
              <span>{level}</span>
            </div>
            <div className="level-progress-info">
              <div className="level-text-row">
                <strong>Odyssey Level {level}</strong>
                <span>{xp} / {xpPerLevel} XP</span>
              </div>
              <div className="pass-xp-track">
                <div className="pass-xp-fill" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Premium Upgrade Button / Badge */}
          <div className="pass-upgrade-box">
            {!isPremium ? (
              <button
                type="button"
                onClick={handleUpgradePremium}
                className="btn-unlock-premium"
              >
                <Crown size={16} color="#000" />
                <span>Unlock Premium Pass (950 🪙)</span>
              </button>
            ) : (
              <div className="premium-active-badge">
                <Crown size={16} color="#ffd700" />
                <span>PREMIUM PASS ACTIVATED</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="pass-nav-tabs">
          <button
            type="button"
            onClick={() => {
              soundFX.playPop();
              setActiveTab('pass');
            }}
            className={`pass-tab-btn ${activeTab === 'pass' ? 'active' : ''}`}
          >
            <Award size={14} />
            <span>50-Tier Reward Track</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playPop();
              setActiveTab('quests');
            }}
            className={`pass-tab-btn ${activeTab === 'quests' ? 'active' : ''}`}
          >
            <Zap size={14} />
            <span>Quests & Literary Challenges ({quests.filter(q => q.currentProgress >= q.maxProgress && !q.isClaimed).length} Ready)</span>
          </button>

          {activeTab === 'pass' && (
            <button
              type="button"
              onClick={handleClaimAll}
              className="btn-claim-all-tiers"
            >
              <Gift size={14} />
              <span>Claim Ready Rewards</span>
            </button>
          )}
        </div>

        {/* TAB 1: 50-TIER REWARD TRACK */}
        {activeTab === 'pass' && (
          <div className="pass-tiers-scroll-container">
            <div className="pass-tiers-grid">
              {SAMPLE_PASS_TIERS.map(tier => {
                const isUnlocked = level >= tier.level;
                const isClaimed = claimedTiers.includes(tier.level);

                return (
                  <div
                    key={tier.level}
                    className={`pass-tier-card ${isUnlocked ? 'unlocked' : 'locked'} ${isClaimed ? 'claimed' : ''}`}
                  >
                    {/* Tier Level Header */}
                    <div className="tier-header">
                      <span className="tier-num">Tier {tier.level}</span>
                      {isClaimed ? (
                        <span className="tier-status-claimed">✓ Claimed</span>
                      ) : isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => handleClaimTier(tier.level)}
                          className="btn-claim-tier-sm"
                        >
                          Claim
                        </button>
                      ) : (
                        <Lock size={12} color="var(--text-muted)" />
                      )}
                    </div>

                    {/* Free Reward */}
                    <div className="tier-track-item free-track">
                      <span className="track-tag">FREE</span>
                      <span className="reward-icon">{tier.freeReward.icon}</span>
                      <strong className="reward-name">{tier.freeReward.name}</strong>
                      <span className="reward-val">{tier.freeReward.value}</span>
                    </div>

                    {/* Premium Reward */}
                    <div className={`tier-track-item premium-track ${isPremium ? 'premium-unlocked' : 'premium-locked'}`}>
                      <span className="track-tag gold">
                        <Crown size={10} /> PREMIUM
                      </span>
                      <span className="reward-icon">{tier.premiumReward.icon}</span>
                      <strong className="reward-name">{tier.premiumReward.name}</strong>
                      <span className="reward-val">{tier.premiumReward.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE QUESTS & CHALLENGES */}
        {activeTab === 'quests' && (
          <div className="pass-quests-container">
            <div className="quests-intro">
              <h4>Daily & Weekly Literary Quests</h4>
              <p>Complete community focus sprints, stream listening marathons, and trivia battles to earn XP and level up your Odyssey Pass.</p>
            </div>

            <div className="quests-list">
              {quests.map(q => {
                const isReady = q.currentProgress >= q.maxProgress;
                const percent = Math.min(100, Math.round((q.currentProgress / q.maxProgress) * 100));

                return (
                  <div key={q.id} className={`quest-item-card ${isReady ? 'ready' : ''} ${q.isClaimed ? 'claimed' : ''}`}>
                    <div className="quest-left">
                      <span className={`quest-cat-chip ${q.category}`}>
                        {q.category.toUpperCase()}
                      </span>
                      <div>
                        <strong className="quest-title">{q.title}</strong>
                        <div className="quest-progress-row">
                          <div className="quest-track">
                            <div className="quest-fill" style={{ width: `${percent}%` }} />
                          </div>
                          <span className="quest-nums">
                            {q.currentProgress} / {q.maxProgress} {q.unit}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="quest-right">
                      <span className="quest-xp-badge">+{q.xpReward} XP</span>
                      {q.isClaimed ? (
                        <span className="quest-claimed-tag">✓ Claimed</span>
                      ) : isReady ? (
                        <button
                          type="button"
                          onClick={() => handleClaimQuest(q.id, q.xpReward)}
                          className="btn-claim-quest"
                        >
                          <Sparkles size={14} /> Claim XP
                        </button>
                      ) : (
                        <span className="quest-in-progress">In Progress</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-primary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
