import React, { useState } from 'react';
import { Sparkles, X, Check, RotateCcw, Clock } from 'lucide-react';
import { soundFX } from '../lib/soundFx';

export interface PendingRedemption {
  id: string;
  username: string;
  avatarUrl: string;
  rewardTitle: string;
  cost: number;
  icon: string;
  time: string;
  userInput?: string;
  status: 'pending' | 'completed' | 'refunded';
}

interface RedemptionsQueueModalProps {
  onClose: () => void;
}

export const RedemptionsQueueModal: React.FC<RedemptionsQueueModalProps> = ({ onClose }) => {
  const [redemptions, setRedemptions] = useState<PendingRedemption[]>([
    {
      id: 'red_1',
      username: 'BookWorm99',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rewardTitle: 'Take a Sip of Cozy Tea ☕',
      cost: 250,
      icon: '🍵',
      time: '2m ago',
      status: 'pending'
    },
    {
      id: 'red_2',
      username: 'ElessarReader',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      rewardTitle: 'Dramatic Character Voice Switch 🎭',
      cost: 1000,
      icon: '🎭',
      time: '5m ago',
      userInput: 'Please do the next paragraph in your Smaug voice!',
      status: 'pending'
    },
    {
      id: 'red_3',
      username: 'AuraReader',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      rewardTitle: 'Highlight Viewer Favorite Quote 📖',
      cost: 500,
      icon: '✨',
      time: '12m ago',
      userInput: '"Not all those who wander are lost."',
      status: 'completed'
    }
  ]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleComplete = (id: string, user: string) => {
    soundFX.playChestClaim();
    setRedemptions(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'completed' } : r))
    );
    setToastMsg(`Completed redemption for ${user}!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleRefund = (id: string, user: string, cost: number) => {
    soundFX.playPop();
    setRedemptions(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'refunded' } : r))
    );
    setToastMsg(`Refunded ${cost} tokens to ${user}.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const pendingList = redemptions.filter(r => r.status === 'pending');
  const completedList = redemptions.filter(r => r.status !== 'pending');

  return (
    <div className="modal-backdrop">
      <div className="redemptions-queue-modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <Sparkles size={20} color="#ffd700" />
            <h3>Channel Points Redemptions Queue</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {toastMsg && (
          <div className="redemptions-toast">
            <Check size={16} />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Pending Queue Section */}
        <div className="redemptions-section">
          <div className="section-sub-header">
            <h4>Pending Requests ({pendingList.length})</h4>
          </div>

          {pendingList.length === 0 ? (
            <div className="empty-redemptions-card">
              <Sparkles size={32} color="var(--text-muted)" />
              <p>No pending channel reward redemptions right now.</p>
            </div>
          ) : (
            <div className="redemptions-list">
              {pendingList.map(item => (
                <div key={item.id} className="redemption-card pending">
                  <img src={item.avatarUrl} alt={item.username} className="redemption-avatar" />

                  <div className="redemption-info">
                    <div className="redemption-top-row">
                      <span className="redemption-user">{item.username}</span>
                      <span className="redemption-time"><Clock size={11} /> {item.time}</span>
                    </div>

                    <div className="redemption-title-row">
                      <span className="red-icon">{item.icon}</span>
                      <strong className="red-title">{item.rewardTitle}</strong>
                      <span className="red-cost">({item.cost.toLocaleString()} tokens)</span>
                    </div>

                    {item.userInput && (
                      <div className="redemption-user-prompt">
                        <span>Viewer Note:</span>
                        <p>{item.userInput}</p>
                      </div>
                    )}
                  </div>

                  <div className="redemption-actions-col">
                    <button
                      onClick={() => handleComplete(item.id, item.username)}
                      className="btn-complete-redemption"
                      title="Complete / Approve"
                    >
                      <Check size={16} />
                      <span>Complete</span>
                    </button>
                    <button
                      onClick={() => handleRefund(item.id, item.username, item.cost)}
                      className="btn-refund-redemption"
                      title="Reject & Refund Tokens"
                    >
                      <RotateCcw size={14} />
                      <span>Refund</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed History Section */}
        {completedList.length > 0 && (
          <div className="redemptions-section" style={{ marginTop: '20px' }}>
            <div className="section-sub-header">
              <h4>Recent History ({completedList.length})</h4>
            </div>

            <div className="redemptions-list history">
              {completedList.map(item => (
                <div key={item.id} className={`redemption-card ${item.status}`}>
                  <span className="red-icon">{item.icon}</span>
                  <div className="redemption-info">
                    <span className="history-text">
                      <strong>{item.username}</strong> redeemed <strong>{item.rewardTitle}</strong>
                    </span>
                  </div>
                  <span className={`status-pill ${item.status}`}>
                    {item.status === 'completed' ? 'Completed' : 'Refunded'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
