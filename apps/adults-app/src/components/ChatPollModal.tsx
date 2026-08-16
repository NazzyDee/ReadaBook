import React, { useState } from 'react';
import { X, BarChart2, Plus, Trash2 } from 'lucide-react';

export interface PollData {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  durationSeconds: number;
  endsAt: number;
  totalVotes: number;
}

interface ChatPollModalProps {
  onStartPoll: (poll: PollData) => void;
  onClose: () => void;
}

export const ChatPollModal: React.FC<ChatPollModalProps> = ({ onStartPoll, onClose }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>([
    'Keep reading Chapter 4! 📖',
    'Pause for chapter discussion & tea break ☕'
  ]);
  const [duration, setDuration] = useState<number>(120); // 2 mins

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const next = [...options];
    next[index] = val;
    setOptions(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const validOptions = options.filter(o => o.trim().length > 0);
    if (validOptions.length < 2) return;

    const newPoll: PollData = {
      id: `poll_${Date.now()}`,
      question: question.trim(),
      options: validOptions.map((text, idx) => ({
        id: `opt_${idx}`,
        text: text.trim(),
        votes: 0
      })),
      durationSeconds: duration,
      endsAt: Date.now() + duration * 1000,
      totalVotes: 0
    };

    onStartPoll(newPoll);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="poll-modal-card">
        <div className="modal-header">
          <div className="modal-title-row">
            <BarChart2 size={20} color="var(--accent-secondary)" />
            <h3>Create Live Stream Poll</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="poll-modal-form">
          <div className="form-group">
            <label>Poll Question <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
            <input
              type="text"
              placeholder="e.g. Should the protagonist open the locked door?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="poll-text-input"
              maxLength={120}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Poll Options (2-5)</label>
            <div className="poll-options-inputs-list">
              {options.map((opt, idx) => (
                <div key={idx} className="poll-opt-input-row">
                  <span className="opt-number">{idx + 1}.</span>
                  <input
                    type="text"
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className="poll-text-input"
                    maxLength={60}
                    required
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="btn-remove-opt"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 5 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="btn-add-opt-row"
              >
                <Plus size={14} />
                <span>Add Option</span>
              </button>
            )}
          </div>

          <div className="form-group">
            <label>Duration:</label>
            <div className="poll-duration-pills">
              {[
                { label: '1 Minute', val: 60 },
                { label: '2 Minutes', val: 120 },
                { label: '3 Minutes', val: 180 },
                { label: '5 Minutes', val: 300 }
              ].map(d => (
                <button
                  key={d.val}
                  type="button"
                  className={`duration-pill ${duration === d.val ? 'active' : ''}`}
                  onClick={() => setDuration(d.val)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <BarChart2 size={16} />
              <span>Start Poll</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
