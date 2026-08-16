import React, { useState } from 'react';
import { X, Activity, Sparkles, Zap } from 'lucide-react';
import { CHAPTER_SENTIMENT_TIMELINE, type SentimentDataPoint } from '../lib/readerSentimentData';
import { soundFX } from '../lib/soundFx';

interface ReaderSentimentHeatmapModalProps {
  streamerName: string;
  onClose: () => void;
}

export const ReaderSentimentHeatmapModal: React.FC<ReaderSentimentHeatmapModalProps> = ({
  streamerName,
  onClose
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('ALL');
  const [points, setPoints] = useState<SentimentDataPoint[]>(CHAPTER_SENTIMENT_TIMELINE);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredPoints = selectedEmotion === 'ALL'
    ? points
    : points.filter(p => p.emotion === selectedEmotion);

  const handlePulseReaction = (emoji: string) => {
    soundFX.playPop();
    soundFX.playChestClaim();
    setToastMsg(`💖 Pulsed live emotion reaction ${emoji} to the stream overlay!`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleTriggerHypeSpike = () => {
    soundFX.playChestClaim();
    soundFX.playApplause();
    const newPoint: SentimentDataPoint = {
      chapterMinute: 30,
      emotion: 'EPIC',
      intensity: 95,
      chatEmojiSpike: '⚡ (650 reactions)',
      keyPlotEvent: 'Live Community Climax Reaction Peak recorded!'
    };
    setPoints(prev => [...prev, newPoint]);
    setToastMsg('🔥 CLIMAX SPIKE: Dramatic peak logged on narrator telemetry HUD!');
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="sentiment-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sentiment-modal-header">
          <div className="sentiment-title-group">
            <div className="sentiment-badge">
              <Activity size={16} />
              <span>LIVE CHAPTER SENTIMENT & AUDIENCE EMOTION HEATMAP</span>
            </div>
            <h3>@{streamerName}'s Narrative Heartbeat HUD</h3>
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

        {/* Emotion Filter Tabs */}
        <div className="emotion-filter-tabs">
          {['ALL', 'TENSION', 'JOY', 'SORROW', 'MYSTERY', 'EPIC'].map(emo => (
            <button
              key={emo}
              type="button"
              className={`emotion-tab-btn ${selectedEmotion === emo ? 'active' : ''}`}
              onClick={() => {
                soundFX.playPop();
                setSelectedEmotion(emo);
              }}
            >
              {emo}
            </button>
          ))}
        </div>

        {/* Intensity Heatmap Visualizer */}
        <div className="sentiment-graph-card">
          <div className="graph-header">
            <label>NARRATIVE TENSION & CHAT REACTION SPIKES (OVER TIME):</label>
            <span className="live-pulse-badge">🔴 REAL-TIME TELEMETRY</span>
          </div>

          <div className="graph-bars-row">
            {filteredPoints.map((pt, i) => {
              const color = pt.emotion === 'EPIC' ? '#ff3b3b' : pt.emotion === 'TENSION' ? '#ffd700' : pt.emotion === 'JOY' ? '#00ff88' : '#00b4d8';
              return (
                <div key={i} className="graph-bar-col">
                  <div className="bar-val-label">{pt.intensity}%</div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ height: `${pt.intensity}%`, backgroundColor: color }}
                    ></div>
                  </div>
                  <span className="bar-time-label">Min {pt.chapterMinute}</span>
                  <span className="bar-emoji-label">{pt.chatEmojiSpike.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Plot Emotion Event Log */}
        <div className="sentiment-events-list">
          <label>DRAMATIC MOMENTS & REACTION LOG:</label>
          <div className="events-grid">
            {filteredPoints.map((pt, i) => (
              <div key={i} className="event-log-card">
                <div className="event-top-row">
                  <span className="min-badge">Minute {pt.chapterMinute}</span>
                  <span className="spike-pill">{pt.chatEmojiSpike}</span>
                </div>
                <p className="event-desc">{pt.keyPlotEvent}</p>
                <span className="emotion-tag">{pt.emotion}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Broadcaster Quick Pulse Bar */}
        <div className="sentiment-footer-bar">
          <div className="quick-emojis-group">
            <span>Send Emotion Pulse:</span>
            {['😱', '🔥', '😭', '🧙‍♂️', '🍺'].map(emoji => (
              <button
                key={emoji}
                type="button"
                className="btn-quick-pulse"
                onClick={() => handlePulseReaction(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn-record-climax"
            onClick={handleTriggerHypeSpike}
          >
            <Zap size={14} color="#ffd700" />
            <span>Mark Chapter Climax Peak</span>
          </button>
        </div>
      </div>
    </div>
  );
};
