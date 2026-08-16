import React, { useState, useEffect } from 'react';
import { X, Trophy, Sparkles, Clock, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { DEFAULT_PREDICTION_DATA, type LiteraryPrediction } from '../lib/predictionsData';
import { soundFX } from '../lib/soundFx';

interface CommunityPredictionsModalProps {
  streamerName: string;
  onClose: () => void;
}

export const CommunityPredictionsModal: React.FC<CommunityPredictionsModalProps> = ({
  streamerName,
  onClose
}) => {
  const [pred, setPred] = useState<LiteraryPrediction>(DEFAULT_PREDICTION_DATA);
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState<number>(500);
  const [hasVoted, setHasVoted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (pred.secondsRemaining <= 0) return;
    const timer = setInterval(() => {
      setPred(p => ({
        ...p,
        secondsRemaining: Math.max(0, p.secondsRemaining - 1),
        status: p.secondsRemaining - 1 === 0 ? 'locked' : p.status
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [pred.secondsRemaining]);

  const percentA = Math.round(
    (pred.outcomes[0].totalPointsStaked / pred.totalPoolPoints) * 100
  );
  const percentB = 100 - percentA;

  const handlePlaceVote = () => {
    if (!selectedOutcomeId || stakeAmount <= 0) return;

    soundFX.playChestClaim();
    soundFX.playThunder();

    const chosen = pred.outcomes.find(o => o.id === selectedOutcomeId)!;

    setPred(prev => {
      const updatedOutcomes = prev.outcomes.map(o =>
        o.id === selectedOutcomeId
          ? {
              ...o,
              totalPointsStaked: o.totalPointsStaked + stakeAmount,
              totalVoters: o.totalVoters + 1
            }
          : o
      ) as [typeof prev.outcomes[0], typeof prev.outcomes[1]];

      return {
        ...prev,
        totalPoolPoints: prev.totalPoolPoints + stakeAmount,
        outcomes: updatedOutcomes,
        userVote: {
          outcomeId: selectedOutcomeId,
          pointsStaked: stakeAmount
        }
      };
    });

    setHasVoted(true);
    setToastMessage(`⚡ Locked in ${stakeAmount.toLocaleString()} Sparks on "${chosen.title}"! Potential return: ${Math.round(stakeAmount * chosen.ratio).toLocaleString()} Sparks.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="predictions-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="predictions-modal-header">
          <div className="predictions-title-group">
            <div className="predictions-badge">
              <Trophy size={16} />
              <span>COMMUNITY PREDICTIONS & SPARKS STAKING POOL</span>
            </div>
            <h3>@{streamerName}'s Live Story Prediction</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Success Toast */}
        {toastMessage && (
          <div className="sub-celebration-toast">
            <Sparkles size={18} color="#ffd700" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Prediction Question Banner */}
        <div className="prediction-question-card">
          <div className="question-header-row">
            <span className="book-chapter-tag">{pred.bookTitle} • {pred.chapterTitle}</span>
            <div className="timer-pill">
              <Clock size={13} />
              <span>{pred.status === 'locked' ? 'VOTING LOCKED' : `${Math.floor(pred.secondsRemaining / 60)}:${(pred.secondsRemaining % 60).toString().padStart(2, '0')} remaining`}</span>
            </div>
          </div>

          <h4>{pred.question}</h4>

          <div className="pool-meta-row">
            <span>Total Staked Pool: <strong>{pred.totalPoolPoints.toLocaleString()} Sparks</strong></span>
            <span>Status: <strong className={pred.status}>{pred.status.toUpperCase()}</strong></span>
          </div>

          {/* Dual Bar Odds */}
          <div className="prediction-odds-bar">
            <div className="odds-fill-a" style={{ width: `${percentA}%` }}>
              <span>Option A: {percentA}% ({pred.outcomes[0].ratio}x)</span>
            </div>
            <div className="odds-fill-b" style={{ width: `${percentB}%` }}>
              <span>Option B: {percentB}% ({pred.outcomes[1].ratio}x)</span>
            </div>
          </div>
        </div>

        {/* Outcome Cards Grid */}
        <div className="outcomes-selection-grid">
          {pred.outcomes.map(out => {
            const isSelected = selectedOutcomeId === out.id;
            return (
              <div
                key={out.id}
                className={`outcome-card-item ${isSelected ? 'selected' : ''}`}
                style={{ borderColor: isSelected ? out.color : undefined }}
                onClick={() => {
                  if (pred.status !== 'active' || hasVoted) return;
                  soundFX.playPop();
                  setSelectedOutcomeId(out.id);
                }}
              >
                <div className="outcome-top-row">
                  <span className="outcome-ratio-tag" style={{ backgroundColor: out.color }}>
                    {out.ratio}x Return
                  </span>
                  <span className="voters-count">
                    <Users size={12} /> {out.totalVoters} Voters
                  </span>
                </div>

                <h4>{out.title}</h4>
                <p className="staked-points-text">{out.totalPointsStaked.toLocaleString()} Sparks Staked</p>
              </div>
            );
          })}
        </div>

        {/* Stake Controller */}
        {!hasVoted && pred.status === 'active' ? (
          <div className="stake-controller-card">
            <div className="stake-header-row">
              <label>Choose Sparks Stake Amount:</label>
              <div className="quick-amounts-row">
                {[100, 500, 1000, 5000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    className={`btn-quick-stake ${stakeAmount === amt ? 'active' : ''}`}
                    onClick={() => {
                      soundFX.playPop();
                      setStakeAmount(amt);
                    }}
                  >
                    {amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="stake-action-row">
              <input
                type="number"
                min={50}
                step={50}
                value={stakeAmount}
                onChange={e => setStakeAmount(Number(e.target.value))}
                className="stake-custom-input"
              />

              <button
                type="button"
                className="btn-primary btn-submit-prediction"
                disabled={!selectedOutcomeId}
                onClick={handlePlaceVote}
              >
                <TrendingUp size={15} />
                <span>Stake {stakeAmount.toLocaleString()} Sparks</span>
              </button>
            </div>
          </div>
        ) : hasVoted ? (
          <div className="voted-confirmation-box">
            <CheckCircle2 size={18} color="var(--accent-success)" />
            <span>
              Your vote of <strong>{pred.userVote?.pointsStaked.toLocaleString()} Sparks</strong> is locked in! Winners paid automatically when the chapter concludes.
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};
