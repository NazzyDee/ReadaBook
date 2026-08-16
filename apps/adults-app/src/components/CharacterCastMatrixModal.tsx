import React, { useState } from 'react';
import { X, Theater, Mic, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';
import { MOCK_CAST_MATRIX, type CastMember } from '../lib/characterCastData';
import { soundFX } from '../lib/soundFx';

interface CharacterCastMatrixModalProps {
  onClose: () => void;
}

export const CharacterCastMatrixModal: React.FC<CharacterCastMatrixModalProps> = ({
  onClose
}) => {
  const [cast, setCast] = useState<CastMember[]>(MOCK_CAST_MATRIX);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleSpeaking = (castId: string) => {
    soundFX.playPop();
    setCast(prev =>
      prev.map(c => (c.id === castId ? { ...c, isSpeaking: !c.isSpeaking } : c))
    );
  };

  const handleSaveRoster = () => {
    soundFX.playApplause();
    setToastMessage('🎭 Character Cast Roster synchronized to live stream broadcast overlay!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="cast-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="cast-modal-header">
          <div className="cast-title-group">
            <div className="cast-badge">
              <Theater size={16} />
              <span>LIVE MULTI-VOICE DRAMATIC CAST MATRIX</span>
            </div>
            <h3>Character Voice Cast & Actor Roster</h3>
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

        <p className="cast-intro-text">
          Map book characters to co-streamers and squad members during multi-reader broadcasts. Active speakers illuminate in real time on the broadcast overlay so viewers know which character is speaking.
        </p>

        {/* Cast Grid */}
        <div className="cast-matrix-grid">
          {cast.map(member => (
            <div
              key={member.id}
              className={`cast-card-item ${member.isSpeaking ? 'speaking-now' : ''}`}
            >
              <div className="cast-card-top">
                <div className="actor-avatar-wrap">
                  <img src={member.assignedActorAvatar} alt={member.assignedActorName} className="actor-avatar" />
                  {member.isSpeaking && (
                    <span className="live-actor-mic-badge" title="Microphone Active">
                      <Mic size={12} color="var(--accent-success)" />
                    </span>
                  )}
                </div>

                <div className="character-heading">
                  <h4>{member.characterName}</h4>
                  <span className="character-role-tag">{member.characterTagline}</span>
                </div>

                <button
                  type="button"
                  className={`btn-test-speak ${member.isSpeaking ? 'active' : ''}`}
                  onClick={() => toggleSpeaking(member.id)}
                  title="Toggle Actor Speaking Indicator"
                >
                  <Mic size={14} />
                  <span>{member.isSpeaking ? 'Speaking' : 'Muted'}</span>
                </button>
              </div>

              <div className="cast-actor-details">
                <div className="assigned-to-row">
                  <UserCheck size={14} color="var(--accent-secondary)" />
                  <span>Voiced by: <strong>@{member.assignedActorName}</strong></span>
                </div>

                <div className="voice-style-row">
                  <span className="style-label">TIMBRE:</span>
                  <span className="style-val">{member.voiceStyle}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save Actions */}
        <div className="cast-modal-footer">
          <button
            type="button"
            className="btn-primary btn-save-cast"
            onClick={handleSaveRoster}
          >
            <ShieldCheck size={16} />
            <span>Sync Cast Roster to Stream Overlay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
