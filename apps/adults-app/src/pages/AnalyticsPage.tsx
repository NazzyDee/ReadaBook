import React, { useState } from 'react';
import { BarChart3, DollarSign, Users, Eye, MessageSquare, TrendingUp, Calendar } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const statsSummary = {
    avgViewers: 1420,
    peakViewers: 3180,
    hoursStreamed: 48.5,
    uniqueChatters: 4890,
    newFollowers: 1240,
    totalRevenue: 2840.50
  };

  const revenueBreakdown = [
    { label: 'Paid Subscriptions (Tier 1/2/3)', amount: 1650.00, pct: 58, color: '#9146ff' },
    { label: 'Bookworm Prime Subs', amount: 520.50, pct: 18, color: '#00e5ff' },
    { label: 'Book Sparks (Bits) Cheers', amount: 480.00, pct: 17, color: '#ffd700' },
    { label: 'Gift Sub Bonuses', amount: 190.00, pct: 7, color: '#ff7700' }
  ];

  const streamHistory = [
    { date: 'Aug 15', title: 'The Hobbit: Chapter 5 - Riddles in the Dark', viewers: 3180, hours: 3.5, sparks: 14500, subs: 28 },
    { date: 'Aug 13', title: 'Late Night Cozy Fantasy Reading & Hot Tea ☕', viewers: 2420, hours: 2.8, sparks: 8900, subs: 19 },
    { date: 'Aug 11', title: 'The Fellowship of the Ring: Table Read', viewers: 2890, hours: 4.1, sparks: 18200, subs: 34 },
    { date: 'Aug 09', title: 'Sci-Fi Sunday: Dune Book 1 Deep Dive', viewers: 1950, hours: 3.0, sparks: 6400, subs: 12 }
  ];

  return (
    <div className="analytics-page-container">
      {/* Header */}
      <div className="analytics-hero-header">
        <div className="analytics-title-left">
          <div className="analytics-badge">
            <BarChart3 size={15} />
            <span>CREATOR STUDIO ANALYTICS</span>
          </div>
          <h1>Channel Analytics & Revenue Summary</h1>
          <p>Track your audience engagement, viewer peaks, revenue breakdown, and literature broadcast performance.</p>
        </div>

        <div className="analytics-time-filter">
          <Calendar size={15} />
          <button
            className={`btn-time-pill ${timeRange === '7d' ? 'active' : ''}`}
            onClick={() => setTimeRange('7d')}
          >
            Last 7 Days
          </button>
          <button
            className={`btn-time-pill ${timeRange === '30d' ? 'active' : ''}`}
            onClick={() => setTimeRange('30d')}
          >
            Last 30 Days
          </button>
          <button
            className={`btn-time-pill ${timeRange === '90d' ? 'active' : ''}`}
            onClick={() => setTimeRange('90d')}
          >
            Last 90 Days
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="analytics-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-purple">
            <Users size={20} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-label">Average Viewers</span>
            <h3>{statsSummary.avgViewers.toLocaleString()}</h3>
            <span className="kpi-trend positive">
              <TrendingUp size={12} /> +14.8% vs last month
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-cyan">
            <Eye size={20} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-label">Peak Concurrent Viewers</span>
            <h3>{statsSummary.peakViewers.toLocaleString()}</h3>
            <span className="kpi-subtext">The Hobbit: Riddles in the Dark</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-gold">
            <DollarSign size={20} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-label">Estimated Revenue</span>
            <h3>${statsSummary.totalRevenue.toFixed(2)}</h3>
            <span className="kpi-trend positive">
              <TrendingUp size={12} /> +22.4% payout
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-orange">
            <MessageSquare size={20} />
          </div>
          <div className="kpi-meta">
            <span className="kpi-label">Unique Chatters</span>
            <h3>{statsSummary.uniqueChatters.toLocaleString()}</h3>
            <span className="kpi-subtext">89.2% chat engagement rate</span>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Revenue Breakdown + Stream History */}
      <div className="analytics-split-layout">
        {/* Left: Revenue Breakdown Card */}
        <div className="analytics-box-card">
          <div className="box-card-header">
            <DollarSign size={18} color="#ffd700" />
            <h3>Estimated Revenue Breakdown</h3>
          </div>

          <div className="revenue-breakdown-list">
            {revenueBreakdown.map(item => (
              <div key={item.label} className="revenue-item-row">
                <div className="rev-item-top">
                  <div className="rev-item-name">
                    <span className="rev-color-dot" style={{ background: item.color }} />
                    <span>{item.label}</span>
                  </div>
                  <span className="rev-item-amount">${item.amount.toFixed(2)}</span>
                </div>
                <div className="rev-bar-track">
                  <div className="rev-bar-fill" style={{ width: `${item.pct}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="revenue-payout-footer">
            <span>Next Payout Estimated: <strong>September 15, 2026</strong> via Direct Deposit</span>
          </div>
        </div>

        {/* Right: Broadcasts Performance Log */}
        <div className="analytics-box-card">
          <div className="box-card-header">
            <BarChart3 size={18} color="var(--accent-secondary)" />
            <h3>Recent Broadcasts Summary</h3>
          </div>

          <div className="stream-history-table">
            {streamHistory.map(st => (
              <div key={st.date} className="history-row-item">
                <div className="history-date-col">
                  <span className="hist-date">{st.date}</span>
                  <span className="hist-duration">{st.hours}h broadcast</span>
                </div>
                <div className="history-title-col">
                  <span className="hist-title">{st.title}</span>
                  <div className="hist-metrics-row">
                    <span>👥 {st.viewers.toLocaleString()} Peak</span>
                    <span>• ✨ {st.sparks.toLocaleString()} Sparks</span>
                    <span>• ⭐ +{st.subs} Subs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
