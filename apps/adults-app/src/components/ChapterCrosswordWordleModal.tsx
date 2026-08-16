import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';
import { DEFAULT_CROSSWORD_CLUES, DEFAULT_WORDLE_STATE, type CrosswordClue, type LoreWordleState } from '../lib/chapterCrosswordData';
import { soundFX } from '../lib/soundFx';

interface ChapterCrosswordWordleModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ChapterCrosswordWordleModal: React.FC<ChapterCrosswordWordleModalProps> = ({
  streamerName,
  onClose
}) => {
  const [clues, setClues] = useState<CrosswordClue[]>(DEFAULT_CROSSWORD_CLUES);
  const [wordle] = useState<LoreWordleState>(DEFAULT_WORDLE_STATE);
  const [activeTab, setActiveTab] = useState<'CROSSWORD' | 'WORDLE'>('CROSSWORD');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSolveClue = (clueNumber: number) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setClues(prev => prev.map(c => {
      if (c.number === clueNumber) {
        return { ...c, solvedBy: streamerName };
      }
      return c;
    }));
    setToastMsg(`🧩 Clue #${clueNumber} Solved live on overlay! +150 Sparks to Chat.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="crossword-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="crossword-modal-header">
          <div className="crossword-title-group">
            <div className="crossword-badge">
              <HelpCircle size={16} />
              <span>LIVE CHAPTER CROSSWORD & LORE WORDLE OVERLAY</span>
            </div>
            <h3>@{streamerName}'s Chapter Puzzle Chamber</h3>
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

        {/* Tabs */}
        <div className="puzzle-tabs-bar">
          <button
            className={`puzzle-tab-btn ${activeTab === 'CROSSWORD' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playPop();
              setActiveTab('CROSSWORD');
            }}
          >
            🧩 Live Chat Crossword
          </button>
          <button
            className={`puzzle-tab-btn ${activeTab === 'WORDLE' ? 'active' : ''}`}
            onClick={() => {
              soundFX.playPop();
              setActiveTab('WORDLE');
            }}
          >
            🟩 Daily Chapter Wordle
          </button>
        </div>

        {/* Crossword Tab */}
        {activeTab === 'CROSSWORD' ? (
          <div className="crossword-view-layout">
            <div className="crossword-mini-grid">
              <div className="cw-row">
                <span className="cw-cell filled">R</span>
                <span className="cw-cell filled">I</span>
                <span className="cw-cell filled">N</span>
                <span className="cw-cell filled">G</span>
              </div>
              <div className="cw-row">
                <span className="cw-cell empty"></span>
                <span className="cw-cell filled">O</span>
                <span className="cw-cell empty"></span>
                <span className="cw-cell empty"></span>
              </div>
              <div className="cw-row">
                <span className="cw-cell filled">S</span>
                <span className="cw-cell filled">A</span>
                <span className="cw-cell filled">N</span>
                <span className="cw-cell filled">D</span>
                <span className="cw-cell filled">W</span>
                <span className="cw-cell filled">O</span>
                <span className="cw-cell filled">R</span>
                <span className="cw-cell filled">M</span>
              </div>
            </div>

            <div className="crossword-clues-list">
              {clues.map(c => (
                <div key={c.number} className={`clue-item-card ${c.solvedBy ? 'solved' : ''}`}>
                  <div className="clue-top-line">
                    <span className="clue-number-pill">#{c.number} {c.direction}</span>
                    {c.solvedBy ? (
                      <span className="solved-badge">Solved by @{c.solvedBy}</span>
                    ) : (
                      <button
                        type="button"
                        className="btn-solve-clue"
                        onClick={() => handleSolveClue(c.number)}
                      >
                        Solve with Chat
                      </button>
                    )}
                  </div>
                  <p>{c.clue}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Wordle Tab */
          <div className="wordle-view-layout">
            <div className="wordle-board-display">
              {wordle.attempts.map((attempt, idx) => (
                <div key={idx} className="wordle-row">
                  {attempt.split('').map((letter, lIdx) => (
                    <div key={lIdx} className="wordle-tile correct">
                      {letter}
                    </div>
                  ))}
                </div>
              ))}
              <div className="wordle-row">
                {wordle.targetWord.split('').map((letter, lIdx) => (
                  <div key={lIdx} className="wordle-tile solved">
                    {letter}
                  </div>
                ))}
              </div>
            </div>

            <div className="wordle-stats-box">
              <h4>Today's Mystery Chapter Keyword: <strong>{wordle.targetWord}</strong></h4>
              <p>Chat viewers type words in chat using <code>!guess HOBBIT</code> to participate!</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="crossword-modal-footer">
          <span className="footer-puzzle-note">
            🎮 Puzzles automatically sync with current book chapter lore and keywords.
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
          >
            <CheckCircle2 size={16} />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
