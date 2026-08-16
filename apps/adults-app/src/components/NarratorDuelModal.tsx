import React, { useState, useEffect } from 'react';
import {
  X,
  Swords,
  Clock,
  Crown,
  Vote
} from 'lucide-react';
import { SAMPLE_DUEL, type DuelChallenge } from '../lib/narratorDuelData';
import { soundFX } from '../lib/soundFx';
import { usePoints } from '../lib/PointsContext';

interface NarratorDuelModalProps {
  onClose: () => void;
}

export const NarratorDuelModal: React.FC<NarratorDuelModalProps> = ({ onClose }) => {
  const [duel] = useState<DuelChallenge>(SAMPLE_DUEL);
  const [stage, setStage] = useState<'countdown' | 'reading' | 'voting' | 'winner'>('countdown');
  const [secondsLeft, setSecondsLeft] = useState(45);
  const [votesA, setVotesA] = useState(142);
  const [votesB, setVotesB] = useState(138);
  const [userVoted, setUserVoted] = useState<'A' | 'B' | null>(null);

  const { addPoints } = usePoints();

  // Timer loop
  useEffect(() => {
    if (stage !== 'reading') return;
    if (secondsLeft <= 0) {
      soundFX.playApplause();
      setStage('voting');
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft(s => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [stage, secondsLeft]);

  const handleStartDuel = () => {
    soundFX.playChestClaim();
    setStage('reading');
    setSecondsLeft(duel.targetDurationSec);
  };

  const handleVote = (contender: 'A' | 'B') => {
    if (userVoted) return;
    soundFX.playPop();
    setUserVoted(contender);
    if (contender === 'A') setVotesA(v => v + 1);
    else setVotesB(v => v + 1);
  };

  const handleConcludeDuel = () => {
    soundFX.playApplause();
    setStage('winner');
    addPoints(200);
  };

  const totalVotes = votesA + votesB;
  const pctA = Math.round((votesA / totalVotes) * 100);
  const pctB = 100 - pctA;

  return (
    <div className="modal-backdrop">
      <div className="duel-modal-card">
        {/* Header */}
        <div className="duel-modal-header">
          <div className="duel-title-group">
            <Swords size={24} color="#ff3b3b" className="pulse-fast" />
            <div>
              <h3>⚔️ Live Voice Acting Face-Off (Narrator Duel)</h3>
              <span className="modal-subtitle">{duel.bookTitle} • {duel.sceneTitle}</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Contenders Arena Split Card */}
        <div className="duel-contenders-row">
          {/* Contender A */}
          <div className={`duel-contender-card ${userVoted === 'A' ? 'voted' : ''}`}>
            <img src={duel.contenderA.avatarUrl} alt="" className="contender-avatar" />
            <strong className="contender-name">{duel.contenderA.username}</strong>
            <span className="contender-role">Role: {duel.characterA}</span>
            <div className="contender-vote-count">
              <strong>{votesA} Votes ({pctA}%)</strong>
            </div>
            {stage === 'voting' && (
              <button
                type="button"
                onClick={() => handleVote('A')}
                disabled={userVoted !== null}
                className="btn-vote-contender"
              >
                <Vote size={14} /> Vote for {duel.contenderA.username}
              </button>
            )}
          </div>

          {/* VS Center Badge & Timer */}
          <div className="duel-center-hub">
            <div className="vs-badge">VS</div>
            {stage === 'reading' && (
              <div className="duel-timer-badge">
                <Clock size={14} />
                <span>{secondsLeft}s</span>
              </div>
            )}
          </div>

          {/* Contender B */}
          <div className={`duel-contender-card ${userVoted === 'B' ? 'voted' : ''}`}>
            <img src={duel.contenderB.avatarUrl} alt="" className="contender-avatar" />
            <strong className="contender-name">{duel.contenderB.username}</strong>
            <span className="contender-role">Role: {duel.characterB}</span>
            <div className="contender-vote-count">
              <strong>{votesB} Votes ({pctB}%)</strong>
            </div>
            {stage === 'voting' && (
              <button
                type="button"
                onClick={() => handleVote('B')}
                disabled={userVoted !== null}
                className="btn-vote-contender"
              >
                <Vote size={14} /> Vote for {duel.contenderB.username}
              </button>
            )}
          </div>
        </div>

        {/* Live Audience Tug-of-War Vote Meter */}
        <div className="duel-tug-of-war">
          <div className="meter-labels">
            <span>{duel.contenderA.username}: {pctA}%</span>
            <span>{duel.contenderB.username}: {pctB}%</span>
          </div>
          <div className="tug-track">
            <div className="tug-fill-a" style={{ width: `${pctA}%` }} />
            <div className="tug-fill-b" style={{ width: `${pctB}%` }} />
          </div>
        </div>

        {/* Synchronized Script Teleprompter */}
        <div className="duel-teleprompter-box">
          <span className="teleprompter-lbl">📜 Live Dramatic Passage Script:</span>
          <p className="teleprompter-text">{duel.passageText}</p>
        </div>

        {/* Stage Actions */}
        <div className="duel-stage-actions">
          {stage === 'countdown' && (
            <button
              type="button"
              onClick={handleStartDuel}
              className="btn-start-duel-action"
            >
              <Swords size={18} />
              <span>Begin Voice Acting Showdown</span>
            </button>
          )}

          {stage === 'voting' && (
            <button
              type="button"
              onClick={handleConcludeDuel}
              className="btn-primary"
            >
              Conclude Duel & Crown Winner 🏆
            </button>
          )}

          {stage === 'winner' && (
            <div className="winner-announcement-card">
              <Crown size={32} color="#ffd700" className="pulse-fast" />
              <h4>{votesA >= votesB ? duel.contenderA.username : duel.contenderB.username} Wins the Duel! 🏆</h4>
              <p>Audience awarded +200 Book Tokens to the winner! "Grand Voice Master" badge unlocked.</p>
              <button type="button" onClick={onClose} className="btn-primary">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
