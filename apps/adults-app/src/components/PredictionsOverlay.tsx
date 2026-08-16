import React, { useState } from 'react';
import { usePoints } from '../lib/PointsContext';
import { soundFX } from '../lib/soundFx';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Trophy,
  Check
} from 'lucide-react';

interface PredictionsOverlayProps {
  isBroadcaster?: boolean;
}

export const PredictionsOverlay: React.FC<PredictionsOverlayProps> = ({ isBroadcaster = false }) => {
  const { activePrediction, points, placeBet, resolvePrediction, userBets, userBetOption } = usePoints();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number>(50);
  const [betPlacedMsg, setBetPlacedMsg] = useState<string | null>(null);
  const [resolutionResult, setResolutionResult] = useState<{ payout: number; won: boolean; winningTitle: string } | null>(null);

  if (!activePrediction) return null;

  const totalPool = activePrediction.options.reduce((acc, opt) => acc + opt.totalTokens, 0);
  const userHasBet = Boolean(userBets[activePrediction.id]);
  const userChosenOptionId = userBetOption[activePrediction.id];

  const handleBet = (optionId: string) => {
    if (betAmount <= 0 || points < betAmount) return;
    soundFX.playPop();
    const ok = placeBet(optionId, betAmount);
    if (ok) {
      setBetPlacedMsg(`Placed ${betAmount} Tokens on "${activePrediction.options.find(o => o.id === optionId)?.title}"!`);
      setSelectedOptionId(null);
      setTimeout(() => setBetPlacedMsg(null), 3000);
    }
  };

  const handleResolve = (winningOptId: string) => {
    soundFX.playChestClaim();
    const winningOpt = activePrediction.options.find(o => o.id === winningOptId);
    const res = resolvePrediction(winningOptId);
    setResolutionResult({
      payout: res.payout,
      won: res.won,
      winningTitle: winningOpt?.title || 'Winning Outcome'
    });
    setTimeout(() => {
      setResolutionResult(null);
    }, 6000);
  };

  return (
    <div className={`prediction-banner-container ${collapsed ? 'collapsed' : ''}`}>
      <div className="prediction-banner-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="prediction-badge">
          <TrendingUp size={14} />
          <span>LIVE PREDICTION</span>
        </div>
        <span className="prediction-question">{activePrediction.question}</span>
        <button className="btn-toggle-pred">
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {!collapsed && (
        <div className="prediction-body">
          {/* Resolution Victory Banner */}
          {resolutionResult && (
            <div className="prediction-payout-banner">
              <Trophy size={20} color="#ffd700" />
              <div>
                <strong>Prediction Resolved: "{resolutionResult.winningTitle}" Won!</strong>
                {resolutionResult.won ? (
                  <p>🎉 Congratulations! You won <strong>+{resolutionResult.payout.toLocaleString()} Tokens</strong>!</p>
                ) : (
                  <p>Better luck next chapter! Thanks for participating in the prediction.</p>
                )}
              </div>
            </div>
          )}

          {/* Options side-by-side */}
          <div className="prediction-options-row">
            {activePrediction.options.map((option) => {
              const percentage = totalPool > 0 ? Math.round((option.totalTokens / totalPool) * 100) : 50;
              const multiplier = option.totalTokens > 0 ? (totalPool / option.totalTokens).toFixed(2) : '1.00';
              const isChosen = userChosenOptionId === option.id;

              return (
                <div
                  key={option.id}
                  className={`prediction-option-box ${selectedOptionId === option.id ? 'active' : ''} ${isChosen ? 'user-chosen' : ''}`}
                  style={{ borderLeftColor: option.color }}
                  onClick={() => !userHasBet && setSelectedOptionId(option.id)}
                >
                  <div className="pred-option-top">
                    <span className="pred-option-title">{option.title}</span>
                    <span className="pred-option-multiplier" style={{ color: option.color }}>
                      {multiplier}x Payout
                    </span>
                  </div>

                  <div className="pred-progress-bar-track">
                    <div
                      className="pred-progress-bar-fill"
                      style={{ width: `${percentage}%`, backgroundColor: option.color }}
                    />
                  </div>

                  <div className="pred-option-stats">
                    <span>{percentage}% ({option.totalTokens.toLocaleString()} tokens)</span>
                    <span>{option.totalUsers} voters</span>
                  </div>

                  {isChosen && (
                    <div className="user-bet-indicator">
                      <CheckCircle2 size={12} />
                      <span>You bet {(userBets[activePrediction.id] || 0).toLocaleString()} tokens</span>
                    </div>
                  )}

                  {/* Broadcaster Resolve Outcome Button */}
                  {isBroadcaster && activePrediction.status !== 'resolved' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResolve(option.id);
                      }}
                      className="btn-resolve-opt"
                      style={{ background: option.color }}
                    >
                      <Check size={12} />
                      <span>Declare Winner</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Betting form */}
          {!userHasBet && selectedOptionId && (
            <div className="prediction-bet-bar">
              <span className="bet-prompt-text">
                Bet on <strong>{activePrediction.options.find(o => o.id === selectedOptionId)?.title}</strong>:
              </span>

              <div className="quick-bet-buttons">
                {[10, 50, 100, 250, 500].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    className={`btn-quick-bet ${betAmount === amt ? 'active' : ''}`}
                    onClick={() => {
                      soundFX.playPop();
                      setBetAmount(amt);
                    }}
                    disabled={points < amt}
                  >
                    {amt}
                  </button>
                ))}
                <button
                  type="button"
                  className="btn-quick-bet"
                  onClick={() => {
                    soundFX.playPop();
                    setBetAmount(points);
                  }}
                >
                  Max ({points})
                </button>
              </div>

              <div className="bet-action-row">
                <input
                  type="number"
                  min="1"
                  max={points}
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value, 10) || 0))}
                  className="bet-input"
                />
                <button
                  type="button"
                  onClick={() => handleBet(selectedOptionId)}
                  disabled={points < betAmount || betAmount <= 0}
                  className="btn-primary btn-bet-confirm"
                >
                  Place Bet
                </button>
              </div>
            </div>
          )}

          {betPlacedMsg && (
            <div className="bet-success-toast">
              <Sparkles size={14} />
              <span>{betPlacedMsg}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
