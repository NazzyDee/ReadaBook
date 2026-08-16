import React, { useState, useEffect } from 'react';
import {
  Trophy,
  X,
  Clock,
  Sparkles,
  Zap,
  Flame,
  CheckCircle2,
  XCircle,
  Award,
  Crown,
  Medal
} from 'lucide-react';
import {
  SAMPLE_TRIVIA_QUESTIONS,
  INITIAL_BATTLE_BOTS,
  type TriviaQuestion,
  type BattleParticipant
} from '../lib/triviaBattleData';
import { usePoints } from '../lib/PointsContext';
import { soundFX } from '../lib/soundFx';

interface BookBattleArenaProps {
  streamerName: string;
  onClose: () => void;
  onBroadcastResult?: (msg: string) => void;
}

export const BookBattleArena: React.FC<BookBattleArenaProps> = ({
  streamerName,
  onClose,
  onBroadcastResult
}) => {
  const [stage, setStage] = useState<'lobby' | 'question' | 'reveal' | 'podium'>('lobby');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(15);
  const [userSelection, setUserSelection] = useState<number | null>(null);
  const [userScore, setUserScore] = useState(0);
  const [userStreak, setUserStreak] = useState(0);
  const [participants, setParticipants] = useState<BattleParticipant[]>(INITIAL_BATTLE_BOTS);
  const [isRewardClaimed, setIsRewardClaimed] = useState(false);

  const { addPoints } = usePoints();
  const currentQuestion: TriviaQuestion = SAMPLE_TRIVIA_QUESTIONS[currentQIndex] || SAMPLE_TRIVIA_QUESTIONS[0];

  // Lobby countdown to first question
  const handleStartTournament = () => {
    soundFX.playChestClaim();
    setStage('question');
    setSecondsLeft(currentQuestion.timeLimitSec || 15);
  };

  // Question Timer
  useEffect(() => {
    if (stage !== 'question') return;

    if (secondsLeft <= 0) {
      handleTimeExpired();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev === 4) soundFX.playPop();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, secondsLeft]);

  const handleSelectOption = (idx: number) => {
    if (userSelection !== null || stage !== 'question') return;
    soundFX.playPop();
    setUserSelection(idx);
  };

  const handleTimeExpired = () => {
    setStage('reveal');

    // Calculate score
    const isCorrect = userSelection === currentQuestion.correctIndex;
    if (isCorrect) {
      soundFX.playChestClaim();
      const speedBonus = Math.max(0, secondsLeft * 10);
      const streakBonus = userStreak * 25;
      const pointsEarned = 100 + speedBonus + streakBonus;
      setUserScore(prev => prev + pointsEarned);
      setUserStreak(prev => prev + 1);
    } else {
      soundFX.playPop();
      setUserStreak(0);
    }

    // Update Bot Scores randomly for simulation
    setParticipants(prev =>
      prev
        .map(p => {
          const botCorrect = Math.random() > 0.35;
          const added = botCorrect ? Math.round(100 + Math.random() * 50) : 0;
          return {
            ...p,
            score: p.score + added,
            streak: botCorrect ? p.streak + 1 : 0
          };
        })
        .sort((a, b) => b.score - a.score)
    );
  };

  const handleNextQuestion = () => {
    soundFX.playPop();
    if (currentQIndex < SAMPLE_TRIVIA_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setUserSelection(null);
      setSecondsLeft(15);
      setStage('question');
    } else {
      setStage('podium');
      if (onBroadcastResult) {
        onBroadcastResult(`🏆 Book Battle Tournament concluded! Final Score: ${userScore} pts!`);
      }
    }
  };

  const handleClaimPodiumReward = () => {
    soundFX.playChestClaim();
    addPoints(250);
    setIsRewardClaimed(true);
  };

  const optionLetters = ['A', 'B', 'C', 'D'];
  const mockDistribution = [42, 28, 18, 12]; // chat answer % distribution

  return (
    <div className="modal-backdrop">
      <div className="battle-arena-modal-card">
        {/* Header */}
        <div className="battle-arena-header">
          <div className="battle-title-row">
            <Trophy size={24} color="#ffd700" />
            <div>
              <h3>👑 Book Battle Royale Arena</h3>
              <span className="battle-sub">Live Synchronized Literary Trivia Tournament • Hosted by @{streamerName}</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* LOBBY STAGE */}
        {stage === 'lobby' && (
          <div className="battle-lobby-view">
            <div className="lobby-hero-card">
              <Crown size={48} color="#ffd700" className="pulse-fast" />
              <h4>Ready for the Live Book Battle?</h4>
              <p>
                5 speed-trivia questions on <strong>{currentQuestion.bookTitle}</strong>. Answer quickly for combo multipliers and climb the live stream podium!
              </p>

              <div className="lobby-prizes-box">
                <div className="prize-item">
                  <Medal size={20} color="#ffd700" />
                  <div>
                    <strong>1st Place</strong>
                    <span>+250 Book Tokens & Grand Lore Badge</span>
                  </div>
                </div>
                <div className="prize-item">
                  <Award size={20} color="#c0c0c0" />
                  <div>
                    <strong>2nd Place</strong>
                    <span>+100 Book Tokens</span>
                  </div>
                </div>
                <div className="prize-item">
                  <Award size={20} color="#cd7f32" />
                  <div>
                    <strong>3rd Place</strong>
                    <span>+50 Book Tokens</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartTournament}
                className="btn-start-battle"
              >
                <Zap size={18} />
                <span>Enter Tournament Battle</span>
              </button>
            </div>
          </div>
        )}

        {/* QUESTION & REVEAL STAGES */}
        {(stage === 'question' || stage === 'reveal') && (
          <div className="battle-gameplay-layout">
            {/* Left: Main Question Arena */}
            <div className="battle-question-col">
              {/* Question Top Bar */}
              <div className="q-top-bar">
                <span className="q-progress-pill">
                  Question <strong>{currentQIndex + 1}</strong> of {SAMPLE_TRIVIA_QUESTIONS.length}
                </span>

                <div className="q-streak-badge">
                  <Flame size={14} color="#ff3b3b" />
                  <span>Streak: <strong>{userStreak}x</strong></span>
                </div>

                <div className={`q-timer-badge ${secondsLeft <= 5 ? 'urgent' : ''}`}>
                  <Clock size={14} />
                  <span>{secondsLeft}s</span>
                </div>
              </div>

              {/* Question Card */}
              <div className="q-prompt-box">
                <span className="q-book-tag">📖 {currentQuestion.bookTitle}</span>
                <h4 className="q-text">{currentQuestion.question}</h4>
              </div>

              {/* 4 Interactive Answer Options */}
              <div className="q-options-grid">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = userSelection === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;
                  let cardClass = '';

                  if (stage === 'reveal') {
                    if (isCorrect) cardClass = 'correct';
                    else if (isSelected && !isCorrect) cardClass = 'wrong';
                    else cardClass = 'dimmed';
                  } else if (isSelected) {
                    cardClass = 'selected';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      disabled={stage === 'reveal' || userSelection !== null}
                      className={`btn-option-card ${cardClass}`}
                    >
                      <span className="opt-letter">{optionLetters[idx]}</span>
                      <span className="opt-text">{opt}</span>

                      {stage === 'reveal' && (
                        <div className="opt-reveal-meta">
                          <span className="opt-percent">{mockDistribution[idx]}%</span>
                          {isCorrect ? (
                            <CheckCircle2 size={16} color="#00ff88" />
                          ) : isSelected ? (
                            <XCircle size={16} color="#ff3b3b" />
                          ) : null}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Reveal Explanation Banner */}
              {stage === 'reveal' && (
                <div className="reveal-explanation-banner">
                  <div className="exp-top">
                    {userSelection === currentQuestion.correctIndex ? (
                      <span className="exp-status-correct">🎉 Correct Answer! (+100 pts)</span>
                    ) : (
                      <span className="exp-status-wrong">❌ Incorrect! (Streak Reset)</span>
                    )}
                  </div>
                  <p className="exp-lore-text">{currentQuestion.explanation}</p>
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="btn-next-question"
                  >
                    <span>{currentQIndex < SAMPLE_TRIVIA_QUESTIONS.length - 1 ? 'Next Question ➔' : 'View Tournament Results 🏆'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right: Live Tournament Leaderboard */}
            <div className="battle-leaderboard-col">
              <div className="lb-header">
                <Trophy size={14} color="#ffd700" />
                <span>Live Stream Standings</span>
              </div>

              {/* User Standing Card */}
              <div className="user-standing-card">
                <div className="user-standing-info">
                  <span className="user-rank">YOU (Rank #1)</span>
                  <strong className="user-score">{userScore} PTS</strong>
                </div>
                <div className="user-streak-mini">
                  <Sparkles size={12} color="#ffd700" />
                  <span>{userStreak}x Combo</span>
                </div>
              </div>

              {/* Bot Participants List */}
              <div className="lb-participants-list">
                {participants.map((p, idx) => (
                  <div key={p.id} className="lb-participant-row">
                    <span className="p-rank">#{idx + 2}</span>
                    <img src={p.avatarUrl} alt={p.username} className="p-avatar" />
                    <div className="p-details">
                      <span className="p-name">{p.username}</span>
                      <span className="p-streak">{p.streak > 1 ? `🔥 ${p.streak}x` : ''}</span>
                    </div>
                    <strong className="p-score">{p.score}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PODIUM FINAL RESULTS STAGE */}
        {stage === 'podium' && (
          <div className="battle-podium-view">
            <div className="podium-header-banner">
              <Crown size={38} color="#ffd700" className="pulse-fast" />
              <h3>Tournament Victory Podium! 🏆</h3>
              <p>Congratulations to the top lore scholars of the stream!</p>
            </div>

            <div className="podium-standings-row">
              {/* 2nd Place */}
              <div className="podium-pillar pillar-silver">
                <div className="podium-avatar-wrapper">
                  <img src={participants[0]?.avatarUrl} alt="2nd" className="podium-avatar" />
                  <span className="podium-rank-badge">2</span>
                </div>
                <strong>{participants[0]?.username}</strong>
                <span>{participants[0]?.score} pts</span>
                <div className="pillar-block block-silver">2nd</div>
              </div>

              {/* 1st Place (YOU) */}
              <div className="podium-pillar pillar-gold">
                <div className="podium-avatar-wrapper gold-aura">
                  <Crown size={20} color="#ffd700" className="crown-over-avatar" />
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" alt="1st" className="podium-avatar" />
                  <span className="podium-rank-badge gold">1</span>
                </div>
                <strong style={{ color: '#ffd700' }}>YOU (Lore Champion)</strong>
                <span className="score-gold">{userScore} pts</span>
                <div className="pillar-block block-gold">1st</div>
              </div>

              {/* 3rd Place */}
              <div className="podium-pillar pillar-bronze">
                <div className="podium-avatar-wrapper">
                  <img src={participants[1]?.avatarUrl} alt="3rd" className="podium-avatar" />
                  <span className="podium-rank-badge">3</span>
                </div>
                <strong>{participants[1]?.username}</strong>
                <span>{participants[1]?.score} pts</span>
                <div className="pillar-block block-bronze">3rd</div>
              </div>
            </div>

            <div className="podium-reward-action">
              {!isRewardClaimed ? (
                <button
                  type="button"
                  onClick={handleClaimPodiumReward}
                  className="btn-claim-podium"
                >
                  <Sparkles size={18} />
                  <span>Claim +250 Book Tokens & Lore Master Crest! 🪙</span>
                </button>
              ) : (
                <div className="reward-claimed-banner">
                  <CheckCircle2 size={20} color="#00ff88" />
                  <span>+250 Book Tokens added to your wallet! "Grand Lore Master" badge equipped.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
