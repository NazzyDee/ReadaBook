import React, { useState } from 'react';
import {
  X,
  Bot,
  Sparkles,
  Send,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { queryChroniclerAI, type ChroniclerResponse } from '../lib/chroniclerAI';
import { soundFX } from '../lib/soundFx';

interface ChroniclerOracleModalProps {
  onClose: () => void;
  onSendToChat?: (msg: string) => void;
}

export const ChroniclerOracleModal: React.FC<ChroniclerOracleModalProps> = ({
  onClose,
  onSendToChat
}) => {
  const [queryInput, setQueryInput] = useState('');
  const [history, setHistory] = useState<ChroniclerResponse[]>([
    queryChroniclerAI('aragorn')
  ]);
  const [isCopied, setIsCopied] = useState(false);

  const handleSearch = (text: string) => {
    if (!text.trim()) return;
    soundFX.playChestClaim();
    const result = queryChroniclerAI(text);
    setHistory([result, ...history]);
    setQueryInput('');
  };

  const handleCopyResponse = (body: string) => {
    navigator.clipboard.writeText(body);
    soundFX.playPop();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleBroadcastToChat = (text: string) => {
    soundFX.playChestClaim();
    if (onSendToChat) {
      onSendToChat(`🤖 [Chronicler AI]: ${text}`);
    }
  };

  const quickPrompts = [
    '📜 Generate Chapter 4 Recap',
    '👑 Tell me about Aragorn\'s lineage',
    '💎 What is Mithril?',
    '🔥 Who is the Balrog of Moria?'
  ];

  return (
    <div className="modal-backdrop">
      <div className="chronicler-modal-card">
        {/* Header */}
        <div className="chronicler-modal-header">
          <div className="chronicler-title-group">
            <Bot size={24} color="#ffd700" className="pulse-fast" />
            <div>
              <h3>🤖 The Chronicler AI (Live Literary Co-Host)</h3>
              <span className="modal-subtitle">Real-time Lore Oracle & Story Recap Assistant</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Live Status Bar */}
        <div className="chronicler-status-bar">
          <span className="ai-live-dot"></span>
          <span className="ai-status-text">
            <strong>Chronicler AI Co-Host Active:</strong> Monitoring live narration text & answering audience lore questions in real time.
          </span>
        </div>

        {/* Quick Prompt Pills */}
        <div className="quick-prompts-row">
          <span className="quick-lbl">
            <Sparkles size={12} color="#ffd700" /> Quick Inquiries:
          </span>
          <div className="quick-pills-list">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSearch(p)}
                className="btn-quick-prompt"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Search / Ask Input Form */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSearch(queryInput);
          }}
          className="chronicler-input-form"
        >
          <input
            type="text"
            value={queryInput}
            onChange={e => setQueryInput(e.target.value)}
            placeholder="Ask anything about characters, genealogy, world history, or plot recaps..."
            className="chronicler-search-input"
          />
          <button type="submit" className="btn-send-chronicler" title="Ask Chronicler AI">
            <Send size={16} />
          </button>
        </form>

        {/* Responses Stream */}
        <div className="chronicler-responses-stream">
          {history.map((resp, idx) => (
            <div key={idx} className="chronicler-response-card">
              <div className="resp-card-header">
                <h4>{resp.responseTitle}</h4>
                <div className="resp-card-actions">
                  <button
                    type="button"
                    onClick={() => handleCopyResponse(resp.body)}
                    className="btn-resp-action"
                    title="Copy to clipboard"
                  >
                    {isCopied ? <CheckCircle2 size={14} color="#00ff88" /> : <Copy size={14} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBroadcastToChat(resp.body)}
                    className="btn-share-chat"
                    title="Post to live stream chat"
                  >
                    Post to Chat
                  </button>
                </div>
              </div>

              <p className="resp-body-text">{resp.body}</p>

              {/* Tags & Follow-ups */}
              <div className="resp-footer-row">
                <div className="resp-tags">
                  {resp.tags.map((t, i) => (
                    <span key={i} className="resp-tag-pill">#{t}</span>
                  ))}
                </div>

                <div className="resp-followups">
                  {resp.suggestedFollowUps.map((f, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSearch(f)}
                      className="btn-followup-pill"
                    >
                      {f} ➔
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-primary">
            Close Oracle
          </button>
        </div>
      </div>
    </div>
  );
};
