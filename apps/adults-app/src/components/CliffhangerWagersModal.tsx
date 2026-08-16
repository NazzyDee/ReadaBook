import React, { useState } from 'react';
import { X, Dices, Sparkles, Clock, Award } from 'lucide-react';
import { ACTIVE_CLIFFHANGER_WAGER, type CliffhangerWagerPoll } from '../lib/cliffhangerWagersData';
import { soundFX } from '../lib/soundFx';

interface CliffhangerWagersModalProps {
  streamerName: string;
  onClose: () => void;
}

export const CliffhangerWagersModal: React.FC<CliffhangerWagersModalProps> = ({
  streamerName,
  onClose
}) => {
  const [wager, setWager] = useState<CliffhangerWagerPoll>(ACTIVE_CLIFFHANGER_WAGER);
  const [betAmount, setBetAmount] = useState<number>(250);
  const [userChoice, setUserChoice] = useState<'A' | 'B' | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const total = wager.optionA.totalSparks + wager.optionB.totalSparks;
  const pctA = Math.round((wager.optionA.totalSparks / total) * 100);
  const pctB = 100 - pctA;

  const handlePlaceWager = (choice: 'A' | 'B') => {
    soundFX.playPop();
    setUserChoice(choice);
    if (choice === 'A') {
      setWager(prev => ({
        ...prev,
        optionA: {
          ...prev.optionA,
          totalSparks: prev.optionA.totalSparks + betAmount,
          backerCount: prev.optionA.backerCount + 1
        },
        totalPoolSparks: prev.totalPoolSparks + betAmount
      }));
    } else {
      setWager(prev => ({
        ...prev,
        optionB: {
          ...prev.optionB,
          totalSparks: prev.optionB.totalSparks + betAmount,
          backerCount: prev.optionB.backerCount + 1
        },
        totalPoolSparks: prev.totalPoolSparks + betAmount
      }));
    }
    soundFX.playChestClaim();
    setToastMsg(`🎲 Wagered ${betAmount} Sparks on Option ${choice}! Potential return: ${Math.round(betAmount * (choice === 'A' ? wager.optionA.multiplier : wager.optionB.multiplier))} Sparks.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleResolveWager = (winner: 'A' | 'B') => {
    soundFX.playChestClaim();
    soundFX.playApplause();
    setToastMsg(`🏆 Prediction Resolved! Option ${winner} Wins! Payouts distributed to winning backers.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="wager-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="wager-modal-header">
          <div className="wager-title-group">
            <div className="wager-badge">
              <Dices size={16} />
              <span>CHAPTER CLIFFHANGER PREDICTION POOL</span>
            </div>
            <h3>@{streamerName}'s Live Narrative Wager</h3>
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

        {/* Question Banner */}
        <div className="wager-question-banner">
          <div className="wager-q-top">
            <div className="time-remaining-pill">
              <Clock size={14} />
              <span>{wager.secondsRemaining}s Left to Predict</span>
            </div>
            <span className="pool-size-pill">🔥 {wager.totalPoolSparks.toLocaleString()} Sparks Pool</span>
          </div>

          <h4>{wager.question}</h4>
          <p className="chapter-ctx">{wager.chapterContext}</p>
        </div>

        {/* Odds Ratio Bar */}
        <div className="wager-odds-bar-container">
          <div className="odds-labels-row">
            <span className="side-a-label">Option A: {pctA}% ({wager.optionA.multiplier}x)</span>
            <span className="side-b-label">Option B: {pctB}% ({wager.optionB.multiplier}x)</span>
          </div>
          <div className="odds-bar-track">
            <div className="odds-bar-fill-a" style={{ width: `${pctA}%` }}></div>
            <div className="odds-bar-fill-b" style={{ width: `${pctB}%` }}></div>
          </div>
        </div>

        {/* Options Split Grid */}
        <div className="wager-options-grid">
          {/* Option A */}
          <div className={`wager-option-card side-a ${userChoice === 'A' ? 'chosen' : ''}`}>
            <div className="opt-top">
              <span className="opt-letter">A</span>
              <h4>{wager.optionA.label}</h4>
            </div>
            <div className="opt-meta">
              <span className="payout-mult">{wager.optionA.multiplier}x Return</span>
              <span>{wager.optionA.backerCount} Backers ({wager.optionA.totalSparks.toLocaleString()} Sparks)</span>
            </div>
            <button
              type="button"
              className="btn-place-wager btn-wager-a"
              onClick={() => handlePlaceWager('A')}
            >
              Wager {betAmount} Sparks
            </button>
          </div>

          {/* Option B */}
          <div className={`wager-option-card side-b ${userChoice === 'B' ? 'chosen' : ''}`}>
            <div className="opt-top">
              <span className="opt-letter">B</span>
              <h4>{wager.optionB.label}</h4>
            </div>
            <div className="opt-meta">
              <span className="payout-mult">{wager.optionB.multiplier}x Return</span>
              <span>{wager.optionB.backerCount} Backers ({wager.optionB.totalSparks.toLocaleString()} Sparks)</span>
            </div>
            <button
              type="button"
              className="btn-place-wager btn-wager-b"
              onClick={() => handlePlaceWager('B')}
            >
              Wager {betAmount} Sparks
            </button>
          </div>
        </div>

        {/* Bet Amount Chips */}
        <div className="bet-amount-row">
          <span className="bet-label">WAGER AMOUNT:</span>
          <div className="bet-chips-group">
            {[100, 250, 500, 1000].map(amt => (
              <button
                key={amt}
                type="button"
                className={`btn-bet-chip ${betAmount === amt ? 'active' : ''}`}
                onClick={() => {
                  soundFX.playPop();
                  setBetAmount(amt);
                }}
              >
                ✨ {amt}
              </button>
            ))}
          </div>
        </div>

        {/* Broadcaster Resolve Bar */}
        <div className="resolve-broadcaster-bar">
          <div className="resolve-title">
            <Award size={16} color="#ffd700" />
            <span>Broadcaster Controls: Resolve Chapter Outcome</span>
          </div>

          <div className="resolve-buttons-row">
            <button
              type="button"
              className="btn-resolve-opt btn-res-a"
              onClick={() => handleResolveWager('A')}
            >
              Resolve: Option A Won
            </button>
            <button
              type="button"
              className="btn-resolve-opt btn-res-b"
              onClick={() => handleResolveWager('B')}
            >
              Resolve: Option B Won
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
