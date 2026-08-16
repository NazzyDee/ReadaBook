import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/AuthContext';
import { usePoints } from '../lib/PointsContext';
import { parseMessageEmotes } from '../lib/emotesData';
import { soundFX } from '../lib/soundFx';
import { EmotePicker } from './EmotePicker';
import { BitsModal } from './BitsModal';
import { SubModal } from './SubModal';
import { ChannelPointsShop } from './ChannelPointsShop';
import { ChatSettingsModal, type ChatPreferences } from './ChatSettingsModal';
import { ChatRulesModal } from './ChatRulesModal';
import { ChannelLeaderboard } from './ChannelLeaderboard';
import { HypeTrainBanner } from './HypeTrainBanner';
import { ChatPollModal, type PollData } from './ChatPollModal';
import { PollBanner } from './PollBanner';
import { RaidModal } from './RaidModal';
import { ModViewModal } from './ModViewModal';
import { ShieldModeModal } from './ShieldModeModal';
import { UserChatCardModal } from './UserChatCardModal';
import { ChatIdentityModal, type UserChatIdentity } from './ChatIdentityModal';
import { SpoilerFirewallModal } from './SpoilerFirewallModal';
import { filterSpoilers } from '../lib/spoilerFilter';
import { queryChroniclerAI } from '../lib/chroniclerAI';
import { EMOTES } from '../lib/emotesData';
import {
  Send,
  Smile,
  Sparkles,
  Star,
  Pin,
  Settings,
  Shield,
  ShieldAlert,
  BarChart2,
  Radio,
  Flame,
  ChevronRight,
  Palette,
  AtSign,
  EyeOff
} from 'lucide-react';
import { type StreamerProfile } from '../lib/streamersData';

export interface ChatMsg {
  id: string;
  text: string;
  username: string;
  createdAt: any;
  type?: 'announcement' | 'normal' | 'cheer' | 'reward';
  bitsAmount?: number;
  badges?: ('broadcaster' | 'mod' | 'vip' | 'sub1' | 'sub3' | 'sub6' | 'sub12' | 'founder' | 'sparksTop')[];
  isHighlighted?: boolean;
}

interface LiveChatProps {
  streamId?: string;
  streamerName: string;
  streamerId?: string;
  messages: ChatMsg[];
  onSendMessage: (text: string) => void;
  onSendCheer?: (bits: number, message: string) => void;
  onDeleteMessage?: (id: string) => void;
  onClearChat?: () => void;
  onInitiateRaid?: (target: StreamerProfile) => void;
  emoteOnly?: boolean;
  pinnedMessage?: string | null;
  slowModeSeconds?: number;
}

