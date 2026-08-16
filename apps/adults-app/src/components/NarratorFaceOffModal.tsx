import React, { useState } from 'react';
import { X, Swords, Sparkles, Clock, Crown, Heart, Award } from 'lucide-react';
import { ACTIVE_MONOLOGUE_DUEL, type MonologueDuel } from '../lib/narratorFaceOffData';
import { soundFX } from '../lib/soundFx';

interface NarratorFaceOffModalProps {
  streamerName: string;
  onClose: () => void;
}

export const NarratorFaceOffModal: React.FC<NarratorFaceOffModalProps> = ({
  streamerName,
  onClose
}) => {
  const [duel, setDuel] = useState<MonologueDuel>(ACTIVE_MONOLOGUE_DUEL);
  const [hasVoted, setHasVoted] = useState<'A' | 'B' | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const totalVotes = duel.narratorA.votes + duel.narratorB.votes;
  const pctA = Math.round((duel.narratorA.votes / totalVotes) * 100);
  const pctB = 100 - pctA;

  const handleVote = (side: 'A' | 'B') => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setHasVoted(side);

    if (side === 'A') {
      setDuel(prev => ({
        ...prev,
        narratorA: { ...prev.narratorA, votes: prev.narratorA.votes + 1 }
      }));
      setToastMsg(`⚔️ Voted for @${duel.narratorA.name}'s dramatic performance! (+10 Sparks)`);
    } else {
      setDuel(prev => ({
        ...prev,
        narratorB: { ...prev.narratorB, votes: prev.narratorB.votes + 1 }
      }));
      setToastMsg(`⚔️ Voted for @${duel.narratorB.name}'s dramatic performance! (+10 Sparks)`);
    }
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleDeclareWinner = () => {
    soundFX.playChestClaim();
    soundFX.playApplause();
    const winner = duel.narratorA.votes > duel.narratorB.votes ? duel.narratorA.name : duel.narratorB.name;
    setToastMsg(`👑 MONOLOGUE DUEL CHAMPION: @${winner} won with ${Math.max(pctA, pctB)}% of the community applause!`);
    setTimeout(() => setToastMsg(null), 4500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="faceoff-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="faceoff-modal-header">
          <div className="faceoff-title-group">
            <div className="faceoff-badge">
              <Swords size={16} />
              <span>1V1 DRAMATIC MONOLOGUE FACE-OFF</span>
            </div>
            <h3>@{streamerName}'s Narrator Dueling Arena</h3>
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

        {/* Passage Prompt Box */}
        <div className="passage-prompt-box">
          <div className="passage-top">
            <span className="source-tag">{duel.bookSource}</span>
            <div className="duel-timer">
              <Clock size={14} color="#ff3b3b" />
              <span>{duel.secondsRemaining}s Voting Window</span>
            </div>
          </div>

          <h4>{duel.monologueTitle}</h4>
          <blockquote className="duel-script-text">
            {duel.passageText}
          </blockquote>
        </div>

        {/* Tug-of-war meter */}
        <div className="duel-voting-meter-section">
          <div className="meter-labels-row">
            <span className="side-a-name">@{duel.narratorA.name}: {pctA}% ({duel.narratorA.votes} Votes)</span>
            <span className="side-b-name">@{duel.narratorB.name}: {pctB}% ({duel.narratorB.votes} Votes)</span>
          </div>

          <div className="meter-track">
            <div className="meter-fill-a" style={{ width: `${pctA}%` }}></div>
            <div className="meter-fill-b" style={{ width: `${pctB}%` }}></div>
          </div>
        </div>

        {/* Side-by-side Narrator Podiums */}
        <div className="narrators-podium-grid">
          {/* Narrator A */}
          <div className={`narrator-side-card side-a ${hasVoted === 'A' ? 'voted' : ''}`}>
            <div className="narrator-avatar-wrap">
              <img src={duel.narratorA.avatar} alt={duel.narratorA.name} />
              {pctA > pctB && <Crown size={20} color="#ffd700" className="leader-crown" />}
            </div>
            <h4>@{duel.narratorA.name}</h4>
            <span className="votes-count">{duel.narratorA.votes} Community Cheers</span>

            <button
              type="button"
              className="btn-vote-narrator btn-vote-a"
              onClick={() => handleVote('A')}
            >
              <Heart size={14} />
              <span>Cheer @{duel.narratorA.name}</span>
            </button>
          </div>

          <div className="vs-divider-circle">
            <span>VS</span>
          </div>

          {/* Narrator B */}
          <div className={`narrator-side-card side-b ${hasVoted === 'B' ? 'voted' : ''}`}>
            <div className="narrator-avatar-wrap">
              <img src={duel.narratorB.avatar} alt={duel.narratorB.name} />
              {pctB > pctA && <Crown size={20} color="#ffd700" className="leader-crown" />}
            </div>
            <h4>@{duel.narratorB.name}</h4>
            <span className="votes-count">{duel.narratorB.votes} Community Cheers</span>

            <button
              type="button"
              className="btn-vote-narrator btn-vote-b"
              onClick={() => handleVote('B')}
            >
              <Heart size={14} />
              <span>Cheer @{duel.narratorB.name}</span>
            </button>
          </div>
        </div>

        {/* Broadcaster Resolve Bar */}
        <div className="faceoff-broadcaster-bar">
          <div className="bar-info">
            <Award size={16} color="#ffd700" />
            <span>Broadcaster Controls: Tally Community Score</span>
          </div>

          <button
            type="button"
            className="btn-declare-winner"
            onClick={handleDeclareWinner}
          >
            <span>Declare Champion</span>
          </button>
        </div>
      </div>
    </div>
  );
};
