import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  DollarSign,
  BookOpen,
  Clock,
  Users,
  Award,
  CheckCircle2,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { MOCK_CREATOR_INSIGHTS, type CreatorInsightsReport } from '../lib/analyticsData';
import { soundFX } from '../lib/soundFx';

interface CreatorAnalyticsModalProps {
  onClose: () => void;
}

export const CreatorAnalyticsModal: React.FC<CreatorAnalyticsModalProps> = ({ onClose }) => {
  const [data] = useState<CreatorInsightsReport>(MOCK_CREATOR_INSIGHTS);
  const [activeTab, setActiveTab] = useState<'retention' | 'sales' | 'sprints' | 'audio'>('retention');
  const [payoutSuccess, setPayoutSuccess] = useState<string | null>(null);

  const handleRequestPayout = () => {
    soundFX.playChestClaim();
    setPayoutSuccess(`$${data.totalAffiliateEarnings.toFixed(2)} requested! Payout will transfer via Stripe / Direct Deposit within 24 hours.`);
  };

  return (
    <div className="modal-backdrop">
      <div className="analytics-modal-card">
        {/* Header */}
        <div className="analytics-modal-header">
          <div className="analytics-title-row">
            <BarChart2 size={24} color="#00e5ff" />
            <div>
              <h3>📊 Creator & Publisher Insights 2.0</h3>
              <span className="modal-subtitle">Real-time audience retention, affiliate book revenue, and literary telemetry</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Top 4 KPI Metrics Grid */}
        <div className="analytics-kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon-wrap" style={{ background: 'rgba(0, 229, 255, 0.12)', color: '#00e5ff' }}>
              <Users size={18} />
            </div>
            <div>
              <span className="kpi-lbl">Unique Listeners</span>
              <strong className="kpi-val">{data.totalUniqueListeners.toLocaleString()}</strong>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap" style={{ background: 'rgba(0, 255, 136, 0.12)', color: '#00ff88' }}>
              <DollarSign size={18} />
            </div>
            <div>
              <span className="kpi-lbl">Affiliate Commission (10%)</span>
              <strong className="kpi-val" style={{ color: '#00ff88' }}>${data.totalAffiliateEarnings.toFixed(2)}</strong>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap" style={{ background: 'rgba(255, 215, 0, 0.12)', color: '#ffd700' }}>
              <BookOpen size={18} />
            </div>
            <div>
              <span className="kpi-lbl">Pages Streamed</span>
              <strong className="kpi-val">{data.totalPagesStreamed.toLocaleString()}</strong>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap" style={{ background: 'rgba(255, 71, 126, 0.12)', color: '#ff477e' }}>
              <Clock size={18} />
            </div>
            <div>
              <span className="kpi-lbl">Community Focus Mins</span>
              <strong className="kpi-val">{data.sprintMinutesLogged.toLocaleString()}m</strong>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="analytics-tabs-row">
          <button
            type="button"
            onClick={() => {
              soundFX.playPop();
              setActiveTab('retention');
            }}
            className={`analytics-tab-btn ${activeTab === 'retention' ? 'active' : ''}`}
          >
            <TrendingUp size={14} />
            <span>Chapter Retention Heatmap</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playPop();
              setActiveTab('sales');
            }}
            className={`analytics-tab-btn ${activeTab === 'sales' ? 'active' : ''}`}
          >
            <DollarSign size={14} />
            <span>Book Sales & Commissions</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.playPop();
              setActiveTab('sprints');
            }}
            className={`analytics-tab-btn ${activeTab === 'sprints' ? 'active' : ''}`}
          >
            <Clock size={14} />
            <span>Reading Sprints & Club Stats</span>
          </button>
        </div>

        {/* TAB 1: CHAPTER RETENTION HEATMAP */}
        {activeTab === 'retention' && (
          <div className="analytics-tab-content">
            <div className="content-intro-row">
              <div>
                <h4>Audience Chapter Drop-off & Re-read Heatmap</h4>
                <p>Track which chapters retain the most live viewers and where listeners rewind for dramatic dialogue.</p>
              </div>
              <span className="retention-benchmark-tag">Avg. 94.2% Completion Rate</span>
            </div>

            <div className="retention-bars-list">
              {data.chapterRetention.map(ch => (
                <div key={ch.chapterNumber} className="retention-chapter-row">
                  <div className="ch-meta">
                    <span className="ch-num">Ch. {ch.chapterNumber}</span>
                    <strong className="ch-title">{ch.chapterTitle}</strong>
                  </div>

                  <div className="ch-track-wrapper">
                    <div className="ch-bar-track">
                      <div
                        className="ch-bar-fill"
                        style={{
                          width: `${ch.retentionPercent}%`,
                          background: ch.retentionPercent >= 95 ? '#00ff88' : ch.retentionPercent >= 90 ? 'var(--accent-secondary)' : '#ffd700'
                        }}
                      />
                    </div>
                    <span className="ch-pct">{ch.retentionPercent}%</span>
                  </div>

                  <div className="ch-spikes-badge" title="Audience DVR rewind hotspots">
                    <span>🔁 {ch.rewindSpikesCount} Rewinds</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: BOOK SALES & COMMISSIONS */}
        {activeTab === 'sales' && (
          <div className="analytics-tab-content">
            {payoutSuccess && (
              <div className="payout-banner">
                <CheckCircle2 size={16} color="#00ff88" />
                <span>{payoutSuccess}</span>
              </div>
            )}

            <div className="content-intro-row">
              <div>
                <h4>Direct Book Sales & 10% Creator Affiliate Earnings</h4>
                <p>Revenue generated from in-stream book recommendations across physical, digital, and audiobook formats.</p>
              </div>
              <button
                type="button"
                onClick={handleRequestPayout}
                className="btn-payout-now"
              >
                <Sparkles size={14} />
                <span>Request Payout (${data.totalAffiliateEarnings.toFixed(2)})</span>
              </button>
            </div>

            <div className="sales-table-wrapper">
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Format & Edition</th>
                    <th>Store Source</th>
                    <th>Units Sold</th>
                    <th>Gross Sales</th>
                    <th>Your Commission (10%)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.bookSales.map((s, idx) => (
                    <tr key={idx}>
                      <td><strong>{s.format}</strong></td>
                      <td><span className="store-tag">{s.storeSource}</span></td>
                      <td>{s.unitsSold}</td>
                      <td>${s.grossRevenue.toFixed(2)}</td>
                      <td style={{ color: '#00ff88', fontWeight: 'bold' }}>+${s.creatorCommission.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: READING SPRINTS & COMMUNITY STATS */}
        {activeTab === 'sprints' && (
          <div className="analytics-tab-content">
            <div className="content-intro-row">
              <div>
                <h4>Community Reading Club & Sprint Champions</h4>
                <p>Audience members who logged the most focus reading pages during your live streams.</p>
              </div>
              <span className="retention-benchmark-tag">Total Pages Read: {data.communityPagesLogged.toLocaleString()}</span>
            </div>

            <div className="top-readers-grid">
              {data.topAudienceReaders.map((r, idx) => (
                <div key={r.username} className="reader-kpi-card">
                  <div className="reader-rank-badge">#{idx + 1}</div>
                  <img src={r.avatarUrl} alt={r.username} className="reader-avatar" />
                  <div className="reader-info">
                    <strong>{r.username}</strong>
                    <span>{r.pagesRead} Pages Logged • {r.sprintsCompleted} Sprints</span>
                  </div>
                  <Award size={18} color="#ffd700" style={{ marginLeft: 'auto' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-primary">
            Close Insights
          </button>
        </div>
      </div>
    </div>
  );
};
