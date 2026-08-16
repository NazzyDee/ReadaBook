import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { books, type Book } from '../lib/booksData';
import { STREAMERS, type StreamerProfile } from '../lib/streamersData';
import { VideoPlayer } from '../components/VideoPlayer';
import { SyncedReader } from '../components/SyncedReader';
import { LiveChat, type ChatMsg } from '../components/LiveChat';
import { PredictionsOverlay } from '../components/PredictionsOverlay';
import { StreamExtensions } from '../components/StreamExtensions';
import { CommunityGoalWidget } from '../components/CommunityGoalWidget';
import { StreamMarkerModal } from '../components/StreamMarkerModal';
import { ClipCreator } from '../components/ClipCreator';
import { SubscriptionModal } from '../components/SubscriptionModal';
import { StoryBranchHUD } from '../components/StoryBranchHUD';
import { CharityMarathonWidget } from '../components/CharityMarathonWidget';
import { ReaderMomentsModal } from '../components/ReaderMomentsModal';
import { ViewerSoundboardModal } from '../components/ViewerSoundboardModal';
import { VodTranscriptViewer } from '../components/VodTranscriptViewer';
import { SquadMultiviewPlayer } from '../components/SquadMultiviewPlayer';
import { LoreGlossaryOverlay } from '../components/LoreGlossaryOverlay';
import { WatchPartyRoomModal } from '../components/WatchPartyRoomModal';
import { MarathonScheduleHubModal } from '../components/MarathonScheduleHubModal';
import { OBSOverlayStudioModal } from '../components/OBSOverlayStudioModal';
import { ShieldModeModal } from '../components/ShieldModeModal';
import { MerchStorefrontModal } from '../components/MerchStorefrontModal';
import { CharacterCastMatrixModal } from '../components/CharacterCastMatrixModal';
import { RaidStationModal } from '../components/RaidStationModal';
import { ChannelRolesModal } from '../components/ChannelRolesModal';
import { StreamHealthModal } from '../components/StreamHealthModal';
import { CommunityGoalHubModal } from '../components/CommunityGoalHubModal';
import { HypeTrainEngineModal } from '../components/HypeTrainEngineModal';
import { StreamLeaderboardsModal } from '../components/StreamLeaderboardsModal';
import { ChatSettingsStudioModal } from '../components/ChatSettingsStudioModal';
import { DiscordRoleSyncModal } from '../components/DiscordRoleSyncModal';
import { ViewerDropsModal } from '../components/ViewerDropsModal';
import { StreamDeckShortcutsModal } from '../components/StreamDeckShortcutsModal';
import { ClipEditorStudioModal } from '../components/ClipEditorStudioModal';
import { ChannelRulesGateModal } from '../components/ChannelRulesGateModal';
import { BookshelfCustomizerModal } from '../components/BookshelfCustomizerModal';
import { SubMilestonesModal } from '../components/SubMilestonesModal';
import { CommunityGiftBombModal } from '../components/CommunityGiftBombModal';
import { ChannelPointsStudioModal } from '../components/ChannelPointsStudioModal';
import { CommercialBreakModal } from '../components/CommercialBreakModal';
import { DualAudioMixerModal } from '../components/DualAudioMixerModal';
import { PinnedMessageStudioModal } from '../components/PinnedMessageStudioModal';
import { VodChapterMarkersModal } from '../components/VodChapterMarkersModal';
import { CommunityPredictionsModal } from '../components/CommunityPredictionsModal';
import { WhisperMessagesModal } from '../components/WhisperMessagesModal';
import { ModActionAuditLogModal } from '../components/ModActionAuditLogModal';
import { ContentClassificationModal } from '../components/ContentClassificationModal';
import { StreamLatencySettingsModal } from '../components/StreamLatencySettingsModal';
import { ChatEmoteComboWidget } from '../components/ChatEmoteComboWidget';
import { MysteryBookBoxModal } from '../components/MysteryBookBoxModal';
import { ReadingTelemetryModal } from '../components/ReadingTelemetryModal';
import { BookTriviaArenaModal } from '../components/BookTriviaArenaModal';
import { VocalWarmupStudioModal } from '../components/VocalWarmupStudioModal';
import { CoStreamRoleSplitterModal } from '../components/CoStreamRoleSplitterModal';
import { CreatorAchievementsModal } from '../components/CreatorAchievementsModal';
import { VipReaderFlairsModal } from '../components/VipReaderFlairsModal';
import { LiveChapterRecapModal } from '../components/LiveChapterRecapModal';
import { VocalDynamicsRackModal } from '../components/VocalDynamicsRackModal';
import { SquadSpatialAudioModal } from '../components/SquadSpatialAudioModal';
import { ReadingHabitsHubModal } from '../components/ReadingHabitsHubModal';
import { DonationTtsStudioModal } from '../components/DonationTtsStudioModal';
import { SubGiftLeaderboardModal } from '../components/SubGiftLeaderboardModal';
import { HighlightReelGeneratorModal } from '../components/HighlightReelGeneratorModal';
import { ChatVerificationModal } from '../components/ChatVerificationModal';
import { ReadingPacingPacerModal } from '../components/ReadingPacingPacerModal';
import { SoundtrackIntegrationModal } from '../components/SoundtrackIntegrationModal';
import { CliffhangerWagersModal } from '../components/CliffhangerWagersModal';
import { EmoteSlotsManagerModal } from '../components/EmoteSlotsManagerModal';
import { NarratorCheatSheetModal } from '../components/NarratorCheatSheetModal';
import { BackstageWhisperModal } from '../components/BackstageWhisperModal';
import { ViewerJournalBookmarksModal } from '../components/ViewerJournalBookmarksModal';
import { CommunityAuctionModal } from '../components/CommunityAuctionModal';
import { NarratorSkillTreeModal } from '../components/NarratorSkillTreeModal';
import { StreamTagTaxonomyModal } from '../components/StreamTagTaxonomyModal';
import { NarratorFaceOffModal } from '../components/NarratorFaceOffModal';
import { SubscribersWallOfHonorModal } from '../components/SubscribersWallOfHonorModal';
import { VocalWarmupTrainerModal } from '../components/VocalWarmupTrainerModal';
import { ChatPacingThrottleModal } from '../components/ChatPacingThrottleModal';
import { ChapterProgressSyncModal } from '../components/ChapterProgressSyncModal';
import { CommunitySparksPinataModal } from '../components/CommunitySparksPinataModal';
import { WorldLoreAtlasModal } from '../components/WorldLoreAtlasModal';
import { AdBreakCountdownModal } from '../components/AdBreakCountdownModal';
import { ReaderSentimentHeatmapModal } from '../components/ReaderSentimentHeatmapModal';
import { GuildReadingBattlepassModal } from '../components/GuildReadingBattlepassModal';
import { AutoHostChannelTeamsModal } from '../components/AutoHostChannelTeamsModal';
import { StreamDirectorMultiCamModal } from '../components/StreamDirectorMultiCamModal';
import { OverlayThemesStudioModal } from '../components/OverlayThemesStudioModal';
import { ScreenFxEmoteCannonModal } from '../components/ScreenFxEmoteCannonModal';
import { MobileTeleprompterRemoteModal } from '../components/MobileTeleprompterRemoteModal';
import { RoomAcousticOptimizerModal } from '../components/RoomAcousticOptimizerModal';
import { VoiceMorphPresetPadModal } from '../components/VoiceMorphPresetPadModal';
import { BackstageAudioRoutingModal } from '../components/BackstageAudioRoutingModal';
import { WpmTachometerModal } from '../components/WpmTachometerModal';
import { ReadingBossEncounterModal } from '../components/ReadingBossEncounterModal';
import { BookTournamentBracketModal } from '../components/BookTournamentBracketModal';
import { BookGiveawayRandomizerModal } from '../components/BookGiveawayRandomizerModal';
import { ChapterBookmarkStampModal } from '../components/ChapterBookmarkStampModal';
import { CustomChannelFontModal } from '../components/CustomChannelFontModal';
import { PrintOnDemandMerchModal } from '../components/PrintOnDemandMerchModal';
import { PublisherBountyTrackerModal } from '../components/PublisherBountyTrackerModal';
import { SubOnlyLoungeModal } from '../components/SubOnlyLoungeModal';
import { SmartLightingSyncModal } from '../components/SmartLightingSyncModal';
import { AutomatedModShieldRulesModal } from '../components/AutomatedModShieldRulesModal';
import { SilentStudyRadioModal } from '../components/SilentStudyRadioModal';
import { InteractiveVodArchivesModal } from '../components/InteractiveVodArchivesModal';
import { MultiCastAudioDramaModal } from '../components/MultiCastAudioDramaModal';
import { ObsVirtualKeyerModal } from '../components/ObsVirtualKeyerModal';
import { VerticalClipTranscoderModal } from '../components/VerticalClipTranscoderModal';
import { StreamDeckWebSocketModal } from '../components/StreamDeckWebSocketModal';
import { SpatialBinauralPannerModal } from '../components/SpatialBinauralPannerModal';
import { EyeContactCorrectorModal } from '../components/EyeContactCorrectorModal';
import { RsvpSpeedReaderModal } from '../components/RsvpSpeedReaderModal';
import { ManuscriptZoomLoupeModal } from '../components/ManuscriptZoomLoupeModal';
import { VocalHealthTelemetryModal } from '../components/VocalHealthTelemetryModal';
import { BackstageIntercomModal } from '../components/BackstageIntercomModal';
import { GuildTerritoryWarsModal } from '../components/GuildTerritoryWarsModal';
import { D20SkillCheckModal } from '../components/D20SkillCheckModal';
import { LoreTradingCardsModal } from '../components/LoreTradingCardsModal';
import { ReaderCitadelBookshelfModal } from '../components/ReaderCitadelBookshelfModal';
import { GlobalReadingRelayModal } from '../components/GlobalReadingRelayModal';
import { StreamInfoModal } from '../components/StreamInfoModal';
import { RaidBanner } from '../components/RaidBanner';
import { MiniPlayer } from '../components/MiniPlayer';
import { GuestStarModal } from '../components/GuestStarModal';
import { type GuestParticipant, type GuestLayoutMode } from '../components/GuestStarStage';
import { ReadingSprintHUD } from '../components/ReadingSprintHUD';
import { AmbientSoundMixer } from '../components/AmbientSoundMixer';
import { SprintSummaryModal } from '../components/SprintSummaryModal';
import { BookCommercePanel } from '../components/BookCommercePanel';
import { soundFX } from '../lib/soundFx';
import {
  Heart,
  Star,
  Scissors,
  Share2,
  AlertCircle,
  CheckCircle2,
  Edit3,
  Minimize2,
  Bookmark,
  Users,
  GitBranch,
  HeartHandshake,
  Flame,
  BellRing,
  FileText,
  Grid,
  BookOpen,
  CalendarDays,
  ShieldAlert,
  ShoppingBag,
  Theater,
  Activity,
  Target,
  Shield,
  MessageCircle,
  Keyboard,
  Award,
  Zap,
  Palette,
  Gift,
  Library,
  ShieldCheck,
  Crown,
  Coffee,
  Sliders,
  Sparkles,
  Megaphone,
  TrendingUp,
  MessageSquare,
  Tag,
  Radio,
  Swords,
  Mic,
  Gem,
  Trophy,
  Headphones,
  Volume2,
  Film,
  Gauge,
  Dices,
  Smile,
  Gavel,
  TreePine,
  Music,
  Lock,
  Compass,
  Video,
  Smartphone,
  Type,
  Lightbulb,
  HeartPulse,
  Eye,
  Search,
  Map,
  Castle,
  Globe,
  Layers
} from 'lucide-react';

interface StreamData {
  streamerId: string;
  streamerName: string;
  title: string;
  bookId: string;
  genre: string;
  currentPage: number;
  currentParagraph?: number;
  isLive: boolean;
  viewerCount: number;
  emoteOnly?: boolean;
  pinnedMessage?: string | null;
  broadcastSource?: 'webcam' | 'obs';
  isObsConnected?: boolean;
  slowModeSeconds?: number;
  tags?: string[];
}