export const LiveChat: React.FC<LiveChatProps> = ({
  streamerName,
  streamerId,
  messages,
  onSendMessage,
  onSendCheer,
  onDeleteMessage,
  onClearChat,
  onInitiateRaid,
  emoteOnly = false,
  pinnedMessage = null,
  slowModeSeconds = 0
}) => {
  const { user } = useAuth();
  const { points, bonusChestAvailable, claimBonusChest } = usePoints();

  const [inputText, setInputText] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [showEmotePicker, setShowEmotePicker] = useState(false);
  const [showBitsModal, setShowBitsModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showPointsShop, setShowPointsShop] = useState(false);
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showPollCreateModal, setShowPollCreateModal] = useState(false);
  const [showRaidModal, setShowRaidModal] = useState(false);
  const [showModViewModal, setShowModViewModal] = useState(false);
  const [showShieldModal, setShowShieldModal] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [showSpoilerModal, setShowSpoilerModal] = useState(false);
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [selectedUserCard, setSelectedUserCard] = useState<{ username: string; badges?: string[] } | null>(null);
  const [hypeTrainActive, setHypeTrainActive] = useState(true);

  // User Reading Progress Level (for Spoiler Firewall)
  const [userReadingLevel, setUserReadingLevel] = useState<number>(() => {
    const saved = localStorage.getItem('readabook_user_reading_level');
    return saved ? parseInt(saved, 10) : 2;
  });
  const [revealedSpoilerMsgIds, setRevealedSpoilerMsgIds] = useState<string[]>([]);

  // User Chat Identity (Name Color & Badges)
  const [userIdentity, setUserIdentity] = useState<UserChatIdentity>(() => {
    const saved = localStorage.getItem('readabook_user_identity');
    return saved ? JSON.parse(saved) : {
      nameColor: '#00e5ff',
      activeBadges: ['sub1', 'founder']
    };
  });

  // Active Poll
  const [activePoll, setActivePoll] = useState<PollData | null>(null);
  const [userVotedPollOpt, setUserVotedPollOpt] = useState<string | null>(null);

  // Chat Preferences
  const [chatPrefs, setChatPrefs] = useState<ChatPreferences>(() => {
    const saved = localStorage.getItem('readabook_chat_prefs');
    return saved ? JSON.parse(saved) : {
      showTimestamps: true,
      fontSize: 'medium',
      readableColors: true,
      animatedEmotes: true,
      soundAlerts: true
    };
  });

  // Slow mode cooldown & claim animation
  const [slowModeCooldown, setSlowModeCooldown] = useState(0);
  const [claimedChestAnim, setClaimedChestAnim] = useState<number | null>(null);
  const [hasAgreedRules, setHasAgreedRules] = useState(() => {
    return localStorage.getItem(`readabook_rules_${streamerName}`) === 'true';
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('readabook_chat_prefs', JSON.stringify(chatPrefs));
  }, [chatPrefs]);

  useEffect(() => {
    localStorage.setItem('readabook_user_identity', JSON.stringify(userIdentity));
  }, [userIdentity]);

  useEffect(() => {
    localStorage.setItem('readabook_user_reading_level', userReadingLevel.toString());
  }, [userReadingLevel]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Slow mode cooldown tick
  useEffect(() => {
    if (slowModeCooldown <= 0) return;
    const interval = setInterval(() => {
      setSlowModeCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [slowModeCooldown]);

  // Autocomplete suggestions (Emotes with : and Mentions with @)
  const emoteMatch = inputText.match(/:([a-zA-Z0-9_]{1,15})$/);
  const emoteQuery = emoteMatch ? emoteMatch[1].toLowerCase() : null;
  const filteredEmoteSuggestions = emoteQuery
    ? EMOTES.filter(e => e.code.toLowerCase().includes(emoteQuery)).slice(0, 5)
    : [];

  const mentionMatch = inputText.match(/@([a-zA-Z0-9_]{1,15})$/);
  const mentionQuery = mentionMatch ? mentionMatch[1].toLowerCase() : null;
  const uniqueChatters = Array.from(new Set(messages.map(m => m.username)));
  const filteredMentionSuggestions = mentionQuery
    ? uniqueChatters.filter(u => u.toLowerCase().includes(mentionQuery)).slice(0, 5)
    : [];

  const handleInsertEmote = (emoteCode: string) => {
    soundFX.playPop();
    const updated = inputText.replace(/:([a-zA-Z0-9_]{1,15})$/, `${emoteCode} `);
    setInputText(updated);
  };

  const handleInsertMention = (username: string) => {
    soundFX.playPop();
    const updated = inputText.replace(/@([a-zA-Z0-9_]{1,15})$/, `@${username} `);
    setInputText(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    // First time chatter rules check
    if (!hasAgreedRules) {
      setShowRulesModal(true);
      return;
    }

    if (slowModeCooldown > 0) return;

    const trimmed = inputText.trim();

    // Handle Slash Commands
    if (trimmed.startsWith('/spoiler')) {
      setShowSpoilerModal(true);
      setInputText('');
      return;
    }

    if (trimmed.startsWith('/color')) {
      const parts = trimmed.split(' ');
      if (parts[1]) {
        const hex = parts[1].startsWith('#') ? parts[1] : `#${parts[1]}`;
        setUserIdentity(prev => ({ ...prev, nameColor: hex }));
      } else {
        setShowIdentityModal(true);
      }
      setInputText('');
      return;
    }

    if (trimmed.startsWith('/identity')) {
      setShowIdentityModal(true);
      setInputText('');
      return;
    }

    if (trimmed.startsWith('/shield')) {
      setShowShieldModal(true);
      setInputText('');
      return;
    }

    if (trimmed.startsWith('/poll')) {
      setShowPollCreateModal(true);
      setInputText('');
      return;
    }

    if (trimmed.startsWith('/raid')) {
      setShowRaidModal(true);
      setInputText('');
      return;
    }

    if (trimmed.startsWith('/hype')) {
      setHypeTrainActive(true);
      soundFX.playCheer();
      setInputText('');
      return;
    }

    if (trimmed.startsWith('/clear')) {
      if (onClearChat) onClearChat();
      setInputText('');
      return;
    }

    if (trimmed.startsWith('/mod')) {
      setShowModViewModal(true);
      setInputText('');
      return;
    }

    if (chatPrefs.soundAlerts) {
      soundFX.playPop();
    }

    onSendMessage(trimmed);
    setInputText('');
    setShowEmotePicker(false);

    // AI Co-Host Chronicler Auto-Response
    if (trimmed.toLowerCase().includes('@chronicler')) {
      const query = trimmed.replace(/@chronicler/gi, '').trim() || 'recap';
      setTimeout(() => {
        soundFX.playChestClaim();
        const resp = queryChroniclerAI(query);
        onSendMessage(`🤖 [Chronicler AI]: ${resp.responseTitle} — ${resp.body}`);
      }, 700);
    }

    if (slowModeSeconds > 0) {
      setSlowModeCooldown(slowModeSeconds);
    }
  };

  const handleSelectEmote = (emoteCode: string) => {
    setInputText(prev => (prev ? `${prev} ${emoteCode} ` : `${emoteCode} `));
  };

  const handleClaimChest = () => {
    soundFX.playChestClaim();
    const bonus = claimBonusChest();
    if (bonus > 0) {
      setClaimedChestAnim(bonus);
      setTimeout(() => setClaimedChestAnim(null), 3000);
    }
  };

  const handleAcceptRules = () => {
    setHasAgreedRules(true);
    localStorage.setItem(`readabook_rules_${streamerName}`, 'true');
    setShowRulesModal(false);
  };

  const handleVotePoll = (optId: string) => {
    if (!activePoll) return;
    setUserVotedPollOpt(optId);
    setActivePoll({
      ...activePoll,
      totalVotes: activePoll.totalVotes + 1,
      options: activePoll.options.map(opt =>
        opt.id === optId ? { ...opt, votes: opt.votes + 1 } : opt
      )
    });
  };

  const renderBadges = (badges?: string[]) => {
    if (!badges || badges.length === 0) return null;
    return (
      <span className="chat-badge-group">
        {badges.map((b, idx) => {
          if (b === 'broadcaster') return <span key={idx} className="badge-pill badge-broadcaster" title="Broadcaster">🎥</span>;
          if (b === 'mod') return <span key={idx} className="badge-pill badge-mod" title="Moderator">⚔️</span>;
          if (b === 'vip') return <span key={idx} className="badge-pill badge-vip" title="VIP">💎</span>;
          if (b === 'sub1') return <span key={idx} className="badge-pill badge-sub" title="1-Month Subscriber">📗</span>;
          if (b === 'sub3') return <span key={idx} className="badge-pill badge-sub" title="3-Month Subscriber">📘</span>;
          if (b === 'sub6') return <span key={idx} className="badge-pill badge-sub" title="6-Month Subscriber">📕</span>;
          if (b === 'sub12') return <span key={idx} className="badge-pill badge-sub" title="1-Year Subscriber">👑</span>;
          if (b === 'founder') return <span key={idx} className="badge-pill badge-founder" title="Founder">⭐</span>;
          if (b === 'sparksTop') return <span key={idx} className="badge-pill badge-top-sparks" title="Top Sparks Cheerer">🏆</span>;
          return null;
        })}
      </span>
    );
  };

  if (collapsed) {
    return (
      <div className="twitch-chat-collapsed-bar" onClick={() => setCollapsed(false)}>
        <button className="btn-expand-chat" title="Expand Chat">
          <ChevronRight size={18} />
        </button>
        <span className="collapsed-chat-label">Expand Stream Chat</span>
      </div>
    );
  }

  return (
    <aside className={`twitch-chat-sidebar font-size-${chatPrefs.fontSize}`}>
      {/* Chat Header */}
      <div className="twitch-chat-header">
        <button
          onClick={() => setCollapsed(true)}
          className="btn-collapse-chat-left"
          title="Collapse Chat"
        >
          →
        </button>

        <div className="chat-header-title">
          <span>STREAM CHAT</span>
          {emoteOnly && <span className="chat-mode-badge">Emotes Only</span>}
          {slowModeSeconds > 0 && <span className="chat-mode-badge">Slow {slowModeSeconds}s</span>}
        </div>

        <div className="chat-header-actions">
          {/* Spoiler Firewall Level Toggle */}
          <button
            onClick={() => {
              soundFX.playPop();
              setShowSpoilerModal(true);
            }}
            className="btn-chat-spoiler-toggle"
            title={`Spoiler Firewall: Chapter ${userReadingLevel === 999 ? 'All Unmasked' : userReadingLevel}`}
          >
            <EyeOff size={14} color="#00ff88" />
            <span className="spoiler-level-chip">Ch.{userReadingLevel === 999 ? 'All' : userReadingLevel}</span>
          </button>

          {/* Shield Mode Trigger */}
          <button
            onClick={() => {
              soundFX.playPop();
              setShowShieldModal(true);
            }}
            className={`btn-chat-shield ${isShieldActive ? 'shield-active-glow' : ''}`}
            title="Twitch Shield Mode (Lockdown)"
          >
            <ShieldAlert size={15} color={isShieldActive ? "#ff3b3b" : "var(--accent-secondary)"} />
          </button>

          {/* Sub Button */}
          <button
            onClick={() => setShowSubModal(true)}
            className="btn-chat-header-sub"
            title="Subscribe or Gift Subs"
          >
            <Star size={14} fill="currentColor" />
            <span>Sub</span>
          </button>

          {/* Chat Settings Gear */}
          <button
            onClick={() => setShowChatSettings(true)}
            className="btn-chat-settings"
            title="Chat Settings"
          >
            <Settings size={15} />
          </button>
        </div>
      </div>

      {/* SHIELD MODE ACTIVE BANNER */}
      {isShieldActive && (
        <div className="twitch-shield-active-banner">
          <div className="shield-banner-content">
            <ShieldAlert size={16} className="pulse-fast" />
            <span>SHIELD MODE ACTIVE • Sub-Only & Max Filters</span>
          </div>
          <button onClick={() => setIsShieldActive(false)} className="btn-quick-shield-off">
            Turn Off
          </button>
        </div>
      )}

      {/* Twitch Hype Train Progress Banner */}
      {hypeTrainActive && (
        <HypeTrainBanner
          isActive={hypeTrainActive}
          onClose={() => setHypeTrainActive(false)}
        />
      )}

      {/* Top 3 Sparks & Gift Sub Leaders */}
      <ChannelLeaderboard />

      {/* Active Live Poll Banner */}
      {activePoll && (
        <PollBanner
          poll={activePoll}
          onVote={handleVotePoll}
          onDismiss={() => setActivePoll(null)}
          userVotedOptionId={userVotedPollOpt}
        />
      )}

      {/* Pinned Message */}
      {pinnedMessage && (
        <div className="twitch-chat-pinned-banner">
          <Pin size={14} className="pinned-icon" />
          <div className="pinned-content">
            <span className="pinned-label">Pinned Message</span>
            <p className="pinned-text">{pinnedMessage}</p>
          </div>
        </div>
      )}

      {/* Messages Feed */}
      <div className="twitch-chat-messages-scroll">
        <div className="chat-welcome-banner">
          <p>Welcome to <strong>{streamerName}</strong>'s reading room! Discuss the chapter, share favorite quotes, and be kind to fellow readers.</p>
        </div>

        {messages.map(msg => {
          const parsedTokens = parseMessageEmotes(msg.text);
          const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const isMe = msg.username === 'You' || msg.username === user?.displayName;
          const isMentioned = !isMe && (
            msg.text.toLowerCase().includes('@' + (user?.displayName || 'you').toLowerCase()) ||
            msg.text.includes('@You')
          );
          const spoilerCheck = filterSpoilers(msg.text, 2, userReadingLevel);
          const isSpoilerMasked = spoilerCheck.hasSpoiler && !revealedSpoilerMsgIds.includes(msg.id) && !isMe;

          return (
            <div
              key={msg.id}
              className={`twitch-chat-msg-row ${msg.type === 'announcement' ? 'is-announcement' : ''} ${msg.type === 'cheer' ? 'is-cheer' : ''} ${msg.isHighlighted || isMentioned ? 'is-highlighted' : ''}`}
            >
              {chatPrefs.showTimestamps && (
                <span className="chat-timestamp">{timeString}</span>
              )}

              {renderBadges(msg.badges)}

              <span
                className={`chat-author-name clickable ${chatPrefs.readableColors ? 'readable' : ''}`}
                style={isMe && userIdentity.nameColor ? { color: userIdentity.nameColor } : undefined}
                onClick={() => {
                  soundFX.playPop();
                  setSelectedUserCard({ username: msg.username, badges: msg.badges });
                }}
                title="View user card & mod options"
              >
                {msg.username}:{' '}
              </span>

              <span className="chat-msg-body">
                {isSpoilerMasked ? (
                  <span
                    className="spoiler-masked-pill"
                    onClick={() => {
                      soundFX.playPop();
                      setRevealedSpoilerMsgIds(prev => [...prev, msg.id]);
                    }}
                    title="Click to reveal spoiler"
                  >
                    ⚠️ Chapter {spoilerCheck.spoilerChapter}+ Spoiler (Click to reveal)
                  </span>
                ) : (
                  parsedTokens.map((token, idx) => {
                    if (typeof token === 'string') {
                      return <span key={idx}>{token}</span>;
                    }
                    return (
                      <span
                        key={idx}
                        className={`chat-inline-emote ${chatPrefs.animatedEmotes ? 'animated' : ''}`}
                        title={token.code}
                      >
                        {token.emojiOrUrl}
                      </span>
                    );
                  })
                )}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Claimable Bonus Chest Notification (Twitch Style) */}
      {bonusChestAvailable && (
        <div className="bonus-chest-banner" onClick={handleClaimChest}>
          <div className="chest-gift-icon">🎁</div>
          <div className="chest-details">
            <span className="chest-title">Bonus Book Tokens Ready!</span>
            <span className="chest-sub">Click to claim +50 Tokens</span>
          </div>
        </div>
      )}

      {claimedChestAnim && (
        <div className="claimed-toast">
          <Sparkles size={16} color="#ffd700" />
          <span>+{claimedChestAnim} Book Tokens Claimed!</span>
        </div>
      )}

      {/* Chat Input Area */}
      <div className="twitch-chat-input-wrapper">
        {/* Quick actions bar: Sparks, Points Shop, Emotes, Polls, Raids, Mod */}
        <div className="chat-actions-toolbar">
          {/* Channel Points Redeem Button */}
          <button
            type="button"
            onClick={() => setShowPointsShop(true)}
            className="btn-points-shop-trigger"
            title="Redeem Channel Rewards"
          >
            <div className="points-icon-disc">🪙</div>
            <span className="points-bal-text">{points.toLocaleString()}</span>
          </button>

          <div className="toolbar-right-btns">
            {/* Hype Train Trigger */}
            <button
              type="button"
              onClick={() => setHypeTrainActive(!hypeTrainActive)}
              className={`btn-toolbar-icon ${hypeTrainActive ? 'active' : ''}`}
              title="Hype Train (/hype)"
            >
              <Flame size={15} color="#ff7700" />
            </button>

            {/* Run Poll Quick Action */}
            <button
              type="button"
              onClick={() => setShowPollCreateModal(true)}
              className="btn-toolbar-icon"
              title="Create Poll (/poll)"
            >
              <BarChart2 size={15} />
            </button>

            {/* Raid Quick Action */}
            <button
              type="button"
              onClick={() => setShowRaidModal(true)}
              className="btn-toolbar-icon"
              title="Raid Channel (/raid)"
            >
              <Radio size={15} />
            </button>

            {/* Chat Identity & Color Studio */}
            <button
              type="button"
              onClick={() => {
                soundFX.playPop();
                setShowIdentityModal(true);
              }}
              className="btn-toolbar-icon"
              title="Chat Identity & Username Color (/color)"
            >
              <Palette size={15} color={userIdentity.nameColor} />
            </button>

            {/* Mod View Quick Action */}
            <button
              type="button"
              onClick={() => setShowModViewModal(true)}
              className="btn-toolbar-icon"
              title="Moderator View (/mod)"
            >
              <Shield size={15} />
            </button>

            {/* Cheer Sparks Button */}
            <button
              type="button"
              onClick={() => setShowBitsModal(true)}
              className="btn-toolbar-icon btn-sparks-trigger"
              title="Cheer Book Sparks"
            >
              <Sparkles size={16} color="#ffd700" />
            </button>

            {/* Emote Picker Button */}
            <button
              type="button"
              onClick={() => setShowEmotePicker(!showEmotePicker)}
              className={`btn-toolbar-icon ${showEmotePicker ? 'active' : ''}`}
              title="Emotes"
            >
              <Smile size={16} />
            </button>
          </div>
        </div>

        {/* Emote Colon Autocomplete Popup */}
        {filteredEmoteSuggestions.length > 0 && (
          <div className="chat-autocomplete-popover">
            <div className="autocomplete-header">
              <span>Matching Emotes (Tab or Click):</span>
            </div>
            {filteredEmoteSuggestions.map(e => (
              <div
                key={e.code}
                className="autocomplete-item"
                onClick={() => handleInsertEmote(e.code)}
              >
                <span className="ac-emote-icon">{e.emojiOrUrl}</span>
                <span className="ac-emote-code">{e.code}</span>
                <span className="ac-emote-desc">{e.description}</span>
              </div>
            ))}
          </div>
        )}

        {/* @Mention Autocomplete Popup */}
        {filteredMentionSuggestions.length > 0 && (
          <div className="chat-autocomplete-popover">
            <div className="autocomplete-header">
              <span>Mention Chatter:</span>
            </div>
            {filteredMentionSuggestions.map(u => (
              <div
                key={u}
                className="autocomplete-item"
                onClick={() => handleInsertMention(u)}
              >
                <AtSign size={13} color="var(--accent-secondary)" />
                <span className="ac-username">{u}</span>
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="twitch-chat-form">
          <input
            type="text"
            placeholder={
              !user
                ? 'Sign in to chat'
                : slowModeCooldown > 0
                ? `Slow mode (${slowModeCooldown}s)`
                : emoteOnly
                ? 'Emote-only mode active'
                : 'Send a reaction, :emote, @mention, /color...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={!user || slowModeCooldown > 0}
            className="twitch-chat-text-input"
          />

          <button
            type="submit"
            disabled={!user || !inputText.trim() || slowModeCooldown > 0}
            className="btn-chat-send"
          >
            <Send size={15} />
          </button>
        </form>

        {/* Emote Picker Popover */}
        {showEmotePicker && (
          <EmotePicker
            onSelectEmote={handleSelectEmote}
            onClose={() => setShowEmotePicker(false)}
          />
        )}
      </div>

      {/* MODALS */}
      {showBitsModal && (
        <BitsModal
          streamerName={streamerName}
          onSendCheer={(bits, msg) => {
            soundFX.playCheer();
            if (onSendCheer) onSendCheer(bits, msg);
          }}
          onClose={() => setShowBitsModal(false)}
        />
      )}

      {showSubModal && (
        <SubModal
          streamerName={streamerName}
          onSubscribe={(tier, isGift, count) => {
            soundFX.playSubAlert();
            onSendMessage(
              isGift
                ? `🎁 Just gifted ${count} Tier 1 Subscriptions to the community!`
                : `⭐ Just subscribed at Tier ${tier}! Let's read!`
            );
          }}
          onClose={() => setShowSubModal(false)}
        />
      )}

      {showPointsShop && (
        <ChannelPointsShop
          streamerName={streamerName}
          onClose={() => setShowPointsShop(false)}
        />
      )}

      {showChatSettings && (
        <ChatSettingsModal
          preferences={chatPrefs}
          onChangePreferences={setChatPrefs}
          onOpenModView={() => setShowModViewModal(true)}
          onClose={() => setShowChatSettings(false)}
        />
      )}

      {showRulesModal && (
        <ChatRulesModal
          streamerName={streamerName}
          onAccept={handleAcceptRules}
        />
      )}

      {showPollCreateModal && (
        <ChatPollModal
          onStartPoll={(poll) => setActivePoll(poll)}
          onClose={() => setShowPollCreateModal(false)}
        />
      )}

      {showRaidModal && (
        <RaidModal
          currentViewerCount={1420}
          currentStreamerId={streamerId || 'mock_lillyreads'}
          onInitiateRaid={(target) => {
            if (onInitiateRaid) onInitiateRaid(target);
            onSendMessage(`🚀 Raiding ${target.displayName} with our reading party! PogChamp NovelHype`);
          }}
          onClose={() => setShowRaidModal(false)}
        />
      )}

      {showModViewModal && (
        <ModViewModal
          streamerName={streamerName}
          messages={messages}
          onDeleteMessage={(id) => {
            if (onDeleteMessage) onDeleteMessage(id);
          }}
          onClearChat={() => {
            if (onClearChat) onClearChat();
          }}
          onTimeoutUser={(u, secs) => {
            onSendMessage(`🛡️ Moderator timed out ${u} for ${secs}s.`);
          }}
          onBanUser={(u) => {
            onSendMessage(`🛡️ Moderator permanently banned ${u}.`);
          }}
          onClose={() => setShowModViewModal(false)}
        />
      )}

      {/* Shield Mode Modal */}
      {showShieldModal && (
        <ShieldModeModal
          isOpen={showShieldModal}
          isShieldActive={isShieldActive}
          onToggleShield={(active) => {
            setIsShieldActive(active);
            if (active) {
              onSendMessage('🛡️ SHIELD MODE ACTIVATED: AutoMod maximum strictness & Subscriber-only chat engaged.');
            } else {
              onSendMessage('🛡️ Shield Mode deactivated. Normal chat rules restored.');
            }
          }}
          onClose={() => setShowShieldModal(false)}
        />
      )}

      {/* User Chat Identity & Mod Card */}
      {selectedUserCard && (
        <UserChatCardModal
          username={selectedUserCard.username}
          badges={selectedUserCard.badges}
          isModOrBroadcaster={true}
          onTimeoutUser={(u, secs) => {
            onSendMessage(`🛡️ Moderator timed out ${u} for ${secs}s.`);
          }}
          onBanUser={(u) => {
            onSendMessage(`🛡️ Moderator permanently banned ${u}.`);
          }}
          onDeleteUserMessages={(u) => {
            onSendMessage(`🛡️ Moderator purged messages from ${u}.`);
          }}
          onClose={() => setSelectedUserCard(null)}
        />
      )}

      {/* Chat Identity & Color Studio Modal */}
      {showIdentityModal && (
        <ChatIdentityModal
          currentIdentity={userIdentity}
          onSaveIdentity={(newId) => {
            setUserIdentity(newId);
            onSendMessage(`✨ Updated chat name color to ${newId.nameColor}!`);
          }}
          onClose={() => setShowIdentityModal(false)}
        />
      )}

      {/* Chapter-Gated Spoiler Firewall Modal */}
      {showSpoilerModal && (
        <SpoilerFirewallModal
          currentStreamChapter={2}
          userReadingLevel={userReadingLevel}
          isBroadcaster={true}
          onUpdateUserLevel={(newLevel) => {
            setUserReadingLevel(newLevel);
            onSendMessage(`🛡️ Updated personal spoiler filter: Chapter ${newLevel === 999 ? 'All' : newLevel}.`);
          }}
          onClose={() => setShowSpoilerModal(false)}
        />
      )}
    </aside>
  );
};
