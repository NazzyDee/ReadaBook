import React, { useState } from 'react';
import { Compass, Volume2, HelpCircle, Check, X, Award, ShieldCheck } from 'lucide-react';
import { BOOK_LORE, type LoreEntity } from '../lib/loreData';
import { soundFX } from '../lib/soundFx';

interface StreamExtensionsProps {
  streamerName?: string;
  bookTitle: string;
  bookId?: string;
  onSendChatMessage?: (msg: string) => void;
}

export const StreamExtensions: React.FC<StreamExtensionsProps> = ({
  bookTitle,
  bookId,
  onSendChatMessage
}) => {
  const [activeTab, setActiveTab] = useState<'none' | 'soundboard' | 'lore' | 'trivia'>('none');
  const [activeSoundPlaying, setActiveSoundPlaying] = useState<string | null>(null);

  // Trivia state
  const [triviaAnswered, setTriviaAnswered] = useState<number | null>(null);
  const [triviaScore, setTriviaScore] = useState(150);

  // Soundboard sounds
  const soundboardItems = [
    { id: 'sound_pages', name: 'Page Rustle 📖', icon: '📄', play: () => soundFX.playPageRustle() },
    { id: 'sound_thunder', name: 'Thunderstorm ⚡', icon: '⛈️', play: () => soundFX.playThunder() },
    { id: 'sound_harp', name: 'Rivendell Harp 🎶', icon: '🎵', play: () => soundFX.playHarp() },
    { id: 'sound_dragon', name: 'Dragon Roar 🐉', icon: '🔥', play: () => soundFX.playDragonRoar() },
    { id: 'sound_cozy', name: 'Cozy Fireplace 🔥', icon: '🪵', play: () => soundFX.playPageRustle() },
    { id: 'sound_applause', name: 'Standing Ovation 👏', icon: '🎉', play: () => soundFX.playApplause() }
  ];

  const handlePlaySound = (item: typeof soundboardItems[0]) => {
    item.play();
    setActiveSoundPlaying(item.name);
    if (onSendChatMessage) {
      onSendChatMessage(`[Sound Alert] Triggered "${item.name}" on stream! 🔊`);
    }
    setTimeout(() => setActiveSoundPlaying(null), 3000);
  };

  const entitiesList = BOOK_LORE[bookId || 'book_lotr'] || BOOK_LORE['book_lotr'];
  const [selectedEntity, setSelectedEntity] = useState<LoreEntity>(entitiesList[0]);

  // Trivia Question
  const triviaQuestion = {
    q: 'What riddle did Bilbo ask Gollum that finally stumped him in the dark caves?',
    options: [
      'What has roots as nobody sees, is taller than trees?',
      'What have I got in my pocket?',
      'Thirty white horses on a red hill?',
      'Voiceless it cries, wingless flutters?'
    ],
    correctIdx: 1,
    explanation: '"What have I got in my pocket?" was not a strict riddle according to the ancient laws, but Gollum agreed to answer it and failed three guesses!'
  };

  const handleAnswerTrivia = (idx: number) => {
    if (triviaAnswered !== null) return;
    setTriviaAnswered(idx);
    if (idx === triviaQuestion.correctIdx) {
      soundFX.playChestClaim();
      setTriviaScore(prev => prev + 100);
      if (onSendChatMessage) {
        onSendChatMessage(`🎯 Correctly answered the Chapter Trivia Quiz (+100 XP)!`);
      }
    } else {
      soundFX.playPop();
    }
  };

  return (
    <div className="stream-extensions-wrapper">
      {/* Floating Extension Trigger Pills */}
      <div className="extension-trigger-bar">
        <button
          onClick={() => setActiveTab(activeTab === 'soundboard' ? 'none' : 'soundboard')}
          className={`btn-extension-trigger ${activeTab === 'soundboard' ? 'active' : ''}`}
          title="Soundboard Extension"
        >
          <Volume2 size={15} />
          <span>Sound Alerts</span>
        </button>

        <button
          onClick={() => setActiveTab(activeTab === 'lore' ? 'none' : 'lore')}
          className={`btn-extension-trigger ${activeTab === 'lore' ? 'active' : ''}`}
          title="Live Map & Lore Extension"
        >
          <Compass size={15} />
          <span>Realm Lore & Map</span>
        </button>

        <button
          onClick={() => setActiveTab(activeTab === 'trivia' ? 'none' : 'trivia')}
          className={`btn-extension-trigger ${activeTab === 'trivia' ? 'active' : ''}`}
          title="Interactive Chapter Trivia"
        >
          <HelpCircle size={15} />
          <span>Live Trivia Quiz</span>
        </button>
      </div>

      {/* Active Sound Alert Toast on stream */}
      {activeSoundPlaying && (
        <div className="sound-playing-alert-toast">
          <Volume2 size={16} className="pulse" />
          <span>Playing {activeSoundPlaying} on stream!</span>
        </div>
      )}

      {/* Extension Panel Modal / Drawer */}
      {activeTab !== 'none' && (
        <div className="extension-glass-drawer">
          <div className="extension-drawer-header">
            <div className="drawer-title-group">
              {activeTab === 'soundboard' && <Volume2 size={18} color="var(--accent-secondary)" />}
              {activeTab === 'lore' && <Compass size={18} color="var(--accent-secondary)" />}
              {activeTab === 'trivia' && <HelpCircle size={18} color="var(--accent-secondary)" />}
              <h4>
                {activeTab === 'soundboard' && 'Interactive Story Soundboard'}
                {activeTab === 'lore' && `Interactive Realm Lore — ${bookTitle}`}
                {activeTab === 'trivia' && 'Chapter Trivia Challenge'}
              </h4>
            </div>
            <button onClick={() => setActiveTab('none')} className="btn-close-drawer">
              <X size={16} />
            </button>
          </div>

          <div className="extension-drawer-content">
            {/* SOUNDBOARD TAB */}
            {activeTab === 'soundboard' && (
              <div className="soundboard-grid">
                {soundboardItems.map(sound => (
                  <button
                    key={sound.id}
                    onClick={() => handlePlaySound(sound)}
                    className="soundboard-item-btn"
                  >
                    <span className="sound-icon">{sound.icon}</span>
                    <span className="sound-name">{sound.name}</span>
                    <span className="sound-cost">Free / Sub perk</span>
                  </button>
                ))}
              </div>
            )}

            {/* LORE & WORLD WIKI TAB */}
            {activeTab === 'lore' && (
              <div className="lore-explorer-view">
                <div className="lore-places-tabs">
                  {(BOOK_LORE[bookId || 'book_lotr'] || BOOK_LORE['book_lotr']).map(entity => (
                    <button
                      key={entity.id}
                      className={`btn-lore-tab ${selectedEntity.id === entity.id ? 'active' : ''}`}
                      onClick={() => {
                        soundFX.playPop();
                        setSelectedEntity(entity);
                      }}
                    >
                      {entity.type === 'character' ? '👤' : entity.type === 'location' ? '📍' : '✨'} {entity.name}
                    </button>
                  ))}
                </div>

                <div className="lore-detail-card">
                  <div className="lore-detail-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={selectedEntity.avatarUrl} alt={selectedEntity.name} className="lore-ext-avatar" />
                      <div>
                        <h5>{selectedEntity.name}</h5>
                        <span className="lore-ext-title">{selectedEntity.title}</span>
                      </div>
                    </div>

                    <div className="lore-ext-badges">
                      <span className="realm-tag">📍 {selectedEntity.factionOrRealm}</span>
                      <span className="spoiler-safe-tag">
                        <ShieldCheck size={12} color="#00ff88" /> Chapter {selectedEntity.spoilerSafeChapter}+
                      </span>
                    </div>
                  </div>

                  <p className="lore-desc">{selectedEntity.summary}</p>
                  {selectedEntity.keyQuote && (
                    <blockquote className="lore-quote">{selectedEntity.keyQuote}</blockquote>
                  )}

                  {selectedEntity.allies.length > 0 && (
                    <div className="lore-ext-allies-row">
                      <span className="allies-label">Key Allies:</span>
                      {selectedEntity.allies.map(a => (
                        <span key={a} className="ext-ally-pill">{a}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TRIVIA TAB */}
            {activeTab === 'trivia' && (
              <div className="trivia-quiz-view">
                <div className="trivia-score-header">
                  <div className="score-pill">
                    <Award size={14} color="#ffd700" />
                    <span>Your Reader Score: <strong>{triviaScore} XP</strong></span>
                  </div>
                  <span className="trivia-level">Rank: Master Chronicler</span>
                </div>

                <div className="trivia-question-box">
                  <span className="trivia-q-num">Question of the Chapter</span>
                  <h4>{triviaQuestion.q}</h4>

                  <div className="trivia-options-list">
                    {triviaQuestion.options.map((opt, idx) => {
                      const isChosen = triviaAnswered === idx;
                      const isCorrect = idx === triviaQuestion.correctIdx;
                      let optionClass = '';
                      if (triviaAnswered !== null) {
                        if (isCorrect) optionClass = 'is-correct';
                        else if (isChosen) optionClass = 'is-wrong';
                      }

                      return (
                        <button
                          key={idx}
                          disabled={triviaAnswered !== null}
                          onClick={() => handleAnswerTrivia(idx)}
                          className={`trivia-option-btn ${optionClass}`}
                        >
                          <span className="trivia-letter">{String.fromCharCode(65 + idx)}.</span>
                          <span className="trivia-text">{opt}</span>
                          {triviaAnswered !== null && isCorrect && (
                            <Check size={16} className="icon-correct" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {triviaAnswered !== null && (
                    <div className="trivia-explanation-banner">
                      <strong>{triviaAnswered === triviaQuestion.correctIdx ? '🎉 Excellent Knowledge!' : '💡 Good Try!'}</strong>
                      <p>{triviaQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
