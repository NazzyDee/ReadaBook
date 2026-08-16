import React, { useState } from 'react';
import {
  X,
  Hand,
  Mic,
  Users,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { INITIAL_STAGE_QUEUE, type StageSpeakerRequest } from '../lib/stageQueueData';
import { soundFX } from '../lib/soundFx';

interface BookClubStageModalProps {
  isBroadcaster?: boolean;
  activeSpeaker: StageSpeakerRequest | null;
  onBringSpeakerOnAir: (req: StageSpeakerRequest) => void;
  onClose: () => void;
}

export const BookClubStageModal: React.FC<BookClubStageModalProps> = ({
  isBroadcaster = true,
  activeSpeaker,
  onBringSpeakerOnAir,
  onClose
}) => {
  const [queue, setQueue] = useState<StageSpeakerRequest[]>(INITIAL_STAGE_QUEUE);
  const [allowHands, setAllowHands] = useState(true);
  const [userQuestion, setUserQuestion] = useState('');
  const [userSubmitted, setUserSubmitted] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSubmitHand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    soundFX.playChestClaim();

    const newReq: StageSpeakerRequest = {
      id: `req_${Date.now()}`,
      username: 'You',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      badge: 'Subscriber • Chapter 2',
      questionTopic: userQuestion.trim(),
      raisedAt: 'Just now',
      status: 'queued',
      micMuted: false,
      timeRemainingSecs: 60
    };

    setQueue([...queue, newReq]);
    setUserSubmitted(true);
    setToastMsg('Your hand has been raised! The host will bring you up shortly.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleBringOnAir = (req: StageSpeakerRequest) => {
    soundFX.playPop();
    setQueue(prev => prev.filter(r => r.id !== req.id));
    onBringSpeakerOnAir(req);
    onClose();
  };

  const handleDismissRequest = (id: string) => {
    soundFX.playPop();
    setQueue(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="modal-backdrop">
      <div className="book-club-stage-modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <Hand size={20} color="var(--accent-secondary)" />
            <div>
              <h3>Interactive Book Club Discussion Stage</h3>
              <span className="modal-subtitle">Audience voice Q&A queue & speaker hand-off</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {toastMsg && (
          <div className="stage-toast">
            <CheckCircle2 size={15} color="#00ff88" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Currently On Air Header (If anyone speaking) */}
        {activeSpeaker && (
          <div className="currently-speaking-banner">
            <div className="speaking-left">
              <span className="live-dot-pulse"></span>
              <strong>{activeSpeaker.username} is currently on air</strong>
            </div>
            <span className="speaking-topic">"{activeSpeaker.questionTopic}"</span>
          </div>
        )}

        {/* View Mode: Broadcaster Queue OR Audience Raise Hand */}
        {isBroadcaster ? (
          <div className="stage-queue-section">
            <div className="stage-queue-header">
              <div className="queue-count">
                <Users size={15} />
                <strong>Audience Hands Raised ({queue.length})</strong>
              </div>
              <label className="toggle-hands-label">
                <input
                  type="checkbox"
                  checked={allowHands}
                  onChange={e => setAllowHands(e.target.checked)}
                />
                <span>Allow New Hands</span>
              </label>
            </div>

            {queue.length === 0 ? (
              <div className="empty-stage-queue">
                <p>No audience hands currently raised. Viewers will appear here when they ask to speak.</p>
              </div>
            ) : (
              <div className="stage-requests-list">
                {queue.map(req => (
                  <div key={req.id} className="stage-request-row">
                    <img src={req.avatarUrl} alt={req.username} className="stage-req-avatar" />
                    <div className="stage-req-body">
                      <div className="req-name-row">
                        <strong>{req.username}</strong>
                        <span className="req-badge">{req.badge}</span>
                        <span className="req-time">{req.raisedAt}</span>
                      </div>
                      <p className="req-topic">"{req.questionTopic}"</p>
                    </div>

                    <div className="stage-req-actions">
                      <button
                        type="button"
                        onClick={() => handleBringOnAir(req)}
                        className="btn-bring-on-air"
                        title="Grant 60s live voice mic"
                      >
                        <Mic size={14} />
                        <span>Grant 60s Mic</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDismissRequest(req.id)}
                        className="btn-dismiss-req"
                        title="Dismiss request"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="audience-raise-hand-section">
            {!userSubmitted ? (
              <form onSubmit={handleSubmitHand} className="raise-hand-form">
                <label className="section-label">What question or literary topic would you like to discuss?</label>
                <textarea
                  rows={3}
                  value={userQuestion}
                  onChange={e => setUserQuestion(e.target.value)}
                  placeholder="e.g. I wanted to ask about the symbolism of the ring in Chapter 2..."
                  className="raise-hand-textarea"
                />
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                  <Hand size={16} />
                  <span>Raise Hand to Speak</span>
                </button>
              </form>
            ) : (
              <div className="hand-submitted-card">
                <CheckCircle2 size={32} color="#00ff88" />
                <h4>You are in the Stage Queue!</h4>
                <p>The broadcaster can see your question. When called on air, your microphone will activate for 60 seconds.</p>
                <button
                  type="button"
                  onClick={() => setUserSubmitted(false)}
                  className="btn-secondary"
                >
                  Lower Hand
                </button>
              </div>
            )}
          </div>
        )}

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-secondary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
