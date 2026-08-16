import React, { useState } from 'react';
import { X, Activity, Wifi, Volume2, Video, CheckCircle2, Server, Gauge } from 'lucide-react';
import { MOCK_STREAM_HEALTH, type StreamHealthMetrics } from '../lib/streamHealthData';

interface StreamHealthModalProps {
  onClose: () => void;
}

export const StreamHealthModal: React.FC<StreamHealthModalProps> = ({
  onClose
}) => {
  const [health] = useState<StreamHealthMetrics>(MOCK_STREAM_HEALTH);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="health-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="health-modal-header">
          <div className="health-title-group">
            <div className="health-badge">
              <Activity size={16} />
              <span>LIVE BROADCAST HEALTH & LUFS AUDIO INSPECTOR</span>
            </div>
            <h3>Stream Telemetry & Audio Fidelity</h3>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Overall Status Banner */}
        <div className="health-status-banner">
          <div className="status-banner-left">
            <div className="pulse-indicator-healthy" />
            <div>
              <h4>Stream Status: {health.streamStatus}</h4>
              <p>Ingest server receiving high-bitrate video and pristine unclipped audio.</p>
            </div>
          </div>

          <span className="health-chip-ok">
            <CheckCircle2 size={14} />
            <span>0 Dropped Frames</span>
          </span>
        </div>

        {/* Telemetry Cards Grid */}
        <div className="health-metrics-grid">
          {/* Video Stream Card */}
          <div className="health-metric-card">
            <div className="metric-header">
              <Video size={16} color="var(--accent-primary)" />
              <strong>Video Encoding</strong>
            </div>
            <div className="metric-row">
              <span>Resolution & FPS:</span>
              <strong>{health.resolution}</strong>
            </div>
            <div className="metric-row">
              <span>Video Bitrate:</span>
              <strong>{health.videoBitrateKbps.toLocaleString()} kbps (Constant Bitrate)</strong>
            </div>
            <div className="metric-row">
              <span>Codec:</span>
              <span>{health.codec}</span>
            </div>
          </div>

          {/* Audio Fidelity Card */}
          <div className="health-metric-card">
            <div className="metric-header">
              <Volume2 size={16} color="var(--accent-secondary)" />
              <strong>Audio Loudness & Range (LUFS)</strong>
            </div>
            <div className="metric-row">
              <span>Integrated Loudness:</span>
              <strong className="lufs-value">{health.lufsLoudness} LUFS (Broadcast Target)</strong>
            </div>
            {/* Simulated LUFS Audio Meter Bar */}
            <div className="lufs-meter-bar">
              <div className="lufs-target-marker" style={{ left: '72%' }} title="Target -16 LUFS" />
              <div className="lufs-fill" style={{ width: '70%' }} />
            </div>
            <div className="metric-row">
              <span>Audio Bitrate:</span>
              <strong>{health.audioBitrateKbps} kbps Stereo (Opus / FLAC)</strong>
            </div>
            <div className="metric-row">
              <span>Dynamic Range:</span>
              <span>{health.dynamicRangeDb} dB (Natural Narration)</span>
            </div>
          </div>

          {/* Network Ingest Card */}
          <div className="health-metric-card">
            <div className="metric-header">
              <Wifi size={16} color="var(--accent-success)" />
              <strong>Ingest Latency & Network</strong>
            </div>
            <div className="metric-row">
              <span>Glass-to-Glass Latency:</span>
              <strong>{health.ingestLatencyMs} ms (Ultra-Low WebRTC)</strong>
            </div>
            <div className="metric-row">
              <span>Dropped Frames:</span>
              <strong>{health.droppedFramesPercent}% (Optimal)</strong>
            </div>
          </div>

          {/* Edge Server Card */}
          <div className="health-metric-card">
            <div className="metric-header">
              <Server size={16} color="#ffd700" />
              <strong>Edge CDN Route</strong>
            </div>
            <div className="metric-row">
              <span>Region:</span>
              <strong>{health.serverRegion}</strong>
            </div>
            <div className="metric-row">
              <span>Protocol:</span>
              <span>SRT / RTMP / WebRTC Fallback</span>
            </div>
          </div>
        </div>

        <div className="health-modal-footer">
          <div className="footer-tip">
            <Gauge size={14} color="var(--accent-secondary)" />
            <span>Target -16 to -14 LUFS integrated audio for maximum clarity across headphones and smart speakers.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
