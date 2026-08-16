import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import { kidSound } from '../lib/kidSoundFx';

interface KidKaraokeReaderProps {
  title: string;
  author: string;
  pages: string[];
  currentPage?: number;
  onPageChange?: (pageIdx: number) => void;
}

export const KidKaraokeReader: React.FC<KidKaraokeReaderProps> = ({
  title,
  author,
  pages,
  currentPage = 0,
  onPageChange
}) => {
  const [localPage, setLocalPage] = useState(currentPage);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);

  const displayPage = localPage;
  const pageText = pages[displayPage] || 'Once upon a time in a magical land far away, a brave little dragon loved reading books under the stars...';
  const words = pageText.split(/\s+/).filter(Boolean);

  const handleSpeakWord = (word: string, idx: number) => {
    kidSound.playBubblePop();
    setActiveWordIdx(idx);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanWord);
      utterance.rate = 0.85; // slightly slower for young readers
      utterance.pitch = 1.2;
      utterance.onend = () => setActiveWordIdx(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setActiveWordIdx(null), 1000);
    }
  };

  const handlePrevPage = () => {
    if (displayPage > 0) {
      kidSound.playBubblePop();
      const newP = displayPage - 1;
      setLocalPage(newP);
      if (onPageChange) onPageChange(newP);
    }
  };

  const handleNextPage = () => {
    if (displayPage < pages.length - 1) {
      kidSound.playMagicSparkle();
      const newP = displayPage + 1;
      setLocalPage(newP);
      if (onPageChange) onPageChange(newP);
    }
  };

  return (
    <div className="kid-karaoke-reader-card">
      {/* Top Header */}
      <div className="karaoke-top-bar">
        <div className="karaoke-book-meta">
          <BookOpen size={18} color="#ffd700" />
          <div>
            <h4 className="karaoke-title">{title}</h4>
            <span className="karaoke-author">by {author}</span>
          </div>
        </div>

        <div className="karaoke-tip-pill">
          <Sparkles size={13} color="#ffd700" />
          <span>Tap any word to hear it speak! 🔊</span>
        </div>
      </div>

      {/* Storybook Text Display with Interactive Word Chips */}
      <div className="karaoke-text-container">
        <div className="karaoke-words-flow">
          {words.map((word, idx) => {
            const isActive = activeWordIdx === idx;
            return (
              <button
                key={`${idx}_${word}`}
                type="button"
                onClick={() => handleSpeakWord(word, idx)}
                className={`kid-word-chip ${isActive ? 'word-active' : ''}`}
              >
                {isActive && <span className="bouncing-star-badge">⭐</span>}
                <span className="word-text">{word}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Page Navigation Controls */}
      <div className="karaoke-nav-bar">
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={displayPage === 0}
          className="btn-kid-page-nav"
        >
          <ChevronLeft size={20} />
          <span>Previous Page</span>
        </button>

        <span className="karaoke-page-indicator">
          Page <strong>{displayPage + 1}</strong> of {Math.max(1, pages.length)}
        </span>

        <button
          type="button"
          onClick={handleNextPage}
          disabled={displayPage >= pages.length - 1}
          className="btn-kid-page-nav btn-next-gold"
        >
          <span>Next Page</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