export const StreamPage: React.FC = () => {
  const { streamerId } = useParams<{ streamerId: string }>();
  const { user } = useAuth();

  const [stream, setStream] = useState<StreamData | null>(null);
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [theaterMode, setTheaterMode] = useState(false);
  const [audioOnly, setAudioOnly] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);

  // Guest Star Multi-Reader State
  const [showGuestStarModal, setShowGuestStarModal] = useState(false);
  const [guestStarActive, setGuestStarActive] = useState(false);
  const [guestLayout, setGuestLayout] = useState<GuestLayoutMode>('side-by-side');
  const [guestParticipants, setGuestParticipants] = useState<GuestParticipant[]>([
    {
      id: 'host_p1',
      name: 'LillyReads',
      role: 'Host & Narrator',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      isMuted: false,
      isVideoOff: false,
      audioLevel: 75,
      isSpeaking: true,
      volume: 100,
      isHost: true
    },
    {
      id: 'guest_p2',
      name: 'ElessarVoiceActor',
      role: 'Voice Actor: Aragorn',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      isMuted: false,
      isVideoOff: false,
      audioLevel: 60,
      isSpeaking: false,
      volume: 90
    }
  ]);

  // Modals & Toolbars
  const [showClipModal, setShowClipModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showEditInfoModal, setShowEditInfoModal] = useState(false);
  const [showMarkerModal, setShowMarkerModal] = useState(false);
  const [showAmbientMixer, setShowAmbientMixer] = useState(false);
  const [showBranchHUD, setShowBranchHUD] = useState(false);
  const [showCharityModal, setShowCharityModal] = useState(false);
  const [showMomentsModal, setShowMomentsModal] = useState(false);
  const [showSoundboardModal, setShowSoundboardModal] = useState(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [showSquadMulti, setShowSquadMulti] = useState(false);
  const [showLoreWikiModal, setShowLoreWikiModal] = useState(false);
  const [showWatchPartyModal, setShowWatchPartyModal] = useState(false);
  const [showMarathonModal, setShowMarathonModal] = useState(false);
  const [showOBSOverlayModal, setShowOBSOverlayModal] = useState(false);
  const [showShieldModal, setShowShieldModal] = useState(false);
  const [showMerchModal, setShowMerchModal] = useState(false);
  const [showCastMatrixModal, setShowCastMatrixModal] = useState(false);
  const [showRaidStationModal, setShowRaidStationModal] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [showStreamHealthModal, setShowStreamHealthModal] = useState(false);
  const [showGoalHubModal, setShowGoalHubModal] = useState(false);
  const [showHypeTrainModal, setShowHypeTrainModal] = useState(false);
  const [showLeaderboardsModal, setShowLeaderboardsModal] = useState(false);
  const [showChatStudioModal, setShowChatStudioModal] = useState(false);
  const [showDiscordSyncModal, setShowDiscordSyncModal] = useState(false);
  const [showDropsModal, setShowDropsModal] = useState(false);
  const [showStreamDeckModal, setShowStreamDeckModal] = useState(false);
  const [showClipEditorModal, setShowClipEditorModal] = useState(false);
  const [showChannelRulesModal, setShowChannelRulesModal] = useState(false);
  const [showBookshelfModal, setShowBookshelfModal] = useState(false);
  const [showSubMilestonesModal, setShowSubMilestonesModal] = useState(false);
  const [showGiftBombModal, setShowGiftBombModal] = useState(false);
  const [showPointsStudioModal, setShowPointsStudioModal] = useState(false);
  const [showCommercialModal, setShowCommercialModal] = useState(false);
  const [showDualAudioModal, setShowDualAudioModal] = useState(false);
  const [showPinnedModal, setShowPinnedModal] = useState(false);
  const [showVodMarkersModal, setShowVodMarkersModal] = useState(false);
  const [showPredictionsModal, setShowPredictionsModal] = useState(false);
  const [showWhispersModal, setShowWhispersModal] = useState(false);
  const [showModAuditModal, setShowModAuditModal] = useState(false);
  const [showContentWarnModal, setShowContentWarnModal] = useState(false);
  const [showLatencyModal, setShowLatencyModal] = useState(false);
  const [showEmoteComboWidget, setShowEmoteComboWidget] = useState(false);
  const [showMysteryBoxModal, setShowMysteryBoxModal] = useState(false);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [showTriviaArenaModal, setShowTriviaArenaModal] = useState(false);
  const [showVocalWarmupModal, setShowVocalWarmupModal] = useState(false);
  const [showCoStreamRolesModal, setShowCoStreamRolesModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showVipFlairsModal, setShowVipFlairsModal] = useState(false);
  const [showChapterRecapModal, setShowChapterRecapModal] = useState(false);
  const [showVocalDynamicsModal, setShowVocalDynamicsModal] = useState(false);
  const [showSpatialAudioModal, setShowSpatialAudioModal] = useState(false);
  const [showHabitsHubModal, setShowHabitsHubModal] = useState(false);
  const [showDonationTtsModal, setShowDonationTtsModal] = useState(false);
  const [showSubGiftModal, setShowSubGiftModal] = useState(false);
  const [showHighlightReelModal, setShowHighlightReelModal] = useState(false);
  const [showChatVerifyModal, setShowChatVerifyModal] = useState(false);
  const [showPacingMetronomeModal, setShowPacingMetronomeModal] = useState(false);
  const [showSoundtrackModal, setShowSoundtrackModal] = useState(false);
  const [showCliffhangerWagerModal, setShowCliffhangerWagerModal] = useState(false);
  const [showEmoteSlotsModal, setShowEmoteSlotsModal] = useState(false);
  const [showCheatSheetModal, setShowCheatSheetModal] = useState(false);
  const [showBackstageWhisperModal, setShowBackstageWhisperModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [showSkillTreeModal, setShowSkillTreeModal] = useState(false);
  const [showStreamTagTaxonomyModal, setShowStreamTagTaxonomyModal] = useState(false);
  const [showNarratorFaceOffModal, setShowNarratorFaceOffModal] = useState(false);
  const [showSubscribersWallModal, setShowSubscribersWallModal] = useState(false);
  const [showVocalWarmupTrainerModal, setShowVocalWarmupTrainerModal] = useState(false);
  const [showChatThrottleModal, setShowChatThrottleModal] = useState(false);
  const [showBookProgressModal, setShowBookProgressModal] = useState(false);
  const [showSparksPinataModal, setShowSparksPinataModal] = useState(false);
  const [showWorldAtlasModal, setShowWorldAtlasModal] = useState(false);
  const [showAdBreakModal, setShowAdBreakModal] = useState(false);
  const [showSentimentHeatmapModal, setShowSentimentHeatmapModal] = useState(false);
  const [showGuildBattlepassModal, setShowGuildBattlepassModal] = useState(false);
  const [showAutoHostTeamsModal, setShowAutoHostTeamsModal] = useState(false);
  const [showMultiCamModal, setShowMultiCamModal] = useState(false);
  const [showOverlayThemesModal, setShowOverlayThemesModal] = useState(false);
  const [showScreenFxModal, setShowScreenFxModal] = useState(false);
  const [showTeleprompterModal, setShowTeleprompterModal] = useState(false);
  const [showAcousticModal, setShowAcousticModal] = useState(false);
  const [showVoicePadModal, setShowVoicePadModal] = useState(false);
  const [showAudioRoutingModal, setShowAudioRoutingModal] = useState(false);
  const [showWpmModal, setShowWpmModal] = useState(false);
  const [showBossRaidModal, setShowBossRaidModal] = useState(false);
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [showGiveawayModal, setShowGiveawayModal] = useState(false);
  const [showBookmarkStampModal, setShowBookmarkStampModal] = useState(false);
  const [showCustomFontModal, setShowCustomFontModal] = useState(false);
  const [showMerchShopModal, setShowMerchShopModal] = useState(false);
  const [showBountyTrackerModal, setShowBountyTrackerModal] = useState(false);
  const [showSubLoungeModal, setShowSubLoungeModal] = useState(false);
  const [showLightingModal, setShowLightingModal] = useState(false);
  const [showModShieldModal, setShowModShieldModal] = useState(false);
  const [showRadioModal, setShowRadioModal] = useState(false);
  const [showVodArchivesModal, setShowVodArchivesModal] = useState(false);
  const [showMultiCastDramaModal, setShowMultiCastDramaModal] = useState(false);
  const [showObsKeyerModal, setShowObsKeyerModal] = useState(false);
  const [showVerticalClipModal, setShowVerticalClipModal] = useState(false);
  const [showStreamDeckWsModal, setShowStreamDeckWsModal] = useState(false);
  const [showSpatialPannerModal, setShowSpatialPannerModal] = useState(false);
  const [showEyeContactModal, setShowEyeContactModal] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [showManuscriptZoomModal, setShowManuscriptZoomModal] = useState(false);
  const [showVocalHealthModal, setShowVocalHealthModal] = useState(false);
  const [showIntercomModal, setShowIntercomModal] = useState(false);
  const [showTerritoryWarsModal, setShowTerritoryWarsModal] = useState(false);
  const [showD20Modal, setShowD20Modal] = useState(false);
  const [showLoreCardsModal, setShowLoreCardsModal] = useState(false);
  const [showCitadelModal, setShowCitadelModal] = useState(false);
  const [showRelayModal, setShowRelayModal] = useState(false);
  const [sprintCompletedTarget, setSprintCompletedTarget] = useState<number | null>(null);
  const [activeCheerAnimation, setActiveCheerAnimation] = useState<any | null>(null);
  const [incomingRaid, setIncomingRaid] = useState<{ raiderName: string; raiderAvatar: string; readerCount: number } | null>(null);

  // 1. Fetch & Subscribe to Stream Document (with mock fallbacks)
  useEffect(() => {
    if (!streamerId) return;

    // Check if mock streamer
    const fallbackProfile = STREAMERS[streamerId];
    const defaultMockStream: StreamData = {
      streamerId: streamerId,
      streamerName: fallbackProfile?.username || 'Storyteller',
      title: fallbackProfile?.currentStreamTitle || 'Live Reading & Book Discussion ☕',
      bookId: fallbackProfile?.currentBookId || books[0].id,
      genre: 'Fantasy',
      currentPage: 0,
      currentParagraph: 0,
      isLive: true,
      viewerCount: fallbackProfile?.followersCount ? Math.round(fallbackProfile.followersCount / 20) : 1420,
      broadcastSource: 'webcam',
      tags: fallbackProfile?.tags || ['VoiceActing', 'Fantasy', 'CozyVibes']
    };

    const streamDocRef = doc(db, 'streams', streamerId);
    const unsubscribe = onSnapshot(
      streamDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setStream(docSnap.data() as StreamData);
        } else {
          setStream(defaultMockStream);
        }
        setLoading(false);
      },
      (err) => {
        console.warn('Using mock stream fallback:', err);
        setStream(defaultMockStream);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [streamerId]);

  // 2. Resolve active book (static or Firestore custom book)
  useEffect(() => {
    if (!stream) {
      setActiveBook(null);
      return;
    }

    const staticBook = books.find(b => b.id === stream.bookId);
    if (staticBook) {
      fetch(`/books/${stream.bookId}.json`)
        .then(res => res.json())
        .then(data => {
          if (data && data.pages) {
            setActiveBook({ ...staticBook, pages: data.pages });
          } else {
            setActiveBook(staticBook);
          }
        })
        .catch(() => {
          setActiveBook(staticBook);
        });
    } else {
      const bookDocRef = doc(db, 'books', stream.bookId);
      const unsubscribe = onSnapshot(bookDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setActiveBook({ id: docSnap.id, ...docSnap.data() } as Book);
        }
      });
      return () => unsubscribe();
    }
  }, [stream]);

  // 3. Follow state
  useEffect(() => {
    if (!user || !streamerId) return;

    if (streamerId.startsWith('mock_') || streamerId.startsWith('mock-')) {
      const mockFollows = JSON.parse(localStorage.getItem('mockFollows') || '[]');
      setIsFollowing(mockFollows.includes(streamerId));
    } else {
      const followDocRef = doc(db, 'users', user.uid, 'following', streamerId);
      const unsubscribe = onSnapshot(followDocRef, (docSnap) => {
        setIsFollowing(docSnap.exists());
      });
      return () => unsubscribe();
    }
  }, [user, streamerId]);

  // 4. Keyboard Shortcuts: Alt+X (Clip), Alt+M (Marker), Alt+T (Theater)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.altKey && (e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
        soundFX.playPop();
        setShowClipModal(true);
      } else if (e.altKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        soundFX.playPop();
        setShowMarkerModal(true);
      } else if (e.altKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        setTheaterMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 4. Live Chat messages simulation
  useEffect(() => {
    if (!streamerId) return;

    const initialMockMsgs: ChatMsg[] = [
      {
        id: 'm1',
        text: 'Hello everyone! Grab some hot tea ☕ TeaTime CozyFire',
        username: 'BookWorm99',
        createdAt: new Date(),
        badges: ['vip', 'sub6']
      },
      {
        id: 'm2',
        text: 'The voice acting on this chapter is incredible! NovelHype PogChamp',
        username: 'AuraReader',
        createdAt: new Date(),
        badges: ['sub1']
      },
      {
        id: 'm3',
        text: 'Did not expect that plot twist at all! PlotTwist MonkaS',
        username: 'PageTurner',
        createdAt: new Date(),
        badges: ['mod']
      }
    ];
    setMessages(initialMockMsgs);

    const mockChatUsers = ['Shelfishly', 'LitCritique', 'NovelEnthusiast', 'BardicLore', 'TeaAndTomes', 'MysticReader'];
    const mockChatPhrases = [
      'The vocabulary here is amazing! 5Head',
      'I love how the e-book highlights along with her voice! BookWorm',
      'Look at that foreshadowing! MindBlown',
      'Can we predict what happens to the ring next? VoteYea',
      'Cozy study vibes are 10/10 tonight CozyFire',
      'Speed reading sprint in the next chapter? SpeedReader',
      'Aslan voice gives me goosebumps every time! NovelHype PogChamp',
      'Cheering 100 sparks for this chapter! ✨'
    ];

    const interval = setInterval(() => {
      const randomUser = mockChatUsers[Math.floor(Math.random() * mockChatUsers.length)];
      const randomText = mockChatPhrases[Math.floor(Math.random() * mockChatPhrases.length)];
      const randomBadges: ('sub1' | 'vip' | 'founder')[] = Math.random() > 0.5 ? ['sub1'] : [];

      setMessages(prev => [
        ...prev.slice(-49),
        {
          id: `msg_${Math.random()}`,
          text: randomText,
          username: randomUser,
          createdAt: new Date(),
          badges: randomBadges
        }
      ]);
    }, 6000);

    return () => clearInterval(interval);
  }, [streamerId]);

  // 5. Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.altKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        setTheaterMode(prev => !prev);
      } else if (e.altKey && (e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
        setShowClipModal(true);
      } else if (e.altKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        setShowMarkerModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleFollow = async () => {
    if (!user || !streamerId) return;
    soundFX.playPop();

    if (streamerId.startsWith('mock_') || streamerId.startsWith('mock-')) {
      const mockFollows = JSON.parse(localStorage.getItem('mockFollows') || '[]');
      let updated = [];
      if (isFollowing) {
        updated = mockFollows.filter((id: string) => id !== streamerId);
      } else {
        updated = [...mockFollows, streamerId];
      }
      localStorage.setItem('mockFollows', JSON.stringify(updated));
      setIsFollowing(!isFollowing);
      window.dispatchEvent(new Event('storage'));
      return;
    }

    const followDocRef = doc(db, 'users', user.uid, 'follows', streamerId);
    try {
      if (isFollowing) {
        await deleteDoc(followDocRef);
      } else {
        await setDoc(followDocRef, {
          streamerName: stream?.streamerName || 'Streamer',
          followedAt: new Date()
        });
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim() || !user) return;
    const username = user.email ? user.email.split('@')[0] : 'You';

    const newMsg: ChatMsg = {
      id: `msg_user_${Date.now()}`,
      text: text.trim(),
      username,
      createdAt: new Date(),
      badges: ['sub1']
    };

    setMessages(prev => [...prev.slice(-49), newMsg]);
  };

  const handleSendCheer = (bits: number, message: string) => {
    const username = user?.email ? user.email.split('@')[0] : 'You';
    const cheerAnim = {
      id: `cheer_${Date.now()}`,
      bits,
      username,
      message,
      icon: bits >= 1000 ? '👑' : bits >= 500 ? '💎' : '✨'
    };

    setActiveCheerAnimation(cheerAnim);
    setTimeout(() => setActiveCheerAnimation(null), 5000);

    const cheerMsg: ChatMsg = {
      id: `cheer_msg_${Date.now()}`,
      text: `Cheered ${bits} Sparks: "${message}"`,
      username,
      createdAt: new Date(),
      type: 'cheer',
      bitsAmount: bits,
      badges: ['sparksTop', 'sub1'],
      isHighlighted: true
    };

    setMessages(prev => [...prev.slice(-49), cheerMsg]);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleSaveStreamInfo = (title: string, genre: string, tags: string[]) => {
    if (stream) {
      setStream({
        ...stream,
        title,
        genre,
        tags
      });
    }
  };

  const handleInitiateRaid = (_target: StreamerProfile) => {
    setIncomingRaid({
      raiderName: stream?.streamerName || 'Broadcaster',
      raiderAvatar: streamerProfile?.avatarUrl || '',
      readerCount: 1420
    });
  };

  const handleAddStreamMarker = (desc: string, timestamp: string) => {
    handleSendMessage(`📌 Stream Marker dropped at ${timestamp}: "${desc}"`);
  };

  if (loading) {
    return (
      <div className="stream-loading-screen">
        <div className="spinner"></div>
        <p>Connecting to ReadaBook Live Stream...</p>
      </div>
    );
  }

  if (!stream || !stream.isLive) {
    return (
      <div className="offline-container">
        <AlertCircle size={64} color="var(--accent-primary)" />
        <h1>Stream Offline</h1>
        <p>This channel is not currently broadcasting. Head back to Browse to find active storytellers.</p>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none', marginTop: '16px' }}>
          Back to Browse
        </Link>
      </div>
    );
  }

  const streamerProfile = STREAMERS[stream.streamerId] || null;

  return (
    <div className={`twitch-stream-page ${theaterMode ? 'theater-active' : ''}`}>
      {/* Main Left Watch Column */}
      <div className="twitch-watch-main-column">
        {/* Incoming Raid Banner Alert (if raided) */}
        {incomingRaid && (
          <RaidBanner
            raiderName={incomingRaid.raiderName}
            raiderAvatar={incomingRaid.raiderAvatar}
            readerCount={incomingRaid.readerCount}
            onShoutout={(name) => handleSendMessage(`🎉 Huge thanks to ${name} for the raid! Check out their channel! ✨`)}
            onDismiss={() => setIncomingRaid(null)}
          />
        )}

        {/* Top: Video Player Canvas */}
        <div className="stream-video-wrapper">
          <VideoPlayer
            streamerName={stream.streamerName}
            streamTitle={stream.title}
            viewerCount={stream.viewerCount}
            broadcastSource={stream.broadcastSource}
            isObsConnected={stream.isObsConnected}
            activeCheer={activeCheerAnimation}
            theaterMode={theaterMode}
            onToggleTheater={() => setTheaterMode(!theaterMode)}
            audioOnly={audioOnly}
            onToggleAudioOnly={() => setAudioOnly(!audioOnly)}
            guestStarActive={guestStarActive}
            guestLayout={guestLayout}
            guestParticipants={guestParticipants}
            onOpenGuestStarModal={() => setShowGuestStarModal(true)}
          />
        </div>

        {/* Middle: Streamer Metadata Bar & Action Buttons */}
        <div className="twitch-stream-meta-bar">
          <div className="stream-meta-left">
            <Link to={`/channel/${stream.streamerId}`} className="streamer-avatar-link">
              <img
                src={streamerProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                alt={stream.streamerName}
                className="streamer-meta-avatar"
              />
              <span className="live-pill-dot"></span>
            </Link>

            <div className="stream-meta-text">
              <div className="stream-title-row">
                <h2>{stream.title}</h2>
                <button
                  onClick={() => setShowEditInfoModal(true)}
                  className="btn-edit-stream-title"
                  title="Edit Stream Info"
                >
                  <Edit3 size={14} />
                </button>
              </div>

              <div className="streamer-subline">
                <Link to={`/channel/${stream.streamerId}`} className="streamer-name-link">
                  {stream.streamerName}
                </Link>
                {streamerProfile?.isPartner && (
                  <span title="Verified Literature Partner">
                    <CheckCircle2 size={15} color="#00e5ff" />
                  </span>
                )}
                <span className="meta-sep">•</span>
                <Link to={`/directory/category/${stream.genre.toLowerCase()}`} className="meta-genre-link">
                  {stream.genre}
                </Link>
                <span className="meta-sep">•</span>
                <span className="meta-book-name">📖 {activeBook?.title || 'Book'} by {activeBook?.author}</span>
              </div>

              <div className="stream-tags-list">
                {stream.tags?.map(t => (
                  <span key={t} className="stream-tag-chip">#{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="stream-meta-right">
            {/* Follow Button */}
            <button
              onClick={handleToggleFollow}
              className={`btn-stream-follow ${isFollowing ? 'following' : ''}`}
            >
              <Heart size={16} fill={isFollowing ? 'currentColor' : 'none'} />
              <span>{isFollowing ? 'Following' : 'Follow'}</span>
            </button>

            {/* Subscribe Button */}
            <button
              onClick={() => setShowSubModal(true)}
              className="btn-primary btn-stream-sub"
            >
              <Star size={16} fill="currentColor" />
              <span>Subscribe</span>
            </button>

            {/* Moments Claim Button */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowMomentsModal(true);
              }}
              className="btn-secondary"
              title="Claim Live Broadcast Moments & Badges"
            >
              <Flame size={16} color="#ffd700" />
              <span className="hide-mobile">Moments</span>
            </button>

            {/* Sound Alerts Button */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowSoundboardModal(true);
              }}
              className="btn-secondary"
              title="Viewer Channel Points Sound Alerts Board"
            >
              <BellRing size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Sound FX</span>
            </button>

            {/* Transcript Timeline Button */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowTranscriptModal(true);
              }}
              className="btn-secondary"
              title="Synchronized Reading Transcript & Chapters"
            >
              <FileText size={16} color="var(--text-muted)" />
              <span className="hide-mobile">Transcript</span>
            </button>

            {/* Squad Multiview Launcher */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowSquadMulti(true);
              }}
              className="btn-secondary"
              title="Launch 4-Way Squad Co-Stream Multiview"
            >
              <Grid size={16} color="var(--accent-primary)" />
              <span className="hide-mobile">Multiview</span>
            </button>

            {/* Lore Codex Wiki Button */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowLoreWikiModal(true);
              }}
              className="btn-secondary"
              title="Open Spoiler-Shielded Lore & Character Codex"
            >
              <BookOpen size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Lore Codex</span>
            </button>

            {/* Watch Party Button */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowWatchPartyModal(true);
              }}
              className="btn-secondary"
              title="Join Community Synchronized Watch Party"
            >
              <Users size={16} color="#ffd700" />
              <span className="hide-mobile">Watch Party</span>
            </button>

            {/* 24-Hour Marathon Hub */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowMarathonModal(true);
              }}
              className="btn-secondary"
              title="24-Hour Read-A-Thon Marathon & Shift Hub"
            >
              <CalendarDays size={16} color="var(--accent-success)" />
              <span className="hide-mobile">Marathons</span>
            </button>

            {/* Streamer Merch Store */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowMerchModal(true);
              }}
              className="btn-secondary"
              title="Streamer Official Merch & Book Box Store"
            >
              <ShoppingBag size={16} color="#ffd700" />
              <span className="hide-mobile">Merch</span>
            </button>

            {/* Multi-Voice Character Cast Matrix */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowCastMatrixModal(true);
              }}
              className="btn-secondary"
              title="Live Multi-Voice Character Cast Roster"
            >
              <Theater size={16} color="var(--accent-primary)" />
              <span className="hide-mobile">Cast Roster</span>
            </button>

            {/* Shield Mode Panic Button */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowShieldModal(true);
              }}
              className="btn-secondary"
              title="Streamer Emergency Shield Mode"
            >
              <ShieldAlert size={16} color="var(--accent-danger)" />
              <span className="hide-mobile">Shield</span>
            </button>

            {/* End-of-Stream Raid Station */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowRaidStationModal(true);
              }}
              className="btn-secondary"
              title="Outgoing Book Raid Station & Host Matchmaker"
            >
              <Flame size={16} color="var(--accent-danger)" />
              <span className="hide-mobile">Raid</span>
            </button>

            {/* Channel Roles & Badges */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowRolesModal(true);
              }}
              className="btn-secondary"
              title="VIP, Moderator & Author Badge Management"
            >
              <Shield size={16} color="var(--accent-primary)" />
              <span className="hide-mobile">Roles</span>
            </button>

            {/* Stream Health & Audio Ingest */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowStreamHealthModal(true);
              }}
              className="btn-secondary"
              title="Live Stream Health, Ingest Latency & LUFS Audio Meter"
            >
              <Activity size={16} color="var(--accent-success)" />
              <span className="hide-mobile">Health</span>
            </button>

            {/* Community Reading Goals */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowGoalHubModal(true);
              }}
              className="btn-secondary"
              title="Community Reading Goals & Stretch Unlock Rewards"
            >
              <Target size={16} color="#ffd700" />
              <span className="hide-mobile">Goals</span>
            </button>

            {/* Hype Train 2.0 */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowHypeTrainModal(true);
              }}
              className="btn-secondary"
              title="The Lore Hype Train & Guild Surge Engine"
            >
              <Zap size={16} color="#ffd700" />
              <span className="hide-mobile">Hype Train</span>
            </button>

            {/* Channel Leaderboards */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowLeaderboardsModal(true);
              }}
              className="btn-secondary"
              title="Channel Patron & Reading Leaderboard Podium"
            >
              <Award size={16} color="#ffd700" />
              <span className="hide-mobile">Leaderboard</span>
            </button>

            {/* Literary Chat Studio */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowChatStudioModal(true);
              }}
              className="btn-secondary"
              title="Chat Appearance Customizer & Name Glow Studio"
            >
              <Palette size={16} color="var(--accent-primary)" />
              <span className="hide-mobile">Chat Studio</span>
            </button>

            {/* Discord Sync */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowDiscordSyncModal(true);
              }}
              className="btn-secondary"
              title="Discord Server & Subscriber Role Sync"
            >
              <MessageCircle size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Discord</span>
            </button>

            {/* Viewer Drops & Loot Vault */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowDropsModal(true);
              }}
              className="btn-secondary"
              title="Live Broadcast Drops & Loot Vault"
            >
              <Gift size={16} color="var(--accent-success)" />
              <span className="hide-mobile">Drops</span>
            </button>

            {/* Stream Deck Shortcuts */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowStreamDeckModal(true);
              }}
              className="btn-secondary"
              title="Elgato Stream Deck & Broadcaster Hotkeys Matrix"
            >
              <Keyboard size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Stream Deck</span>
            </button>

            {/* VOD Clip Editor */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowClipEditorModal(true);
              }}
              className="btn-secondary"
              title="VOD Chapter Highlights & TikTok/Shorts Trimmer"
            >
              <Scissors size={16} color="#ffd700" />
              <span className="hide-mobile">Clips</span>
            </button>

            {/* Channel Rules Gate */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowChannelRulesModal(true);
              }}
              className="btn-secondary"
              title="Channel Rules & Spoiler Agreement Gate"
            >
              <ShieldCheck size={16} color="var(--accent-success)" />
              <span className="hide-mobile">Rules</span>
            </button>

            {/* 3D Stream Bookshelf */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowBookshelfModal(true);
              }}
              className="btn-secondary"
              title="3D Stream Bookshelf & Trophy Showcase Studio"
            >
              <Library size={16} color="var(--accent-primary)" />
              <span className="hide-mobile">Shelf</span>
            </button>

            {/* Sub Milestones */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowSubMilestonesModal(true);
              }}
              className="btn-secondary"
              title="Subscriber Loyalty Tenure & Reading Streaks"
            >
              <Crown size={16} color="#ffd700" />
              <span className="hide-mobile">Streaks</span>
            </button>

            {/* Gift Bomb */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowGiftBombModal(true);
              }}
              className="btn-secondary"
              title="Community Gift Subscriptions & Bomb Shower"
            >
              <Gift size={16} color="#ffd700" />
              <span className="hide-mobile">Gift Bomb</span>
            </button>

            {/* Points Studio */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowPointsStudioModal(true);
              }}
              className="btn-secondary"
              title="Sparks & Channel Points Custom Rewards Studio"
            >
              <Sparkles size={16} color="var(--accent-primary)" />
              <span className="hide-mobile">Points</span>
            </button>

            {/* Commercial Break */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowCommercialModal(true);
              }}
              className="btn-secondary"
              title="Chapter Intermission & Cozy Tea Break Manager"
            >
              <Coffee size={16} color="var(--accent-teal)" />
              <span className="hide-mobile">Break</span>
            </button>

            {/* Dual Audio Mixer */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowDualAudioModal(true);
              }}
              className="btn-secondary"
              title="Dual-Narrator Gain & Foley Ducking Mixer"
            >
              <Sliders size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Mixer</span>
            </button>

            {/* Pinned Announcements */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowPinnedModal(true);
              }}
              className="btn-secondary"
              title="Pinned Chat Announcements & Megaphone Banner Studio"
            >
              <Megaphone size={16} color="#ffd700" />
              <span className="hide-mobile">Pin</span>
            </button>

            {/* VOD Chapters */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowVodMarkersModal(true);
              }}
              className="btn-secondary"
              title="Timestamped Chapter VOD Markers & Story Index"
            >
              <BookOpen size={16} color="var(--accent-teal)" />
              <span className="hide-mobile">Chapters</span>
            </button>

            {/* Predictions Pool */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowPredictionsModal(true);
              }}
              className="btn-secondary"
              title="Literary Plot Predictions & Sparks Staking Pool"
            >
              <TrendingUp size={16} color="var(--accent-primary)" />
              <span className="hide-mobile">Predict</span>
            </button>

            {/* Quiet Library Whispers */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowWhispersModal(true);
              }}
              className="btn-secondary"
              title="Quiet Library Whispers & Co-Reader Direct Messages"
            >
              <MessageSquare size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Whispers</span>
            </button>

            {/* Mod Action Audit Trail */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowModAuditModal(true);
              }}
              className="btn-secondary"
              title="High Council Moderation Action Log & Safety Audit Trail"
            >
              <ShieldAlert size={16} color="#ffd700" />
              <span className="hide-mobile">Mod Log</span>
            </button>

            {/* Content Warnings */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowContentWarnModal(true);
              }}
              className="btn-secondary"
              title="Literary Content & Trigger Warnings Studio"
            >
              <Tag size={16} color="var(--accent-primary)" />
              <span className="hide-mobile">Warnings</span>
            </button>

            {/* Stream Latency Engine */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowLatencyModal(true);
              }}
              className="btn-secondary"
              title="Stream Latency & Audio-Only Commuter Mode Switcher"
            >
              <Radio size={16} color="var(--accent-teal)" />
              <span className="hide-mobile">Latency</span>
            </button>

            {/* Live Chat Emote Combos */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowEmoteComboWidget(true);
              }}
              className="btn-secondary"
              title="Live Chat Emote Combos & Reading Hype Multiplier"
            >
              <Flame size={16} color="#ff0055" />
              <span className="hide-mobile">Combos</span>
            </button>

            {/* Mystery Book Box Prize Wheel */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowMysteryBoxModal(true);
              }}
              className="btn-secondary"
              title="Mystery Book Box & Community Prize Wheel Giveaway"
            >
              <Gift size={16} color="#ffd700" />
              <span className="hide-mobile">Prize Wheel</span>
            </button>

            {/* Live Reading Telemetry */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowTelemetryModal(true);
              }}
              className="btn-secondary"
              title="Live Reading Velocity & Vocabulary Telemetry HUD"
            >
              <Activity size={16} color="var(--accent-teal)" />
              <span className="hide-mobile">Telemetry</span>
            </button>

            {/* Lore Master Trivia Gauntlet */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowTriviaArenaModal(true);
              }}
              className="btn-secondary"
              title="Lore Master Chapter Trivia Gauntlet & Quiz Duel"
            >
              <Swords size={16} color="var(--accent-primary)" />
              <span className="hide-mobile">Trivia</span>
            </button>

            {/* Narrator Vocal Warmup */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowVocalWarmupModal(true);
              }}
              className="btn-secondary"
              title="Narrator Vocal Warmup & Breath Control Studio"
            >
              <Mic size={16} color="#ffd700" />
              <span className="hide-mobile">Vocal Suite</span>
            </button>

            {/* Co-Stream Voice Theatre */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowCoStreamRolesModal(true);
              }}
              className="btn-secondary"
              title="Co-Stream Voice Theatre & Full Cast Role Splitter"
            >
              <Users size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Cast Roles</span>
            </button>

            {/* Broadcaster Achievements */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowAchievementsModal(true);
              }}
              className="btn-secondary"
              title="Broadcaster Quests & Path to Master Storyteller"
            >
              <Trophy size={16} color="#ffd700" />
              <span className="hide-mobile">Quests</span>
            </button>

            {/* VIP Reader Badges */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowVipFlairsModal(true);
              }}
              className="btn-secondary"
              title="Archivist VIP Reader Badges & Custom Chat Flairs"
            >
              <Gem size={16} color="#00ff88" />
              <span className="hide-mobile">VIP</span>
            </button>

            {/* Live Chapter Recap */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowChapterRecapModal(true);
              }}
              className="btn-secondary"
              title="Live Chapter Summary & Previously On... Catch-Up HUD"
            >
              <FileText size={16} color="var(--accent-primary)" />
              <span className="hide-mobile">Recap</span>
            </button>

            {/* Vocal Dynamics Master Rack */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowVocalDynamicsModal(true);
              }}
              className="btn-secondary"
              title="Vocal Dynamics, Noise Gate & De-Esser Studio"
            >
              <Sliders size={16} color="#ffd700" />
              <span className="hide-mobile">Rack</span>
            </button>

            {/* Squad 3D Audio Spatializer */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowSpatialAudioModal(true);
              }}
              className="btn-secondary"
              title="Squad Multi-Narrator 3D Audio Spatializer & Soundstage"
            >
              <Headphones size={16} color="var(--accent-teal)" />
              <span className="hide-mobile">Spatial</span>
            </button>

            {/* Community Reading Habits Hub */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowHabitsHubModal(true);
              }}
              className="btn-secondary"
              title="Community Reading Habits & Daily Streak Hub"
            >
              <Flame size={16} color="#ff8c00" />
              <span className="hide-mobile">Habits</span>
            </button>

            {/* Literary Dono TTS Studio */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowDonationTtsModal(true);
              }}
              className="btn-secondary"
              title="Literary TTS Custom Voices & Sparks Dono Reader"
            >
              <Volume2 size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Dono TTS</span>
            </button>

            {/* Sub Gifting Leaderboard */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowSubGiftModal(true);
              }}
              className="btn-secondary"
              title="Grand Patron Sub Gifting Leaderboard"
            >
              <Crown size={16} color="#ffd700" />
              <span className="hide-mobile">Top Gifters</span>
            </button>

            {/* Highlight Reel Generator */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowHighlightReelModal(true);
              }}
              className="btn-secondary"
              title="Narrator Highlight Reel & Shorts Generator"
            >
              <Film size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Shorts</span>
            </button>

            {/* Chat Verification Gate */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowChatVerifyModal(true);
              }}
              className="btn-secondary"
              title="Arcane Scribe Gate & Chat Verification Citadel"
            >
              <ShieldCheck size={16} color="#00ff88" />
              <span className="hide-mobile">Verify</span>
            </button>

            {/* Reading Pacing Metronome */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowPacingMetronomeModal(true);
              }}
              className="btn-secondary"
              title="Live Reading Speedometer & Syllable Metronome"
            >
              <Gauge size={16} color="var(--accent-primary)" />
              <span className="hide-mobile">Cadence</span>
            </button>

            {/* Atmosphere Soundtrack & Spotify Deck */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowSoundtrackModal(true);
              }}
              className="btn-secondary"
              title="Narrator Atmosphere Soundtrack & Spotify Deck"
            >
              <Radio size={16} color="var(--accent-teal)" />
              <span className="hide-mobile">Soundtrack</span>
            </button>

            {/* Chapter Cliffhanger Predictions */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowCliffhangerWagerModal(true);
              }}
              className="btn-secondary"
              title="Chapter Cliffhanger Prediction Wagers"
            >
              <Dices size={16} color="#ffd700" />
              <span className="hide-mobile">Wagers</span>
            </button>

            {/* Custom Emote Slots Matrix */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowEmoteSlotsModal(true);
              }}
              className="btn-secondary"
              title="Custom Emote Slots & Sub Rewards Matrix"
            >
              <Smile size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Emotes</span>
            </button>

            {/* Pronunciation Cheat Sheet */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowCheatSheetModal(true);
              }}
              className="btn-secondary"
              title="Live Pronunciation Lexicon & Voice Cheat Sheet"
            >
              <BookOpen size={16} color="#ffd700" />
              <span className="hide-mobile">Cheat Sheet</span>
            </button>

            {/* Stage Whisper Backstage Lounge */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowBackstageWhisperModal(true);
              }}
              className="btn-secondary"
              title="Stage Whisper & Backstage Co-Host Lounge"
            >
              <Radio size={16} color="var(--accent-teal)" />
              <span className="hide-mobile">Backstage</span>
            </button>

            {/* Viewer Live Quotation Journal */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowJournalModal(true);
              }}
              className="btn-secondary"
              title="Personal Reading Journal & Margin Notes"
            >
              <Bookmark size={16} color="#ffd700" />
              <span className="hide-mobile">Journal</span>
            </button>

            {/* Live Rare Book Auction */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowAuctionModal(true);
              }}
              className="btn-secondary"
              title="Rare Grimoire & Signed Book Auction Gauntlet"
            >
              <Gavel size={16} color="var(--accent-danger)" />
              <span className="hide-mobile">Auction</span>
            </button>

            {/* RPG Skill Tree */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowSkillTreeModal(true);
              }}
              className="btn-secondary"
              title="Master Chronicler RPG Skill Tree & Stream Perks"
            >
              <TreePine size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Skill Tree</span>
            </button>

            {/* Stream Tag Taxonomy */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowStreamTagTaxonomyModal(true);
              }}
              className="btn-secondary"
              title="Literary Mood & Stream Tag Taxonomy"
            >
              <Tag size={16} color="var(--accent-teal)" />
              <span className="hide-mobile">Tags</span>
            </button>

            {/* 1v1 Monologue Duel */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowNarratorFaceOffModal(true);
              }}
              className="btn-secondary"
              title="1v1 Dramatic Monologue Face-Off Arena"
            >
              <Swords size={16} color="#ff3b3b" />
              <span className="hide-mobile">Face-Off</span>
            </button>

            {/* Founding Readers Wall of Honor */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowSubscribersWallModal(true);
              }}
              className="btn-secondary"
              title="Founding Readers & Grand Scribe Wall of Honor"
            >
              <Crown size={16} color="#ffd700" />
              <span className="hide-mobile">Wall of Honor</span>
            </button>

            {/* Pre-Stream Vocal Warmup Trainer */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowVocalWarmupTrainerModal(true);
              }}
              className="btn-secondary"
              title="Pre-Stream Vocal Warmup Piano & Breathwork"
            >
              <Music size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Vocal Warmup</span>
            </button>

            {/* Chat Throttle & Sub-Only Cockpit */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowChatThrottleModal(true);
              }}
              className="btn-secondary"
              title="Chat Flow Pacer & Sub-Only Moderation Cockpit"
            >
              <Lock size={16} color="var(--accent-danger)" />
              <span className="hide-mobile">Chat Gate</span>
            </button>

            {/* Live Book Progress Tracker */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowBookProgressModal(true);
              }}
              className="btn-secondary"
              title="Live Book Progress Tracker & E-Reader Sync"
            >
              <BookOpen size={16} color="var(--accent-teal)" />
              <span className="hide-mobile">Progress</span>
            </button>

            {/* Community Sparks Pinata */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowSparksPinataModal(true);
              }}
              className="btn-secondary"
              title="The Lore Dragon Sparks Piñata & Gold Leaf Shower"
            >
              <Flame size={16} color="#ffd700" />
              <span className="hide-mobile">Piñata</span>
            </button>

            {/* World Lore Atlas */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowWorldAtlasModal(true);
              }}
              className="btn-secondary"
              title="World Lore Atlas & Interactive Realm Map"
            >
              <Compass size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Atlas</span>
            </button>

            {/* Cozy Intermission Ad Break */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowAdBreakModal(true);
              }}
              className="btn-secondary"
              title="Cozy Intermission & Ad-Revenue Deck"
            >
              <Coffee size={16} color="#ffd700" />
              <span className="hide-mobile">Intermission</span>
            </button>

            {/* Live Reader Sentiment Heatmap */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowSentimentHeatmapModal(true);
              }}
              className="btn-secondary"
              title="Live Chapter Sentiment & Emotion Heatmap"
            >
              <Activity size={16} color="var(--accent-teal)" />
              <span className="hide-mobile">Sentiment</span>
            </button>

            {/* Seasonal Guild Battlepass */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowGuildBattlepassModal(true);
              }}
              className="btn-secondary"
              title="Archivist Guild Seasonal Battlepass"
            >
              <Trophy size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Battlepass</span>
            </button>

            {/* Narrator Auto-Host Teams */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowAutoHostTeamsModal(true);
              }}
              className="btn-secondary"
              title="Narrator Guilds & Auto-Host Raid Matrix"
            >
              <Users size={16} color="var(--accent-danger)" />
              <span className="hide-mobile">Auto-Host</span>
            </button>

            {/* Multi-Cam Stage Director */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowMultiCamModal(true);
              }}
              className="btn-secondary"
              title="Studio Scene Director & Multi-Cam Controller"
            >
              <Video size={16} color="var(--accent-teal)" />
              <span className="hide-mobile">Multi-Cam</span>
            </button>

            {/* Custom Overlay Themes */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowOverlayThemesModal(true);
              }}
              className="btn-secondary"
              title="Stream Overlay & Parchment Theme Studio"
            >
              <Palette size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Themes</span>
            </button>

            {/* Screen FX Emote Cannons */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowScreenFxModal(true);
              }}
              className="btn-secondary"
              title="Custom Hype Emote Walls & Sparks Cannons"
            >
              <Sparkles size={16} color="#ffd700" />
              <span className="hide-mobile">Screen FX</span>
            </button>

            {/* Mobile Teleprompter Remote */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowTeleprompterModal(true);
              }}
              className="btn-secondary"
              title="Mobile Companion Teleprompter & Remote"
            >
              <Smartphone size={16} color="#00ff88" />
              <span className="hide-mobile">Prompter</span>
            </button>

            {/* Studio Acoustic Room Optimizer */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowAcousticModal(true);
              }}
              className="btn-secondary"
              title="Studio Noise Gate & Room Acoustic Optimizer"
            >
              <Mic size={16} color="var(--accent-teal)" />
              <span className="hide-mobile">Acoustics</span>
            </button>

            {/* Character Voice Morph Preset Pad */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowVoicePadModal(true);
              }}
              className="btn-secondary"
              title="Voice Morph Preset Soundboard Pad"
            >
              <Volume2 size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Voice Pad</span>
            </button>

            {/* Dual Monitor Audio Routing */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowAudioRoutingModal(true);
              }}
              className="btn-secondary"
              title="Dual Monitor & Split Audio Routing Matrix"
            >
              <Headphones size={16} color="#ffd700" />
              <span className="hide-mobile">Routing</span>
            </button>

            {/* Reading Speed Tachometer */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowWpmModal(true);
              }}
              className="btn-secondary"
              title="Reading Speed & Cadence Tachometer"
            >
              <Gauge size={16} color="var(--accent-danger)" />
              <span className="hide-mobile">WPM Meter</span>
            </button>

            {/* Community Reading Boss Raid */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowBossRaidModal(true);
              }}
              className="btn-secondary"
              title="Community Reading Boss Raid & Encounter"
            >
              <Swords size={16} color="#ff3b3b" />
              <span className="hide-mobile">Boss Raid</span>
            </button>

            {/* Grand Tournament Bracket */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowTournamentModal(true);
              }}
              className="btn-secondary"
              title="Grand Tournament Bracket & Book of the Year"
            >
              <Trophy size={16} color="#ffd700" />
              <span className="hide-mobile">Tournament</span>
            </button>

            {/* Book Box Giveaways */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowGiveawayModal(true);
              }}
              className="btn-secondary"
              title="Community Book Box Giveaway & Roll Picker"
            >
              <Gift size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Giveaway</span>
            </button>

            {/* Chapter Bookmark Stamps */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowBookmarkStampModal(true);
              }}
              className="btn-secondary"
              title="Chapter Bookmark Stamp & Marginalia Wall"
            >
              <Bookmark size={16} color="var(--accent-teal)" />
              <span className="hide-mobile">Marginalia</span>
            </button>

            {/* Sub Tier 3 Scribe Grimoire Fonts */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowCustomFontModal(true);
              }}
              className="btn-secondary"
              title="Tier 3 Scribe Grimoire & Custom Fonts"
            >
              <Type size={16} color="#ffd700" />
              <span className="hide-mobile">Grimoire</span>
            </button>

            {/* Print-on-Demand Merch Hub */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowMerchShopModal(true);
              }}
              className="btn-secondary"
              title="Print-on-Demand Merch Store & Shop"
            >
              <ShoppingBag size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Merch Hub</span>
            </button>

            {/* Publisher Bounty Tracker */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowBountyTrackerModal(true);
              }}
              className="btn-secondary"
              title="Publisher Bounty Board & Sponsorships"
            >
              <Award size={16} color="var(--accent-teal)" />
              <span className="hide-mobile">Bounties</span>
            </button>

            {/* Sub-Only Book Club Lounge */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowSubLoungeModal(true);
              }}
              className="btn-secondary"
              title="Subscriber-Only VIP Book Club Salon"
            >
              <MessageSquare size={16} color="#ffd700" />
              <span className="hide-mobile">Sub Salon</span>
            </button>

            {/* Smart Ambient Lighting Sync */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowLightingModal(true);
              }}
              className="btn-secondary"
              title="Smart Ambient Lighting Sync & Hue Bridge"
            >
              <Lightbulb size={16} color="#ffd700" />
              <span className="hide-mobile">Hue Lights</span>
            </button>

            {/* Arcane Moderation Shield */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowModShieldModal(true);
              }}
              className="btn-secondary"
              title="Arcane Moderation Shield & Anti-Spoiler Rules"
            >
              <ShieldAlert size={16} color="var(--accent-danger)" />
              <span className="hide-mobile">AI Mod Shield</span>
            </button>

            {/* 24/7 Silent Study Radio */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowRadioModal(true);
              }}
              className="btn-secondary"
              title="24/7 Silent Study Radio & Pomodoro Room"
            >
              <Radio size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Study Radio</span>
            </button>

            {/* Interactive VOD Archives */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowVodArchivesModal(true);
              }}
              className="btn-secondary"
              title="Interactive VOD Archives & Chapter Scribe"
            >
              <Film size={16} color="var(--accent-teal)" />
              <span className="hide-mobile">VOD Archives</span>
            </button>

            {/* Multi-Cast Audio Drama */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowMultiCastDramaModal(true);
              }}
              className="btn-secondary"
              title="Live Tabletop Audio-Drama & Multi-Cast Voice Staging"
            >
              <Theater size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Multi-Cast</span>
            </button>

            {/* OBS Virtual Camera 3D Keyer */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowObsKeyerModal(true);
              }}
              className="btn-secondary"
              title="OBS Studio Virtual Camera & 3D Medieval Set Keyer"
            >
              <Video size={16} color="var(--accent-teal)" />
              <span className="hide-mobile">3D Set</span>
            </button>

            {/* 9:16 Vertical Clip Transcoder */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowVerticalClipModal(true);
              }}
              className="btn-secondary"
              title="Instant 9:16 TikTok / Reels / Shorts Vertical Transcoder"
            >
              <Smartphone size={16} color="#ffd700" />
              <span className="hide-mobile">9:16 Clip</span>
            </button>

            {/* Stream Deck WebSocket Companion */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowStreamDeckWsModal(true);
              }}
              className="btn-secondary"
              title="Dual-PC Stream Deck WebSocket Companion"
            >
              <Sliders size={16} color="var(--accent-primary)" />
              <span className="hide-mobile">Stream Deck</span>
            </button>

            {/* 3D Spatial Binaural Panner */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowSpatialPannerModal(true);
              }}
              className="btn-secondary"
              title="Surround 5.1 & Spatial Headphone Binaural Panner"
            >
              <Headphones size={16} color="#00ff88" />
              <span className="hide-mobile">3D Audio</span>
            </button>

            {/* Eye-Contact AI Corrector */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowEyeContactModal(true);
              }}
              className="btn-secondary"
              title="Teleprompter Eye-Contact AI Corrector"
            >
              <Eye size={16} color="var(--accent-teal)" />
              <span className="hide-mobile">Eye Contact</span>
            </button>

            {/* Speed-Reading RSVP Flasher */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowRsvpModal(true);
              }}
              className="btn-secondary"
              title="Speed-Reading RSVP Flasher Overlay"
            >
              <Gauge size={16} color="#ffd700" />
              <span className="hide-mobile">RSVP</span>
            </button>

            {/* Macro-Lens Manuscript Zoom Loupe */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowManuscriptZoomModal(true);
              }}
              className="btn-secondary"
              title="Macro-Lens Manuscript Zoom Loupe"
            >
              <Search size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Desk Loupe</span>
            </button>

            {/* Vocal Health Telemetry */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowVocalHealthModal(true);
              }}
              className="btn-secondary"
              title="Voice Fatigue & Vocal Cord Health Telemetry"
            >
              <HeartPulse size={16} color="var(--accent-danger)" />
              <span className="hide-mobile">Vocal Health</span>
            </button>

            {/* Backstage Intercom & Talkback */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowIntercomModal(true);
              }}
              className="btn-secondary"
              title="Backstage Intercom & Producer Talkback Channel"
            >
              <Radio size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Intercom</span>
            </button>

            {/* Guild Territory Wars */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowTerritoryWarsModal(true);
              }}
              className="btn-secondary"
              title="Guild Territory Wars: World Map Conquest"
            >
              <Map size={16} color="var(--accent-teal)" />
              <span className="hide-mobile">Realm Wars</span>
            </button>

            {/* Interactive D20 Skill-Check */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowD20Modal(true);
              }}
              className="btn-secondary"
              title="Interactive D20 Skill-Check Narrative Branching"
            >
              <Dices size={16} color="#ffd700" />
              <span className="hide-mobile">D20 Check</span>
            </button>

            {/* Character Lore Trading Cards */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowLoreCardsModal(true);
              }}
              className="btn-secondary"
              title="Character Inventory & Lore Deck Trading Cards"
            >
              <Layers size={16} color="var(--accent-secondary)" />
              <span className="hide-mobile">Lore Cards</span>
            </button>

            {/* Reader Citadel & 3D Bookshelf */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowCitadelModal(true);
              }}
              className="btn-secondary"
              title="Reader Citadel & 3D Digital Bookshelf Trophy Room"
            >
              <Castle size={16} color="#00ff88" />
              <span className="hide-mobile">3D Citadel</span>
            </button>

            {/* Global Reading Relay */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowRelayModal(true);
              }}
              className="btn-secondary"
              title="Global Speed Reading Relay & 24hr Read-a-thon"
            >
              <Globe size={16} color="#ff3b3b" />
              <span className="hide-mobile">World Relay</span>
            </button>

            {/* CYOA Branching Vote Button */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowBranchHUD(true);
              }}
              className="btn-secondary"
              title="Open Choose Your Own Adventure Live Decision Vote"
            >
              <GitBranch size={16} color="var(--accent-primary)" />
              <span className="hide-mobile">CYOA Vote</span>
            </button>

            {/* Charity Marathon Button */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowCharityModal(true);
              }}
              className="btn-secondary"
              title="Live Book Charity Marathon & Donation Drive"
            >
              <HeartHandshake size={16} color="var(--accent-danger)" />
              <span className="hide-mobile">Charity Drive</span>
            </button>

            {/* Guest Star Stage Launcher */}
            <button
              onClick={() => {
                soundFX.playPop();
                setShowGuestStarModal(true);
              }}
              className={`btn-secondary ${guestStarActive ? 'btn-guest-active' : ''}`}
              title="Guest Star Multi-Reader Stage"
            >
              <Users size={16} />
              <span className="hide-mobile">{guestStarActive ? 'Guest Star (Live)' : 'Guest Star'}</span>
            </button>

            {/* Drop Marker Button */}
            <button
              onClick={() => setShowMarkerModal(true)}
              className="btn-secondary btn-icon-only"
              title="Drop Stream Marker (Alt+M)"
            >
              <Bookmark size={16} />
            </button>

            {/* Clip That Button */}
            <button
              onClick={() => setShowClipModal(true)}
              className="btn-secondary btn-clip-trigger"
              title="Create 30s Clip (Alt+X)"
            >
              <Scissors size={16} />
              <span className="hide-mobile">Clip</span>
            </button>

            {/* Picture-in-Picture Mini-Player */}
            <button
              onClick={() => setShowMiniPlayer(true)}
              className="btn-secondary btn-icon-only"
              title="Mini-Player (PiP)"
            >
              <Minimize2 size={16} />
            </button>

            {/* Share Button */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Stream link copied to clipboard!');
              }}
              className="btn-secondary btn-icon-only"
              title="Share Stream"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Synchronized Community Reading Sprint HUD (Pomodoro Focus) */}
        <ReadingSprintHUD
          isBroadcaster={user?.uid === stream.streamerId}
          onOpenAmbientMixer={() => setShowAmbientMixer(true)}
          onSprintCompleted={(target) => {
            setSprintCompletedTarget(target);
            handleSendMessage(`🎯 Completed a 25-minute reading sprint! (Target: ${target} pages)`);
          }}
        />

        {/* Live Community Sub / Follower Goal */}
        <CommunityGoalWidget />

        {/* Live Predictions Overlay */}
        <PredictionsOverlay />

        {/* Stream Extensions Toolbar & Overlays (Soundboard, Lore Map, Trivia Quiz) */}
        <StreamExtensions
          streamerName={stream.streamerName}
          bookTitle={activeBook?.title || 'Current Book'}
          onSendChatMessage={handleSendMessage}
        />

        {/* Bottom: Live Interactive Synced E-Reader */}
        {activeBook && (
          <div className="synced-reader-section">
            <SyncedReader
              activeBook={activeBook}
              currentPage={stream.currentPage}
              currentParagraph={stream.currentParagraph}
              streamerName={stream.streamerName}
            />
          </div>
        )}

        {/* In-Stream Book Purchases & Goodreads / StoryGraph Shelf Sync */}
        {activeBook && (
          <BookCommercePanel
            book={activeBook}
            streamerName={stream.streamerName}
            onSendChatMessage={handleSendMessage}
          />
        )}

        {/* Streamer Markdown Info Panels */}
        {streamerProfile && streamerProfile.panels && (
          <div className="stream-about-panels-section">
            <h3 className="section-heading">About {streamerProfile.displayName}</h3>
            <div className="twitch-panels-grid">
              {streamerProfile.panels.map(panel => (
                <div key={panel.id} className="twitch-markdown-panel">
                  <div className="panel-header">
                    <h4>{panel.title}</h4>
                  </div>
                  <div className="panel-body">
                    {panel.content.split('\n').map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Twitch Live Chat */}
      <div className="twitch-chat-column">
        <LiveChat
          streamerName={stream.streamerName}
          streamerId={stream.streamerId}
          messages={messages}
          onSendMessage={handleSendMessage}
          onSendCheer={handleSendCheer}
          onDeleteMessage={handleDeleteMessage}
          onClearChat={handleClearChat}
          onInitiateRaid={handleInitiateRaid}
          emoteOnly={stream.emoteOnly}
          pinnedMessage={stream.pinnedMessage}
          slowModeSeconds={stream.slowModeSeconds}
        />
      </div>

      {/* Guest Star Modal */}
      {showGuestStarModal && (
        <GuestStarModal
          isOpen={showGuestStarModal}
          isActiveOnStream={guestStarActive}
          onToggleActiveOnStream={setGuestStarActive}
          layout={guestLayout}
          onChangeLayout={setGuestLayout}
          participants={guestParticipants}
          onUpdateParticipants={setGuestParticipants}
          onClose={() => setShowGuestStarModal(false)}
        />
      )}

      {/* Clip Creation Modal */}
      {showClipModal && activeBook && (
        <ClipCreator
          streamerId={stream.streamerId}
          streamerName={stream.streamerName}
          streamerAvatar={streamerProfile?.avatarUrl}
          bookId={activeBook.id}
          bookTitle={activeBook.title}
          bookAuthor={activeBook.author}
          bookCoverUrl={activeBook.coverUrl}
          onClose={() => setShowClipModal(false)}
        />
      )}

      {/* Stream Marker Modal */}
      {showMarkerModal && (
        <StreamMarkerModal
          onAddMarker={handleAddStreamMarker}
          onClose={() => setShowMarkerModal(false)}
        />
      )}

      {/* Subscriptions & Gift Subs Modal */}
      {showSubModal && (
        <SubscriptionModal
          streamerName={stream.streamerName}
          streamerId={stream.streamerId}
          avatarUrl={streamerProfile?.avatarUrl}
          onSubscribed={(tierName) => {
            handleSendMessage(`⭐ Just subscribed with ${tierName}! Excited to read along!`);
          }}
          onGifted={(count, total) => {
            handleSendMessage(`🎁 Just gifted ${count} subscriptions ($${total}) to the reading community! 🎉`);
          }}
          onClose={() => setShowSubModal(false)}
        />
      )}

      {/* Choose Your Own Adventure Live Branching HUD */}
      {showBranchHUD && (
        <StoryBranchHUD
          onOptionSelected={(winningOption) => {
            handleSendMessage(`🗺️ Audience voted for: "${winningOption.label}"! Turning to page ${winningOption.targetPage}!`);
          }}
          onClose={() => setShowBranchHUD(false)}
        />
      )}

      {/* Charity Marathon Donation & Milestone Widget */}
      {showCharityModal && (
        <CharityMarathonWidget
          onDonationSubmitted={(amount, donorName, msg) => {
            handleSendMessage(`💖 ${donorName} donated $${amount.toFixed(2)} to charity! "${msg}"`);
          }}
          onClose={() => setShowCharityModal(false)}
        />
      )}

      {/* Broadcast Moments & Climax Badges Modal */}
      {showMomentsModal && (
        <ReaderMomentsModal
          isStreamer={user?.uid === stream.streamerId}
          streamerName={stream.streamerName}
          onMomentClaimed={(moment) => {
            handleSendMessage(`🏆 Claimed the "${moment.momentTitle}" ${moment.badgeRarity} Moment Badge!`);
          }}
          onClose={() => setShowMomentsModal(false)}
        />
      )}

      {/* Viewer Soundboard & Channel Points Sound Alerts */}
      {showSoundboardModal && (
        <ViewerSoundboardModal
          streamerName={stream.streamerName}
          onAlertTriggered={(alert) => {
            handleSendMessage(`🔊 Played Sound Alert: ${alert.icon} ${alert.name} (-${alert.pointsCost} pts)`);
          }}
          onClose={() => setShowSoundboardModal(false)}
        />
      )}

      {/* VOD Chapters & Interactive Transcript Timeline */}
      {showTranscriptModal && (
        <VodTranscriptViewer
          onJumpToTimestamp={(secs, page) => {
            handleSendMessage(`📖 Jumped transcript to ${Math.floor(secs / 60)}m (Page ${page})`);
          }}
          onClose={() => setShowTranscriptModal(false)}
        />
      )}

      {/* 4-Way Squad Co-Stream Multiview */}
      {showSquadMulti && (
        <SquadMultiviewPlayer
          onClose={() => setShowSquadMulti(false)}
        />
      )}

      {/* Spoiler-Shielded Lore & Character Codex */}
      {showLoreWikiModal && (
        <LoreGlossaryOverlay
          currentPage={stream.currentPage}
          bookTitle={activeBook?.title || 'Current Book'}
          onClose={() => setShowLoreWikiModal(false)}
        />
      )}

      {/* Community Co-Reading Watch Party Lounge */}
      {showWatchPartyModal && (
        <WatchPartyRoomModal
          onClose={() => setShowWatchPartyModal(false)}
        />
      )}

      {/* 24-Hour Read-A-Thon Marathon Hub */}
      {showMarathonModal && (
        <MarathonScheduleHubModal
          onClose={() => setShowMarathonModal(false)}
        />
      )}

      {/* OBS Browser Source Stream Overlay Studio */}
      {showOBSOverlayModal && (
        <OBSOverlayStudioModal
          streamerName={stream.streamerName}
          onClose={() => setShowOBSOverlayModal(false)}
        />
      )}

      {/* Streamer Shield Mode */}
      {showShieldModal && (
        <ShieldModeModal
          streamerName={stream.streamerName}
          onClose={() => setShowShieldModal(false)}
        />
      )}

      {/* Streamer Merch Storefront */}
      {showMerchModal && (
        <MerchStorefrontModal
          streamerName={stream.streamerName}
          onClose={() => setShowMerchModal(false)}
        />
      )}

      {/* Multi-Voice Character Cast Matrix */}
      {showCastMatrixModal && (
        <CharacterCastMatrixModal
          onClose={() => setShowCastMatrixModal(false)}
        />
      )}

      {/* End-of-Stream Raid Station */}
      {showRaidStationModal && (
        <RaidStationModal
          streamerName={stream.streamerName}
          onClose={() => setShowRaidStationModal(false)}
        />
      )}

      {/* Channel Roles & Badges */}
      {showRolesModal && (
        <ChannelRolesModal
          streamerName={stream.streamerName}
          onClose={() => setShowRolesModal(false)}
        />
      )}

      {/* Stream Health Inspector */}
      {showStreamHealthModal && (
        <StreamHealthModal
          onClose={() => setShowStreamHealthModal(false)}
        />
      )}

      {/* Community Reading Goals Hub */}
      {showGoalHubModal && (
        <CommunityGoalHubModal
          streamerName={stream.streamerName}
          onClose={() => setShowGoalHubModal(false)}
        />
      )}

      {/* The Lore Hype Train 2.0 */}
      {showHypeTrainModal && (
        <HypeTrainEngineModal
          streamerName={stream.streamerName}
          onClose={() => setShowHypeTrainModal(false)}
        />
      )}

      {/* Channel Leaderboards */}
      {showLeaderboardsModal && (
        <StreamLeaderboardsModal
          streamerName={stream.streamerName}
          onClose={() => setShowLeaderboardsModal(false)}
        />
      )}

      {/* Literary Chat Studio */}
      {showChatStudioModal && (
        <ChatSettingsStudioModal
          onClose={() => setShowChatStudioModal(false)}
        />
      )}

      {/* Discord Role Sync */}
      {showDiscordSyncModal && (
        <DiscordRoleSyncModal
          streamerName={stream.streamerName}
          onClose={() => setShowDiscordSyncModal(false)}
        />
      )}

      {/* Viewer Drops & Loot Vault */}
      {showDropsModal && (
        <ViewerDropsModal
          onClose={() => setShowDropsModal(false)}
        />
      )}

      {/* Stream Deck Shortcuts */}
      {showStreamDeckModal && (
        <StreamDeckShortcutsModal
          onClose={() => setShowStreamDeckModal(false)}
        />
      )}

      {/* VOD Clip Editor & Shorts Trimmer */}
      {showClipEditorModal && (
        <ClipEditorStudioModal
          streamerName={stream.streamerName}
          onClose={() => setShowClipEditorModal(false)}
        />
      )}

      {/* Channel Rules & Spoiler Agreement Gate */}
      {showChannelRulesModal && (
        <ChannelRulesGateModal
          streamerName={stream.streamerName}
          onClose={() => setShowChannelRulesModal(false)}
        />
      )}

      {/* 3D Stream Bookshelf Showcase */}
      {showBookshelfModal && (
        <BookshelfCustomizerModal
          streamerName={stream.streamerName}
          onClose={() => setShowBookshelfModal(false)}
        />
      )}

      {/* Subscriber Loyalty Tenure & Streaks */}
      {showSubMilestonesModal && (
        <SubMilestonesModal
          streamerName={stream.streamerName}
          onClose={() => setShowSubMilestonesModal(false)}
        />
      )}

      {/* Community Gift Bomb */}
      {showGiftBombModal && (
        <CommunityGiftBombModal
          streamerName={stream.streamerName}
          onClose={() => setShowGiftBombModal(false)}
        />
      )}

      {/* Channel Points Custom Rewards Studio */}
      {showPointsStudioModal && (
        <ChannelPointsStudioModal
          streamerName={stream.streamerName}
          onClose={() => setShowPointsStudioModal(false)}
        />
      )}

      {/* Chapter Intermission Tea Break */}
      {showCommercialModal && (
        <CommercialBreakModal
          streamerName={stream.streamerName}
          onClose={() => setShowCommercialModal(false)}
        />
      )}

      {/* Dual-Narrator Audio Mixer */}
      {showDualAudioModal && (
        <DualAudioMixerModal
          streamerName={stream.streamerName}
          onClose={() => setShowDualAudioModal(false)}
        />
      )}

      {/* Pinned Chat Announcements */}
      {showPinnedModal && (
        <PinnedMessageStudioModal
          streamerName={stream.streamerName}
          onClose={() => setShowPinnedModal(false)}
        />
      )}

      {/* Timestamped VOD Chapter Index */}
      {showVodMarkersModal && (
        <VodChapterMarkersModal
          streamerName={stream.streamerName}
          onClose={() => setShowVodMarkersModal(false)}
        />
      )}

      {/* Literary Predictions Pool */}
      {showPredictionsModal && (
        <CommunityPredictionsModal
          streamerName={stream.streamerName}
          onClose={() => setShowPredictionsModal(false)}
        />
      )}

      {/* Quiet Library Whispers */}
      {showWhispersModal && (
        <WhisperMessagesModal
          onClose={() => setShowWhispersModal(false)}
        />
      )}

      {/* High Council Mod Action Log */}
      {showModAuditModal && (
        <ModActionAuditLogModal
          streamerName={stream.streamerName}
          onClose={() => setShowModAuditModal(false)}
        />
      )}

      {/* Content Classification & Warnings */}
      {showContentWarnModal && (
        <ContentClassificationModal
          streamerName={stream.streamerName}
          onClose={() => setShowContentWarnModal(false)}
        />
      )}

      {/* Stream Latency Engine */}
      {showLatencyModal && (
        <StreamLatencySettingsModal
          onClose={() => setShowLatencyModal(false)}
        />
      )}

      {/* Live Chat Emote Combos */}
      {showEmoteComboWidget && (
        <ChatEmoteComboWidget
          onClose={() => setShowEmoteComboWidget(false)}
        />
      )}

      {/* Mystery Book Box Prize Wheel */}
      {showMysteryBoxModal && (
        <MysteryBookBoxModal
          streamerName={stream.streamerName}
          onClose={() => setShowMysteryBoxModal(false)}
        />
      )}

      {/* Live Reading Telemetry */}
      {showTelemetryModal && (
        <ReadingTelemetryModal
          streamerName={stream.streamerName}
          onClose={() => setShowTelemetryModal(false)}
        />
      )}

      {/* Lore Master Trivia Gauntlet */}
      {showTriviaArenaModal && (
        <BookTriviaArenaModal
          streamerName={stream.streamerName}
          onClose={() => setShowTriviaArenaModal(false)}
        />
      )}

      {/* Narrator Vocal Warmup */}
      {showVocalWarmupModal && (
        <VocalWarmupStudioModal
          streamerName={stream.streamerName}
          onClose={() => setShowVocalWarmupModal(false)}
        />
      )}

      {/* Co-Stream Voice Theatre */}
      {showCoStreamRolesModal && (
        <CoStreamRoleSplitterModal
          streamerName={stream.streamerName}
          onClose={() => setShowCoStreamRolesModal(false)}
        />
      )}

      {/* Broadcaster Achievements */}
      {showAchievementsModal && (
        <CreatorAchievementsModal
          streamerName={stream.streamerName}
          onClose={() => setShowAchievementsModal(false)}
        />
      )}

      {/* VIP Reader Badges */}
      {showVipFlairsModal && (
        <VipReaderFlairsModal
          streamerName={stream.streamerName}
          onClose={() => setShowVipFlairsModal(false)}
        />
      )}

      {/* Live Chapter Recap */}
      {showChapterRecapModal && (
        <LiveChapterRecapModal
          streamerName={stream.streamerName}
          onClose={() => setShowChapterRecapModal(false)}
        />
      )}

      {/* Vocal Dynamics Master Rack */}
      {showVocalDynamicsModal && (
        <VocalDynamicsRackModal
          streamerName={stream.streamerName}
          onClose={() => setShowVocalDynamicsModal(false)}
        />
      )}

      {/* Squad 3D Audio Spatializer */}
      {showSpatialAudioModal && (
        <SquadSpatialAudioModal
          streamerName={stream.streamerName}
          onClose={() => setShowSpatialAudioModal(false)}
        />
      )}

      {/* Community Reading Habits Hub */}
      {showHabitsHubModal && (
        <ReadingHabitsHubModal
          streamerName={stream.streamerName}
          onClose={() => setShowHabitsHubModal(false)}
        />
      )}

      {/* Literary Dono TTS Studio */}
      {showDonationTtsModal && (
        <DonationTtsStudioModal
          streamerName={stream.streamerName}
          onClose={() => setShowDonationTtsModal(false)}
        />
      )}

      {/* Sub Gifting Leaderboard */}
      {showSubGiftModal && (
        <SubGiftLeaderboardModal
          streamerName={stream.streamerName}
          onClose={() => setShowSubGiftModal(false)}
        />
      )}

      {/* Highlight Reel Generator */}
      {showHighlightReelModal && (
        <HighlightReelGeneratorModal
          streamerName={stream.streamerName}
          onClose={() => setShowHighlightReelModal(false)}
        />
      )}

      {/* Chat Verification Gate */}
      {showChatVerifyModal && (
        <ChatVerificationModal
          streamerName={stream.streamerName}
          onClose={() => setShowChatVerifyModal(false)}
        />
      )}

      {/* Reading Pacing Metronome */}
      {showPacingMetronomeModal && (
        <ReadingPacingPacerModal
          streamerName={stream.streamerName}
          onClose={() => setShowPacingMetronomeModal(false)}
        />
      )}

      {/* Atmosphere Soundtrack & Spotify Deck */}
      {showSoundtrackModal && (
        <SoundtrackIntegrationModal
          streamerName={stream.streamerName}
          onClose={() => setShowSoundtrackModal(false)}
        />
      )}

      {/* Chapter Cliffhanger Predictions */}
      {showCliffhangerWagerModal && (
        <CliffhangerWagersModal
          streamerName={stream.streamerName}
          onClose={() => setShowCliffhangerWagerModal(false)}
        />
      )}

      {/* Custom Emote Slots Matrix */}
      {showEmoteSlotsModal && (
        <EmoteSlotsManagerModal
          streamerName={stream.streamerName}
          onClose={() => setShowEmoteSlotsModal(false)}
        />
      )}

      {/* Pronunciation Cheat Sheet */}
      {showCheatSheetModal && (
        <NarratorCheatSheetModal
          streamerName={stream.streamerName}
          onClose={() => setShowCheatSheetModal(false)}
        />
      )}

      {/* Stage Whisper Backstage Lounge */}
      {showBackstageWhisperModal && (
        <BackstageWhisperModal
          streamerName={stream.streamerName}
          onClose={() => setShowBackstageWhisperModal(false)}
        />
      )}

      {/* Viewer Live Quotation Journal */}
      {showJournalModal && (
        <ViewerJournalBookmarksModal
          streamerName={stream.streamerName}
          onClose={() => setShowJournalModal(false)}
        />
      )}

      {/* Live Rare Book Auction */}
      {showAuctionModal && (
        <CommunityAuctionModal
          streamerName={stream.streamerName}
          onClose={() => setShowAuctionModal(false)}
        />
      )}

      {/* RPG Skill Tree */}
      {showSkillTreeModal && (
        <NarratorSkillTreeModal
          streamerName={stream.streamerName}
          onClose={() => setShowSkillTreeModal(false)}
        />
      )}

      {/* Stream Tag Taxonomy */}
      {showStreamTagTaxonomyModal && (
        <StreamTagTaxonomyModal
          streamerName={stream.streamerName}
          onClose={() => setShowStreamTagTaxonomyModal(false)}
        />
      )}

      {/* 1v1 Monologue Duel */}
      {showNarratorFaceOffModal && (
        <NarratorFaceOffModal
          streamerName={stream.streamerName}
          onClose={() => setShowNarratorFaceOffModal(false)}
        />
      )}

      {/* Founding Readers Wall of Honor */}
      {showSubscribersWallModal && (
        <SubscribersWallOfHonorModal
          streamerName={stream.streamerName}
          onClose={() => setShowSubscribersWallModal(false)}
        />
      )}

      {/* Pre-Stream Vocal Warmup Trainer */}
      {showVocalWarmupTrainerModal && (
        <VocalWarmupTrainerModal
          streamerName={stream.streamerName}
          onClose={() => setShowVocalWarmupTrainerModal(false)}
        />
      )}

      {/* Chat Throttle & Sub-Only Cockpit */}
      {showChatThrottleModal && (
        <ChatPacingThrottleModal
          streamerName={stream.streamerName}
          onClose={() => setShowChatThrottleModal(false)}
        />
      )}

      {/* Live Book Progress Tracker */}
      {showBookProgressModal && (
        <ChapterProgressSyncModal
          streamerName={stream.streamerName}
          onClose={() => setShowBookProgressModal(false)}
        />
      )}

      {/* Community Sparks Pinata */}
      {showSparksPinataModal && (
        <CommunitySparksPinataModal
          streamerName={stream.streamerName}
          onClose={() => setShowSparksPinataModal(false)}
        />
      )}

      {/* World Lore Atlas */}
      {showWorldAtlasModal && (
        <WorldLoreAtlasModal
          streamerName={stream.streamerName}
          onClose={() => setShowWorldAtlasModal(false)}
        />
      )}

      {/* Cozy Intermission Ad Break */}
      {showAdBreakModal && (
        <AdBreakCountdownModal
          streamerName={stream.streamerName}
          onClose={() => setShowAdBreakModal(false)}
        />
      )}

      {/* Live Reader Sentiment Heatmap */}
      {showSentimentHeatmapModal && (
        <ReaderSentimentHeatmapModal
          streamerName={stream.streamerName}
          onClose={() => setShowSentimentHeatmapModal(false)}
        />
      )}

      {/* Seasonal Guild Battlepass */}
      {showGuildBattlepassModal && (
        <GuildReadingBattlepassModal
          streamerName={stream.streamerName}
          onClose={() => setShowGuildBattlepassModal(false)}
        />
      )}

      {/* Narrator Auto-Host Teams */}
      {showAutoHostTeamsModal && (
        <AutoHostChannelTeamsModal
          streamerName={stream.streamerName}
          onClose={() => setShowAutoHostTeamsModal(false)}
        />
      )}

      {/* Multi-Cam Stage Director */}
      {showMultiCamModal && (
        <StreamDirectorMultiCamModal
          streamerName={stream.streamerName}
          onClose={() => setShowMultiCamModal(false)}
        />
      )}

      {/* Custom Overlay Themes */}
      {showOverlayThemesModal && (
        <OverlayThemesStudioModal
          streamerName={stream.streamerName}
          onClose={() => setShowOverlayThemesModal(false)}
        />
      )}

      {/* Screen FX Emote Cannons */}
      {showScreenFxModal && (
        <ScreenFxEmoteCannonModal
          streamerName={stream.streamerName}
          onClose={() => setShowScreenFxModal(false)}
        />
      )}

      {/* Mobile Teleprompter Remote */}
      {showTeleprompterModal && (
        <MobileTeleprompterRemoteModal
          streamerName={stream.streamerName}
          onClose={() => setShowTeleprompterModal(false)}
        />
      )}

      {/* Studio Acoustic Room Optimizer */}
      {showAcousticModal && (
        <RoomAcousticOptimizerModal
          streamerName={stream.streamerName}
          onClose={() => setShowAcousticModal(false)}
        />
      )}

      {/* Character Voice Morph Preset Pad */}
      {showVoicePadModal && (
        <VoiceMorphPresetPadModal
          streamerName={stream.streamerName}
          onClose={() => setShowVoicePadModal(false)}
        />
      )}

      {/* Dual Monitor Audio Routing */}
      {showAudioRoutingModal && (
        <BackstageAudioRoutingModal
          streamerName={stream.streamerName}
          onClose={() => setShowAudioRoutingModal(false)}
        />
      )}

      {/* Reading Speed Tachometer */}
      {showWpmModal && (
        <WpmTachometerModal
          streamerName={stream.streamerName}
          onClose={() => setShowWpmModal(false)}
        />
      )}

      {/* Community Reading Boss Raid */}
      {showBossRaidModal && (
        <ReadingBossEncounterModal
          streamerName={stream.streamerName}
          onClose={() => setShowBossRaidModal(false)}
        />
      )}

      {/* Grand Tournament Bracket */}
      {showTournamentModal && (
        <BookTournamentBracketModal
          streamerName={stream.streamerName}
          onClose={() => setShowTournamentModal(false)}
        />
      )}

      {/* Book Box Giveaways */}
      {showGiveawayModal && (
        <BookGiveawayRandomizerModal
          streamerName={stream.streamerName}
          onClose={() => setShowGiveawayModal(false)}
        />
      )}

      {/* Chapter Bookmark Stamps */}
      {showBookmarkStampModal && (
        <ChapterBookmarkStampModal
          streamerName={stream.streamerName}
          onClose={() => setShowBookmarkStampModal(false)}
        />
      )}

      {/* Sub Tier 3 Scribe Grimoire Fonts */}
      {showCustomFontModal && (
        <CustomChannelFontModal
          streamerName={stream.streamerName}
          onClose={() => setShowCustomFontModal(false)}
        />
      )}

      {/* Print-on-Demand Merch Hub */}
      {showMerchShopModal && (
        <PrintOnDemandMerchModal
          streamerName={stream.streamerName}
          onClose={() => setShowMerchShopModal(false)}
        />
      )}

      {/* Publisher Bounty Tracker */}
      {showBountyTrackerModal && (
        <PublisherBountyTrackerModal
          streamerName={stream.streamerName}
          onClose={() => setShowBountyTrackerModal(false)}
        />
      )}

      {/* Sub-Only Book Club Lounge */}
      {showSubLoungeModal && (
        <SubOnlyLoungeModal
          streamerName={stream.streamerName}
          onClose={() => setShowSubLoungeModal(false)}
        />
      )}

      {/* Smart Ambient Lighting Sync */}
      {showLightingModal && (
        <SmartLightingSyncModal
          streamerName={stream.streamerName}
          onClose={() => setShowLightingModal(false)}
        />
      )}

      {/* Arcane Moderation Shield */}
      {showModShieldModal && (
        <AutomatedModShieldRulesModal
          streamerName={stream.streamerName}
          onClose={() => setShowModShieldModal(false)}
        />
      )}

      {/* 24/7 Silent Study Radio */}
      {showRadioModal && (
        <SilentStudyRadioModal
          streamerName={stream.streamerName}
          onClose={() => setShowRadioModal(false)}
        />
      )}

      {/* Interactive VOD Archives */}
      {showVodArchivesModal && (
        <InteractiveVodArchivesModal
          streamerName={stream.streamerName}
          onClose={() => setShowVodArchivesModal(false)}
        />
      )}

      {/* Multi-Cast Audio Drama */}
      {showMultiCastDramaModal && (
        <MultiCastAudioDramaModal
          streamerName={stream.streamerName}
          onClose={() => setShowMultiCastDramaModal(false)}
        />
      )}

      {/* OBS Virtual Camera 3D Keyer */}
      {showObsKeyerModal && (
        <ObsVirtualKeyerModal
          streamerName={stream.streamerName}
          onClose={() => setShowObsKeyerModal(false)}
        />
      )}

      {/* 9:16 Vertical Clip Transcoder */}
      {showVerticalClipModal && (
        <VerticalClipTranscoderModal
          streamerName={stream.streamerName}
          onClose={() => setShowVerticalClipModal(false)}
        />
      )}

      {/* Stream Deck WebSocket Companion */}
      {showStreamDeckWsModal && (
        <StreamDeckWebSocketModal
          streamerName={stream.streamerName}
          onClose={() => setShowStreamDeckWsModal(false)}
        />
      )}

      {/* 3D Spatial Binaural Panner */}
      {showSpatialPannerModal && (
        <SpatialBinauralPannerModal
          streamerName={stream.streamerName}
          onClose={() => setShowSpatialPannerModal(false)}
        />
      )}

      {/* Eye-Contact AI Corrector */}
      {showEyeContactModal && (
        <EyeContactCorrectorModal
          streamerName={stream.streamerName}
          onClose={() => setShowEyeContactModal(false)}
        />
      )}

      {/* Speed-Reading RSVP Flasher */}
      {showRsvpModal && (
        <RsvpSpeedReaderModal
          streamerName={stream.streamerName}
          onClose={() => setShowRsvpModal(false)}
        />
      )}

      {/* Macro-Lens Manuscript Zoom Loupe */}
      {showManuscriptZoomModal && (
        <ManuscriptZoomLoupeModal
          streamerName={stream.streamerName}
          onClose={() => setShowManuscriptZoomModal(false)}
        />
      )}

      {/* Vocal Health Telemetry */}
      {showVocalHealthModal && (
        <VocalHealthTelemetryModal
          streamerName={stream.streamerName}
          onClose={() => setShowVocalHealthModal(false)}
        />
      )}

      {/* Backstage Intercom & Talkback */}
      {showIntercomModal && (
        <BackstageIntercomModal
          streamerName={stream.streamerName}
          onClose={() => setShowIntercomModal(false)}
        />
      )}

      {/* Guild Territory Wars */}
      {showTerritoryWarsModal && (
        <GuildTerritoryWarsModal
          streamerName={stream.streamerName}
          onClose={() => setShowTerritoryWarsModal(false)}
        />
      )}

      {/* Interactive D20 Skill-Check */}
      {showD20Modal && (
        <D20SkillCheckModal
          streamerName={stream.streamerName}
          onClose={() => setShowD20Modal(false)}
        />
      )}

      {/* Character Lore Trading Cards */}
      {showLoreCardsModal && (
        <LoreTradingCardsModal
          streamerName={stream.streamerName}
          onClose={() => setShowLoreCardsModal(false)}
        />
      )}

      {/* Reader Citadel & 3D Bookshelf */}
      {showCitadelModal && (
        <ReaderCitadelBookshelfModal
          streamerName={stream.streamerName}
          onClose={() => setShowCitadelModal(false)}
        />
      )}

      {/* Global Reading Relay */}
      {showRelayModal && (
        <GlobalReadingRelayModal
          streamerName={stream.streamerName}
          onClose={() => setShowRelayModal(false)}
        />
      )}

      {/* Edit Stream Info Modal */}
      {showEditInfoModal && (
        <StreamInfoModal
          initialTitle={stream.title}
          initialGenre={stream.genre}
          initialTags={stream.tags || []}
          onSave={handleSaveStreamInfo}
          onClose={() => setShowEditInfoModal(false)}
        />
      )}

      {/* Picture-in-Picture Mini-Player */}
      {showMiniPlayer && (
        <MiniPlayer
          streamerId={stream.streamerId}
          streamerName={stream.streamerName}
          streamTitle={stream.title}
          avatarUrl={streamerProfile?.avatarUrl || ''}
          viewerCount={stream.viewerCount}
          onClose={() => setShowMiniPlayer(false)}
        />
      )}

      {/* Lo-Fi Ambient Sound Mixer Drawer */}
      {showAmbientMixer && (
        <div className="ambient-mixer-floating-drawer">
          <AmbientSoundMixer onClose={() => setShowAmbientMixer(false)} />
        </div>
      )}

      {/* Reading Sprint Summary & Rewards Modal */}
      {sprintCompletedTarget !== null && (
        <SprintSummaryModal
          targetPages={sprintCompletedTarget}
          onClose={() => setSprintCompletedTarget(null)}
        />
      )}
    </div>
  );
};
