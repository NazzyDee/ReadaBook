import React, { useState } from 'react';
import { SQUAD_STREAMS, type SquadStream } from '../lib/squadsData';
import { Users, Volume2, VolumeX, Radio, Grid } from 'lucide-react';
import { LiveChat, type ChatMsg } from '../components/LiveChat';
import { SquadMultiviewPlayer } from '../components/SquadMultiviewPlayer';
import { soundFX } from '../lib/soundFx';

export const SquadStreamPage: React.FC = () => {
  const [selectedSquad, setSelectedSquad] = useState<SquadStream>(SQUAD_STREAMS[0]);
  const [showMultiviewModal, setShowMultiviewModal] = useState(false);
  const [activePrimaryStreamer, setActivePrimaryStreamer] = useState<string>(
    selectedSquad.members[0].streamerId
  );
  const [squadMessages, setSquadMessages] = useState<ChatMsg[]>([
    {
      id: 'sm1',
      username: 'NovelEnthusiast',
      text: 'Gandalf voice vs Elrond voice is absolute perfection! BookWorm PogChamp',
      createdAt: new Date(),
      badges: ['sub3']
    },
    {
      id: 'sm2',
      username: 'TolkienScholar',
      text: 'Notice how the rhythm matches the original prose! NovelHype',
      createdAt: new Date(),
      badges: ['vip']
    },
    {
      id: 'sm3',
      username: 'LillyFan',
      text: 'Lilly reading Frodo is giving me chills TeaTime CozyFire',
      createdAt: new Date(),
      badges: ['sub6']
    }
  ]);

  const handleSendMessage = (text: string) => {
    const newMsg: ChatMsg = {
      id: `sm_${Date.now()}`,
      username: 'You',
      text,
      createdAt: new Date(),
      badges: ['sub1']
    };
    setSquadMessages(prev => [...prev, newMsg]);
  };

  const primaryMember = selectedSquad.members.find(m => m.streamerId === activePrimaryStreamer) || selectedSquad.members[0];

  return (
    <div className="squad-page-container">
      {/* Squad Header */}
      <div className="squad-header-bar">
        <div className="squad-header-left">
          <div className="squad-live-badge">
            <Radio size={14} className="pulse" />
            <span>SQUAD STREAM</span>
          </div>
          <h2>{selectedSquad.title}</h2>
          <span className="squad-book-tag">📖 {selectedSquad.bookTitle} by {selectedSquad.bookAuthor}</span>
        </div>

        <div className="squad-selector-dropdown">
          <button
            className="btn-primary btn-launch-multiview"
            onClick={() => {
              soundFX.playPop();
              setShowMultiviewModal(true);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '12px', padding: '6px 14px', fontSize: '0.85rem' }}
          >
            <Grid size={15} />
            <span>4-Way Multiview Grid</span>
          </button>

          <label>Select Squad:</label>
          <select
            value={selectedSquad.id}
            onChange={(e) => {
              const found = SQUAD_STREAMS.find(s => s.id === e.target.value);
              if (found) {
                setSelectedSquad(found);
                setActivePrimaryStreamer(found.members[0].streamerId);
              }
            }}
          >
            {SQUAD_STREAMS.map(sq => (
              <option key={sq.id} value={sq.id}>{sq.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Squad Grid Layout */}
      <div className="squad-layout-body">
        {/* Left: Video Multi-Grid */}
        <div className="squad-streams-grid-area">
          <div className={`squad-grid count-${selectedSquad.members.length}`}>
            {selectedSquad.members.map(member => {
              const isPrimary = member.streamerId === activePrimaryStreamer;

              return (
                <div
                  key={member.streamerId}
                  className={`squad-cell ${isPrimary ? 'is-primary-audio' : ''}`}
                  onClick={() => setActivePrimaryStreamer(member.streamerId)}
                >
                  <div className="squad-cell-video-sim">
                    <img src={member.avatarUrl} alt={member.streamerName} className="squad-member-avatar" />
                    <div className="squad-role-tag">{member.role}</div>
                  </div>

                  <div className="squad-cell-overlay-bottom">
                    <div className="squad-member-info">
                      <span className="squad-member-name">{member.streamerName}</span>
                      <span className="squad-cell-viewers">{(member.viewerCount / 1000).toFixed(1)}k watching</span>
                    </div>

                    <div className="squad-audio-indicator">
                      {isPrimary ? (
                        <div className="audio-active-badge">
                          <Volume2 size={14} />
                          <span>Primary Audio</span>
                        </div>
                      ) : (
                        <div className="audio-muted-badge">
                          <VolumeX size={14} />
                          <span>Click to Focus</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Squad Info Footer Banner */}
          <div className="squad-footer-banner">
            <div className="squad-banner-details">
              <h4>About this Squad Session</h4>
              <p>{selectedSquad.description}</p>
              <div className="squad-tags-row">
                {selectedSquad.tags.map(t => (
                  <span key={t} className="squad-tag-pill">#{t}</span>
                ))}
              </div>
            </div>

            <div className="squad-total-viewers">
              <Users size={16} />
              <span>{selectedSquad.totalViewers.toLocaleString()} Combined Viewers</span>
            </div>
          </div>
        </div>

        {/* Right: Squad Merged Chat */}
        <div className="squad-chat-container">
          <LiveChat
            streamId={selectedSquad.id}
            streamerName="The Squad"
            streamerId={primaryMember.streamerId}
            messages={squadMessages}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>

      {showMultiviewModal && (
        <SquadMultiviewPlayer
          onClose={() => setShowMultiviewModal(false)}
        />
      )}
    </div>
  );
};
