import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Plus,
  Trash2,
  CheckCircle2,
  Sliders,
  Play,
  Activity
} from 'lucide-react';
import { DEFAULT_FOLEY_RULES, type FoleyTriggerRule, type FoleyEventLog, smartFoley } from '../lib/smartFoleyEngine';
import { soundFX } from '../lib/soundFx';

interface SmartFoleyStudioModalProps {
  isFoleyEnabled: boolean;
  onToggleFoley: (enabled: boolean) => void;
  onClose: () => void;
}

export const SmartFoleyStudioModal: React.FC<SmartFoleyStudioModalProps> = ({
  isFoleyEnabled,
  onToggleFoley,
  onClose
}) => {
  const [rules, setRules] = useState<FoleyTriggerRule[]>(DEFAULT_FOLEY_RULES);
  const [logs, setLogs] = useState<FoleyEventLog[]>(smartFoley.getLogs());
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedSoundType, setSelectedSoundType] = useState('thunder');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    return smartFoley.subscribe(newLogs => setLogs(newLogs));
  }, []);

  const handleTestSound = (rule: FoleyTriggerRule) => {
    soundFX.playPop();
    rule.play();
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    soundFX.playChestClaim();

    let playFn = () => soundFX.playThunder();
    let name = 'Thunderstorm';
    let icon = '⚡';

    if (selectedSoundType === 'dragon') {
      playFn = () => soundFX.playDragonRoar();
      name = 'Dragon Roar';
      icon = '🐉';
    } else if (selectedSoundType === 'harp') {
      playFn = () => soundFX.playHarp();
      name = 'Elven Harp';
      icon = '🎶';
    } else if (selectedSoundType === 'pages') {
      playFn = () => soundFX.playPageRustle();
      name = 'Page Rustle';
      icon = '📖';
    }

    const newRule: FoleyTriggerRule = {
      id: `rule_${Date.now()}`,
      keyword: newKeyword.trim().toLowerCase(),
      soundName: name,
      icon: icon,
      play: playFn,
      description: `Auto-triggers on "${newKeyword.trim()}"`
    };

    setRules([...rules, newRule]);
    setNewKeyword('');
    setToastMsg(`Added Smart Foley trigger for "${newRule.keyword}"!`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleDeleteRule = (id: string) => {
    soundFX.playPop();
    setRules(rules.filter(r => r.id !== id));
  };

  return (
    <div className="modal-backdrop">
      <div className="smart-foley-modal-card">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <Zap size={22} color="#ffd700" />
            <div>
              <h3>Smart Foley & Auto Sound-FX Engine</h3>
              <span className="modal-subtitle">Auto-triggers synthesized audio effects from teleprompter words</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {toastMsg && (
          <div className="foley-toast">
            <CheckCircle2 size={15} color="#00ff88" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Master Switch Banner */}
        <div className={`foley-master-banner ${isFoleyEnabled ? 'active' : 'paused'}`}>
          <div className="master-left">
            <span className={`foley-indicator-dot ${isFoleyEnabled ? 'pulse' : ''}`}></span>
            <div>
              <strong>Auto Foley AI Recognition: {isFoleyEnabled ? 'ACTIVATED' : 'PAUSED'}</strong>
              <p>When you read paragraphs aloud, matching sound effects will play seamlessly with your voice.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundFX.playPop();
              onToggleFoley(!isFoleyEnabled);
            }}
            className={`btn-toggle-foley ${isFoleyEnabled ? 'enabled' : 'disabled'}`}
          >
            {isFoleyEnabled ? 'Turn OFF' : 'Turn ON'}
          </button>
        </div>

        <div className="foley-studio-columns">
          {/* Left Column: Active Rules */}
          <div className="foley-rules-column">
            <label className="section-label">
              <Sliders size={13} /> Active Foley Trigger Keywords ({rules.length}):
            </label>

            <div className="foley-rules-list">
              {rules.map(rule => (
                <div key={rule.id} className="foley-rule-card">
                  <span className="rule-icon">{rule.icon}</span>
                  <div className="rule-info">
                    <strong>"{rule.keyword}"</strong>
                    <span>➔ {rule.soundName}</span>
                  </div>
                  <div className="rule-actions">
                    <button
                      type="button"
                      onClick={() => handleTestSound(rule)}
                      className="btn-test-sound"
                      title="Preview sound effect"
                    >
                      <Play size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="btn-del-sound"
                      title="Delete trigger"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Trigger Form */}
            <form onSubmit={handleAddRule} className="add-foley-form">
              <input
                type="text"
                placeholder="New word (e.g. lightning)..."
                value={newKeyword}
                onChange={e => setNewKeyword(e.target.value)}
                className="foley-keyword-input"
              />
              <select
                value={selectedSoundType}
                onChange={e => setSelectedSoundType(e.target.value)}
                className="foley-select"
              >
                <option value="thunder">⚡ Thunder</option>
                <option value="dragon">🐉 Dragon Roar</option>
                <option value="harp">🎶 Elven Harp</option>
                <option value="pages">📖 Page Rustle</option>
              </select>
              <button type="submit" className="btn-add-foley">
                <Plus size={14} /> Add
              </button>
            </form>
          </div>

          {/* Right Column: Live Detection Event Log */}
          <div className="foley-logs-column">
            <label className="section-label">
              <Activity size={13} color="#00ff88" /> Live Detection Log ({logs.length}):
            </label>

            {logs.length === 0 ? (
              <div className="empty-foley-logs">
                <p>No audio triggers fired yet. As you advance through the book, detected sound events will appear here in real-time.</p>
              </div>
            ) : (
              <div className="foley-logs-scroll">
                {logs.map(log => (
                  <div key={log.id} className="foley-log-item">
                    <div className="log-top">
                      <span className="log-tag">Triggered: <strong>{log.soundName}</strong></span>
                      <span className="log-time">{log.timestamp}</span>
                    </div>
                    <p className="log-snippet">"{log.snippet}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-primary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
