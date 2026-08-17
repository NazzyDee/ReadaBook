import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Radio,
  BarChart2,
  Bookmark,
  Shield,
  Sparkles,
  Calendar,
  Smile,
  Film,
  BarChart3,
  Users,
  Layers,
  Hand,
  Zap,
  Trophy,
  Mic,
  Compass,
  Bot,
  Swords,
  Smartphone,
  Languages,
  ShoppingBag,
  Crown,
  HeartHandshake,
  GitBranch,
  Sliders,
  Flame,
  BellRing,
  FileText,
  Grid,
  Briefcase,
  Tv,
  BookOpen,
  Video,
  Disc,
  Palette,
  CalendarDays,
  ShieldAlert,
  CreditCard,
  Theater,
  Activity,
  Target,
  MessageCircle,
  Keyboard,
  Award,
  Library,
  Scissors,
  ShieldCheck,
  Coffee,
  Gift,
  Megaphone,
  TrendingUp,
  MessageSquare,
  Tag,
  Gem,
  Headphones,
  Volume2,
  Gauge,
  Dices,
  Gavel,
  TreePine,
  Music,
  Lock,
  Type,
  Lightbulb,
  HeartPulse,
  Eye,
  Search,
  Map,
  Castle,
  Globe,
  HelpCircle,
  Heart,
  Scale,
  DollarSign,
  Feather,
  Key,
  Package,
  Store,
  Ticket
} from 'lucide-react';
import { RaidModal } from './RaidModal';
import { ChatPollModal, type PollData } from './ChatPollModal';
import { StreamMarkerModal } from './StreamMarkerModal';
import { AutoModSettingsModal } from './AutoModSettingsModal';
import { RedemptionsQueueModal } from './RedemptionsQueueModal';
import { ScheduleCalendarModal } from './ScheduleCalendarModal';
import { AudiobookExportModal } from './AudiobookExportModal';
import { BookClubStageModal } from './BookClubStageModal';
import { SmartFoleyStudioModal } from './SmartFoleyStudioModal';
import { BookBattleArena } from './BookBattleArena';
import { VoiceMorphStudioModal } from './VoiceMorphStudioModal';
import { CreatorAnalyticsModal } from './CreatorAnalyticsModal';
import { InteractiveMapHUD } from './InteractiveMapHUD';
import { ChroniclerOracleModal } from './ChroniclerOracleModal';
import { NarratorDuelModal } from './NarratorDuelModal';
import { CompanionModeModal } from './CompanionModeModal';
import { UniversalTranslatorModal } from './UniversalTranslatorModal';
import { GrandBazaarModal } from './GrandBazaarModal';
import { SubscriptionModal } from './SubscriptionModal';
import { StoryBranchHUD } from './StoryBranchHUD';
import { CharityMarathonWidget } from './CharityMarathonWidget';
import { VoiceModulationRack } from './VoiceModulationRack';
import { ReaderMomentsModal } from './ReaderMomentsModal';
import { ViewerSoundboardModal } from './ViewerSoundboardModal';
import { VodTranscriptViewer } from './VodTranscriptViewer';
import { SquadMultiviewPlayer } from './SquadMultiviewPlayer';
import { PublisherBountyBoardModal } from './PublisherBountyBoardModal';
import { ChannelTrailerModal } from './ChannelTrailerModal';
import { LoreGlossaryOverlay } from './LoreGlossaryOverlay';
import { WatchPartyRoomModal } from './WatchPartyRoomModal';
import { OBSOverlayStudioModal } from './OBSOverlayStudioModal';
import { AudiobookStemsMarketplaceModal } from './AudiobookStemsMarketplaceModal';
import { EmoteArtistAttributionModal } from './EmoteArtistAttributionModal';
import { MarathonScheduleHubModal } from './MarathonScheduleHubModal';
import { ShieldModeModal } from './ShieldModeModal';
import { CreatorPayoutsModal } from './CreatorPayoutsModal';
import { MerchStorefrontModal } from './MerchStorefrontModal';
import { CharacterCastMatrixModal } from './CharacterCastMatrixModal';
import { RaidStationModal } from './RaidStationModal';
import { ChannelRolesModal } from './ChannelRolesModal';
import { StreamHealthModal } from './StreamHealthModal';
import { CommunityGoalHubModal } from './CommunityGoalHubModal';
import { HypeTrainEngineModal } from './HypeTrainEngineModal';
import { StreamLeaderboardsModal } from './StreamLeaderboardsModal';
import { ChatSettingsStudioModal } from './ChatSettingsStudioModal';
import { DiscordRoleSyncModal } from './DiscordRoleSyncModal';
import { ViewerDropsModal } from './ViewerDropsModal';
import { StreamDeckShortcutsModal } from './StreamDeckShortcutsModal';
import { ClipEditorStudioModal } from './ClipEditorStudioModal';
import { ChannelRulesGateModal } from './ChannelRulesGateModal';
import { BookshelfCustomizerModal } from './BookshelfCustomizerModal';
import { SubMilestonesModal } from './SubMilestonesModal';
import { CommunityGiftBombModal } from './CommunityGiftBombModal';
import { ChannelPointsStudioModal } from './ChannelPointsStudioModal';
import { CommercialBreakModal } from './CommercialBreakModal';
import { DualAudioMixerModal } from './DualAudioMixerModal';
import { PinnedMessageStudioModal } from './PinnedMessageStudioModal';
import { VodChapterMarkersModal } from './VodChapterMarkersModal';
import { CommunityPredictionsModal } from './CommunityPredictionsModal';
import { WhisperMessagesModal } from './WhisperMessagesModal';
import { ModActionAuditLogModal } from './ModActionAuditLogModal';
import { ContentClassificationModal } from './ContentClassificationModal';
import { StreamLatencySettingsModal } from './StreamLatencySettingsModal';
import { ChatEmoteComboWidget } from './ChatEmoteComboWidget';
import { MysteryBookBoxModal } from './MysteryBookBoxModal';
import { ReadingTelemetryModal } from './ReadingTelemetryModal';
import { BookTriviaArenaModal } from './BookTriviaArenaModal';
import { VocalWarmupStudioModal } from './VocalWarmupStudioModal';
import { CoStreamRoleSplitterModal } from './CoStreamRoleSplitterModal';
import { CreatorAchievementsModal } from './CreatorAchievementsModal';
import { VipReaderFlairsModal } from './VipReaderFlairsModal';
import { LiveChapterRecapModal } from './LiveChapterRecapModal';
import { VocalDynamicsRackModal } from './VocalDynamicsRackModal';
import { SquadSpatialAudioModal } from './SquadSpatialAudioModal';
import { ReadingHabitsHubModal } from './ReadingHabitsHubModal';
import { DonationTtsStudioModal } from './DonationTtsStudioModal';
import { SubGiftLeaderboardModal } from './SubGiftLeaderboardModal';
import { HighlightReelGeneratorModal } from './HighlightReelGeneratorModal';
import { ChatVerificationModal } from './ChatVerificationModal';
import { ReadingPacingPacerModal } from './ReadingPacingPacerModal';
import { SoundtrackIntegrationModal } from './SoundtrackIntegrationModal';
import { CliffhangerWagersModal } from './CliffhangerWagersModal';
import { EmoteSlotsManagerModal } from './EmoteSlotsManagerModal';
import { NarratorCheatSheetModal } from './NarratorCheatSheetModal';
import { BackstageWhisperModal } from './BackstageWhisperModal';
import { ViewerJournalBookmarksModal } from './ViewerJournalBookmarksModal';
import { CommunityAuctionModal } from './CommunityAuctionModal';
import { NarratorSkillTreeModal } from './NarratorSkillTreeModal';
import { StreamTagTaxonomyModal } from './StreamTagTaxonomyModal';
import { NarratorFaceOffModal } from './NarratorFaceOffModal';
import { SubscribersWallOfHonorModal } from './SubscribersWallOfHonorModal';
import { VocalWarmupTrainerModal } from './VocalWarmupTrainerModal';
import { ChatPacingThrottleModal } from './ChatPacingThrottleModal';
import { ChapterProgressSyncModal } from './ChapterProgressSyncModal';
import { CommunitySparksPinataModal } from './CommunitySparksPinataModal';
import { WorldLoreAtlasModal } from './WorldLoreAtlasModal';
import { AdBreakCountdownModal } from './AdBreakCountdownModal';
import { ReaderSentimentHeatmapModal } from './ReaderSentimentHeatmapModal';
import { GuildReadingBattlepassModal } from './GuildReadingBattlepassModal';
import { AutoHostChannelTeamsModal } from './AutoHostChannelTeamsModal';
import { StreamDirectorMultiCamModal } from './StreamDirectorMultiCamModal';
import { OverlayThemesStudioModal } from './OverlayThemesStudioModal';
import { ScreenFxEmoteCannonModal } from './ScreenFxEmoteCannonModal';
import { MobileTeleprompterRemoteModal } from './MobileTeleprompterRemoteModal';
import { RoomAcousticOptimizerModal } from './RoomAcousticOptimizerModal';
import { VoiceMorphPresetPadModal } from './VoiceMorphPresetPadModal';
import { BackstageAudioRoutingModal } from './BackstageAudioRoutingModal';
import { WpmTachometerModal } from './WpmTachometerModal';
import { ReadingBossEncounterModal } from './ReadingBossEncounterModal';
import { BookTournamentBracketModal } from './BookTournamentBracketModal';
import { BookGiveawayRandomizerModal } from './BookGiveawayRandomizerModal';
import { ChapterBookmarkStampModal } from './ChapterBookmarkStampModal';
import { CustomChannelFontModal } from './CustomChannelFontModal';
import { PrintOnDemandMerchModal } from './PrintOnDemandMerchModal';
import { PublisherBountyTrackerModal } from './PublisherBountyTrackerModal';
import { SubOnlyLoungeModal } from './SubOnlyLoungeModal';
import { SmartLightingSyncModal } from './SmartLightingSyncModal';
import { AutomatedModShieldRulesModal } from './AutomatedModShieldRulesModal';
import { SilentStudyRadioModal } from './SilentStudyRadioModal';
import { InteractiveVodArchivesModal } from './InteractiveVodArchivesModal';
import { MultiCastAudioDramaModal } from './MultiCastAudioDramaModal';
import { ObsVirtualKeyerModal } from './ObsVirtualKeyerModal';
import { VerticalClipTranscoderModal } from './VerticalClipTranscoderModal';
import { StreamDeckWebSocketModal } from './StreamDeckWebSocketModal';
import { SpatialBinauralPannerModal } from './SpatialBinauralPannerModal';
import { EyeContactCorrectorModal } from './EyeContactCorrectorModal';
import { RsvpSpeedReaderModal } from './RsvpSpeedReaderModal';
import { ManuscriptZoomLoupeModal } from './ManuscriptZoomLoupeModal';
import { VocalHealthTelemetryModal } from './VocalHealthTelemetryModal';
import { BackstageIntercomModal } from './BackstageIntercomModal';
import { GuildTerritoryWarsModal } from './GuildTerritoryWarsModal';
import { D20SkillCheckModal } from './D20SkillCheckModal';
import { LoreTradingCardsModal } from './LoreTradingCardsModal';
import { ReaderCitadelBookshelfModal } from './ReaderCitadelBookshelfModal';
import { GlobalReadingRelayModal } from './GlobalReadingRelayModal';
import { ChapterCrosswordWordleModal } from './ChapterCrosswordWordleModal';
import { BookwormFamiliarModal } from './BookwormFamiliarModal';
import { TriviaArcheryRangeModal } from './TriviaArcheryRangeModal';
import { LoreCanonTribunalModal } from './LoreCanonTribunalModal';
import { GoldLeafVolcanoModal } from './GoldLeafVolcanoModal';
import { LiveCrowdfundingOverlayModal } from './LiveCrowdfundingOverlayModal';
import { DigitalBookSigningModal } from './DigitalBookSigningModal';
import { ChapterEarlyAccessModal } from './ChapterEarlyAccessModal';
import { BlindDateUnboxingModal } from './BlindDateUnboxingModal';
import { CreatorStripePayoutsModal } from './CreatorStripePayoutsModal';
import { IndieBookshopAffiliateModal } from './IndieBookshopAffiliateModal';
import { BookClubBrandDealsModal } from './BookClubBrandDealsModal';
import { VipTicketedEventsModal } from './VipTicketedEventsModal';
import { CustomHardcoverStudioModal } from './CustomHardcoverStudioModal';
import { AuthorRoyaltyLendingModal } from './AuthorRoyaltyLendingModal';
import { soundFX } from '../lib/soundFx';

interface StreamerQuickActionsProps {
  streamerName: string;
  onStartPoll?: (poll: PollData) => void;
  onAddMarker?: (desc: string, time: string) => void;
  onOpenGuestStar?: () => void;
}

export const StreamerQuickActions: React.FC<StreamerQuickActionsProps> = ({
  streamerName,
  onStartPoll,
  onAddMarker,
  onOpenGuestStar
}) => {
  const [showRaid, setShowRaid] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [showMarker, setShowMarker] = useState(false);
  const [showAutoMod, setShowAutoMod] = useState(false);
  const [showRedemptions, setShowRedemptions] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showAudiobookModal, setShowAudiobookModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [showFoleyModal, setShowFoleyModal] = useState(false);
  const [showBattleArena, setShowBattleArena] = useState(false);
  const [showVoiceMorphModal, setShowVoiceMorphModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showMapHUD, setShowMapHUD] = useState(false);
  const [showChroniclerModal, setShowChroniclerModal] = useState(false);
  const [showDuelModal, setShowDuelModal] = useState(false);
  const [showCompanionModal, setShowCompanionModal] = useState(false);
  const [showTranslatorModal, setShowTranslatorModal] = useState(false);
  const [showBazaarModal, setShowBazaarModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showBranchHUD, setShowBranchHUD] = useState(false);
  const [showCharityModal, setShowCharityModal] = useState(false);
  const [showVoiceRackModal, setShowVoiceRackModal] = useState(false);
  const [showMomentsModal, setShowMomentsModal] = useState(false);
  const [showSoundboardModal, setShowSoundboardModal] = useState(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [showSquadMulti, setShowSquadMulti] = useState(false);
  const [showBountyModal, setShowBountyModal] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [showLoreWikiModal, setShowLoreWikiModal] = useState(false);
  const [showWatchPartyModal, setShowWatchPartyModal] = useState(false);
  const [showOBSOverlayModal, setShowOBSOverlayModal] = useState(false);
  const [showStemsModal, setShowStemsModal] = useState(false);
  const [showEmoteArtistModal, setShowEmoteArtistModal] = useState(false);
  const [showMarathonModal, setShowMarathonModal] = useState(false);
  const [showShieldModal, setShowShieldModal] = useState(false);
  const [showPayoutsModal, setShowPayoutsModal] = useState(false);
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
  const [showCrosswordModal, setShowCrosswordModal] = useState(false);
  const [showFamiliarModal, setShowFamiliarModal] = useState(false);
  const [showArcheryModal, setShowArcheryModal] = useState(false);
  const [showTribunalModal, setShowTribunalModal] = useState(false);
  const [showVolcanoModal, setShowVolcanoModal] = useState(false);
  const [showCrowdfundingModal, setShowCrowdfundingModal] = useState(false);
  const [showBookSigningModal, setShowBookSigningModal] = useState(false);
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);
  const [showBlindDateModal, setShowBlindDateModal] = useState(false);
  const [showStripeDirectPayoutsModal, setShowStripeDirectPayoutsModal] = useState(false);
  const [showIndieBookshopModal, setShowIndieBookshopModal] = useState(false);
  const [showBrandDealsModal, setShowBrandDealsModal] = useState(false);
  const [showVipTicketsModal, setShowVipTicketsModal] = useState(false);
  const [showHardcoverStudioModal, setShowHardcoverStudioModal] = useState(false);
  const [showAuthorRoyaltyModal, setShowAuthorRoyaltyModal] = useState(false);
  const [isFoleyEnabled, setIsFoleyEnabled] = useState(true);

  return (
    <div className="streamer-quick-actions-card">
      <div className="quick-actions-header">
        <div className="quick-title-group">
          <span className="rec-dot-animated"></span>
          <h4>Streamer Quick Actions</h4>
        </div>
        <span className="live-pill-sm">BROADCASTER HUB</span>
      </div>

      <div className="quick-actions-buttons-grid">
        {/* Indie Bookshop Affiliate Split */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowIndieBookshopModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Affiliate Bookshop.org & Indie Bookstore Split"
        >
          <Store size={18} />
          <span>Indie Shops</span>
        </button>

        {/* Brand Deals Sponsorships */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowBrandDealsModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Sponsored Book Club Brand Deals Marketplace"
        >
          <Briefcase size={18} />
          <span>Brand Deals</span>
        </button>

        {/* VIP Ticketed Events */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowVipTicketsModal(true);
          }}
          className="btn-quick-action action-purple"
          title="VIP Live Q&A Stage Tickets & Backstage Passes"
        >
          <Ticket size={18} />
          <span>VIP Passes</span>
        </button>

        {/* Custom Hardcover Bindery Studio */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowHardcoverStudioModal(true);
          }}
          className="btn-quick-action action-secondary"
          title="Custom Hardcover Slipcase & Foil Printing Studio"
        >
          <BookOpen size={18} />
          <span>Bindery Studio</span>
        </button>

        {/* Author Royalty & PLR Ledger */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowAuthorRoyaltyModal(true);
          }}
          className="btn-quick-action action-primary"
          title="Author Royalty & Public Lending Rights Dashboard"
        >
          <BarChart3 size={18} />
          <span>Royalty PLR</span>
        </button>
        {/* Live Crowdfunding Overlay */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowCrowdfundingModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Kickstarter / BackerKit Live Crowdfunding Overlay"
        >
          <DollarSign size={18} />
          <span>Crowdfund</span>
        </button>

        {/* Digital Book Signing */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowBookSigningModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Live Digital Book Signing & Personalized NFT/Wax Seals"
        >
          <Feather size={18} />
          <span>Signing Desk</span>
        </button>

        {/* Early Access Chapter Drops */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowEarlyAccessModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Pay-What-You-Want Chapter Drops & Early Access Keys"
        >
          <Key size={18} />
          <span>Early Drops</span>
        </button>

        {/* Blind Date Book Unboxing */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowBlindDateModal(true);
          }}
          className="btn-quick-action action-secondary"
          title="Mystery Blind Date with a Book Unboxing Queue"
        >
          <Package size={18} />
          <span>Blind Date</span>
        </button>

        {/* Creator Stripe Direct Payouts */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowStripeDirectPayoutsModal(true);
          }}
          className="btn-quick-action action-danger"
          title="Sparks Multi-Currency Direct Stripe Payout Dashboard"
        >
          <DollarSign size={18} />
          <span>Stripe Payouts</span>
        </button>
        {/* Live Chapter Crossword & Wordle */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowCrosswordModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Live Chapter Crossword & Lore Wordle Overlay"
        >
          <HelpCircle size={18} />
          <span>Crossword</span>
        </button>

        {/* Evolving Bookworm Familiar */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowFamiliarModal(true);
          }}
          className="btn-quick-action action-pink"
          title="Reader Loyalty Streaks & Evolving Bookworm Familiar"
        >
          <Heart size={18} />
          <span>Familiar</span>
        </button>

        {/* Trivia Archery Range */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowArcheryModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Community Archery & Trivia Target Range"
        >
          <Target size={18} />
          <span>Archery</span>
        </button>

        {/* Canon Dispute Tribunal */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowTribunalModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Lore Fact-Checker & Canon Dispute Tribunal"
        >
          <Scale size={18} />
          <span>Tribunal</span>
        </button>

        {/* Gold Leaf Volcano */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowVolcanoModal(true);
          }}
          className="btn-quick-action action-danger"
          title="Hype Train Level 100: Gold Leaf Volcano Eruption"
        >
          <Flame size={18} />
          <span>Volcano</span>
        </button>
        {/* Guild Territory Wars */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowTerritoryWarsModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Guild Territory Wars: World Map Conquest"
        >
          <Map size={18} />
          <span>Realm Wars</span>
        </button>

        {/* Interactive D20 Skill-Check */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowD20Modal(true);
          }}
          className="btn-quick-action action-gold"
          title="Interactive D20 Skill-Check Narrative Branching"
        >
          <Dices size={18} />
          <span>D20 Check</span>
        </button>

        {/* Character Lore Trading Cards */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowLoreCardsModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Character Inventory & Lore Deck Trading Cards"
        >
          <Layers size={18} />
          <span>Lore Cards</span>
        </button>

        {/* Reader Citadel & 3D Bookshelf */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowCitadelModal(true);
          }}
          className="btn-quick-action action-secondary"
          title="Reader Citadel & 3D Digital Bookshelf Trophy Room"
        >
          <Castle size={18} />
          <span>3D Citadel</span>
        </button>

        {/* Global Reading Relay */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowRelayModal(true);
          }}
          className="btn-quick-action action-danger"
          title="Global Speed Reading Relay & 24hr Read-a-thon"
        >
          <Globe size={18} />
          <span>World Relay</span>
        </button>
        {/* Eye-Contact AI Corrector */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowEyeContactModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Teleprompter Eye-Contact AI Corrector"
        >
          <Eye size={18} />
          <span>Eye Contact</span>
        </button>

        {/* Speed-Reading RSVP Flasher */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowRsvpModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Speed-Reading RSVP Flasher Overlay"
        >
          <Gauge size={18} />
          <span>RSVP Reader</span>
        </button>

        {/* Macro-Lens Manuscript Zoom Loupe */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowManuscriptZoomModal(true);
          }}
          className="btn-quick-action action-secondary"
          title="Macro-Lens Manuscript Zoom Loupe"
        >
          <Search size={18} />
          <span>Desk Loupe</span>
        </button>

        {/* Vocal Health Telemetry */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowVocalHealthModal(true);
          }}
          className="btn-quick-action action-danger"
          title="Voice Fatigue & Vocal Cord Health Telemetry"
        >
          <HeartPulse size={18} />
          <span>Vocal Health</span>
        </button>

        {/* Backstage Intercom & Talkback */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowIntercomModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Backstage Intercom & Producer Talkback Channel"
        >
          <Radio size={18} />
          <span>Intercom</span>
        </button>
        {/* Multi-Cast Audio Drama */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowMultiCastDramaModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Live Tabletop Audio-Drama & Multi-Cast Voice Staging"
        >
          <Theater size={18} />
          <span>Multi-Cast</span>
        </button>

        {/* OBS Virtual Camera 3D Keyer */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowObsKeyerModal(true);
          }}
          className="btn-quick-action action-teal"
          title="OBS Studio Virtual Camera & 3D Medieval Set Keyer"
        >
          <Video size={18} />
          <span>3D Virtual Set</span>
        </button>

        {/* 9:16 Vertical Clip Transcoder */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowVerticalClipModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Instant 9:16 TikTok / Reels / Shorts Vertical Transcoder"
        >
          <Smartphone size={18} />
          <span>9:16 BookTok</span>
        </button>

        {/* Stream Deck WebSocket Companion */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowStreamDeckWsModal(true);
          }}
          className="btn-quick-action action-secondary"
          title="Dual-PC Stream Deck WebSocket Companion"
        >
          <Sliders size={18} />
          <span>Stream Deck</span>
        </button>

        {/* 3D Spatial Binaural Panner */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowSpatialPannerModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Surround 5.1 & Spatial Headphone Binaural Panner"
        >
          <Headphones size={18} />
          <span>3D Audio</span>
        </button>
        {/* Smart Ambient Lighting Sync */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowLightingModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Smart Ambient Lighting Sync & Hue Bridge"
        >
          <Lightbulb size={18} />
          <span>Hue Lights</span>
        </button>

        {/* Arcane Moderation Shield */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowModShieldModal(true);
          }}
          className="btn-quick-action action-danger"
          title="Arcane Moderation Shield & Anti-Spoiler Rules"
        >
          <ShieldAlert size={18} />
          <span>AI Mod Shield</span>
        </button>

        {/* 24/7 Silent Study Radio */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowRadioModal(true);
          }}
          className="btn-quick-action action-purple"
          title="24/7 Silent Study Radio & Pomodoro Room"
        >
          <Radio size={18} />
          <span>Study Radio</span>
        </button>

        {/* Interactive VOD Archives */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowVodArchivesModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Interactive VOD Archives & Chapter Scribe"
        >
          <Film size={18} />
          <span>VOD Archives</span>
        </button>
        {/* Sub Tier 3 Scribe Grimoire Fonts */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowCustomFontModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Tier 3 Scribe Grimoire & Custom Fonts"
        >
          <Type size={18} />
          <span>Grimoire</span>
        </button>

        {/* Print-on-Demand Merch Hub */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowMerchShopModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Print-on-Demand Merch Store & Shop"
        >
          <ShoppingBag size={18} />
          <span>Merch Hub</span>
        </button>

        {/* Publisher Bounty Tracker */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowBountyTrackerModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Publisher Bounty Board & Sponsorships"
        >
          <Award size={18} />
          <span>Bounties</span>
        </button>

        {/* Sub-Only Book Club Lounge */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowSubLoungeModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Subscriber-Only VIP Book Club Salon"
        >
          <MessageSquare size={18} />
          <span>Sub Salon</span>
        </button>
        {/* Community Reading Boss Raid */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowBossRaidModal(true);
          }}
          className="btn-quick-action action-danger"
          title="Community Reading Boss Raid & Encounter"
        >
          <Swords size={18} />
          <span>Boss Raid</span>
        </button>

        {/* Grand Tournament Bracket */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowTournamentModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Grand Tournament Bracket & Book of the Year"
        >
          <Trophy size={18} />
          <span>Tournament</span>
        </button>

        {/* Book Box Giveaways */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowGiveawayModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Community Book Box Giveaway & Roll Picker"
        >
          <Gift size={18} />
          <span>Giveaway</span>
        </button>

        {/* Chapter Bookmark Stamps */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowBookmarkStampModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Chapter Bookmark Stamp & Marginalia Wall"
        >
          <Bookmark size={18} />
          <span>Marginalia</span>
        </button>
        {/* Studio Acoustic Room Optimizer */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowAcousticModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Studio Noise Gate & Room Acoustic Optimizer"
        >
          <Mic size={18} />
          <span>Acoustics</span>
        </button>

        {/* Character Voice Morph Preset Pad */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowVoicePadModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Voice Morph Preset Soundboard Pad"
        >
          <Volume2 size={18} />
          <span>Voice Pad</span>
        </button>

        {/* Dual Monitor Audio Routing */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowAudioRoutingModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Dual Monitor & Split Audio Routing Matrix"
        >
          <Headphones size={18} />
          <span>Routing</span>
        </button>

        {/* Reading Speed Tachometer */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowWpmModal(true);
          }}
          className="btn-quick-action action-danger"
          title="Reading Speed & Cadence Tachometer"
        >
          <Gauge size={18} />
          <span>WPM Meter</span>
        </button>
        {/* Multi-Cam Stage Director */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowMultiCamModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Studio Scene Director & Multi-Cam Controller"
        >
          <Video size={18} />
          <span>Multi-Cam</span>
        </button>

        {/* Custom Overlay Themes */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowOverlayThemesModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Stream Overlay & Parchment Theme Studio"
        >
          <Palette size={18} />
          <span>Themes</span>
        </button>

        {/* Screen FX Emote Cannons */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowScreenFxModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Custom Hype Emote Walls & Sparks Cannons"
        >
          <Sparkles size={18} />
          <span>Screen FX</span>
        </button>

        {/* Mobile Teleprompter Remote */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowTeleprompterModal(true);
          }}
          className="btn-quick-action action-secondary"
          title="Mobile Companion Teleprompter & Remote"
        >
          <Smartphone size={18} />
          <span>Prompter</span>
        </button>
        {/* Cozy Intermission Ad Break */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowAdBreakModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Cozy Intermission & Ad-Revenue Deck"
        >
          <Coffee size={18} />
          <span>Intermission</span>
        </button>

        {/* Live Reader Sentiment Heatmap */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowSentimentHeatmapModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Live Chapter Sentiment & Emotion Heatmap"
        >
          <Activity size={18} />
          <span>Sentiment</span>
        </button>

        {/* Seasonal Guild Battlepass */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowGuildBattlepassModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Archivist Guild Seasonal Battlepass"
        >
          <Trophy size={18} />
          <span>Battlepass</span>
        </button>

        {/* Narrator Auto-Host Teams */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowAutoHostTeamsModal(true);
          }}
          className="btn-quick-action action-danger"
          title="Narrator Guilds & Auto-Host Raid Matrix"
        >
          <Users size={18} />
          <span>Auto-Host</span>
        </button>
        {/* Chat Throttle & Sub-Only Cockpit */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowChatThrottleModal(true);
          }}
          className="btn-quick-action action-danger"
          title="Chat Flow Pacer & Sub-Only Moderation Cockpit"
        >
          <Lock size={18} />
          <span>Chat Gate</span>
        </button>

        {/* Live Book Progress Tracker */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowBookProgressModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Live Book Progress Tracker & E-Reader Sync"
        >
          <BookOpen size={18} />
          <span>Progress Sync</span>
        </button>

        {/* Community Sparks Pinata */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowSparksPinataModal(true);
          }}
          className="btn-quick-action action-gold"
          title="The Lore Dragon Sparks Piñata & Gold Leaf Shower"
        >
          <Flame size={18} />
          <span>Sparks Piñata</span>
        </button>

        {/* World Lore Atlas */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowWorldAtlasModal(true);
          }}
          className="btn-quick-action action-purple"
          title="World Lore Atlas & Interactive Realm Map"
        >
          <Compass size={18} />
          <span>Realm Atlas</span>
        </button>
        {/* Stream Tag Taxonomy */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowStreamTagTaxonomyModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Literary Mood & Stream Tag Taxonomy"
        >
          <Tag size={18} />
          <span>Tags</span>
        </button>

        {/* 1v1 Monologue Duel */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowNarratorFaceOffModal(true);
          }}
          className="btn-quick-action action-danger"
          title="1v1 Dramatic Monologue Face-Off Arena"
        >
          <Swords size={18} />
          <span>Face-Off</span>
        </button>

        {/* Founding Readers Wall of Honor */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowSubscribersWallModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Founding Readers & Grand Scribe Wall of Honor"
        >
          <Crown size={18} />
          <span>Wall of Honor</span>
        </button>

        {/* Pre-Stream Vocal Warmup Trainer */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowVocalWarmupTrainerModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Pre-Stream Vocal Warmup Piano & Breathwork"
        >
          <Music size={18} />
          <span>Vocal Warmup</span>
        </button>
        {/* Stage Whisper Backstage Lounge */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowBackstageWhisperModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Stage Whisper & Backstage Co-Host Lounge"
        >
          <Radio size={18} />
          <span>Stage Whisper</span>
        </button>

        {/* Viewer Live Quotation Journal */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowJournalModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Personal Reading Journal & Margin Notes"
        >
          <Bookmark size={18} />
          <span>Journal</span>
        </button>

        {/* Live Rare Book Auction */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowAuctionModal(true);
          }}
          className="btn-quick-action action-danger"
          title="Rare Grimoire & Signed Book Auction Gauntlet"
        >
          <Gavel size={18} />
          <span>Auction</span>
        </button>

        {/* RPG Skill Tree */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowSkillTreeModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Master Chronicler RPG Skill Tree & Stream Perks"
        >
          <TreePine size={18} />
          <span>Skill Tree</span>
        </button>
        {/* Atmosphere Soundtrack & Spotify Deck */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowSoundtrackModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Narrator Atmosphere Soundtrack & Spotify Deck"
        >
          <Radio size={18} />
          <span>Soundtrack</span>
        </button>

        {/* Chapter Cliffhanger Predictions */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowCliffhangerWagerModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Chapter Cliffhanger Prediction Wagers"
        >
          <Dices size={18} />
          <span>Wagers</span>
        </button>

        {/* Custom Emote Slots Matrix */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowEmoteSlotsModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Custom Emote Slots & Sub Rewards Matrix"
        >
          <Smile size={18} />
          <span>Emote Slots</span>
        </button>

        {/* Pronunciation Cheat Sheet */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowCheatSheetModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Live Pronunciation Lexicon & Voice Cheat Sheet"
        >
          <BookOpen size={18} />
          <span>Cheat Sheet</span>
        </button>
        {/* Sub Gifting Leaderboard */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowSubGiftModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Grand Patron Sub Gifting Leaderboard"
        >
          <Crown size={18} />
          <span>Top Gifters</span>
        </button>

        {/* Highlight Reel Generator */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowHighlightReelModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Narrator Highlight Reel & Shorts Generator"
        >
          <Film size={18} />
          <span>Shorts Maker</span>
        </button>

        {/* Chat Verification Gate */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowChatVerifyModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Arcane Scribe Gate & Chat Verification Citadel"
        >
          <ShieldCheck size={18} />
          <span>Verify Gate</span>
        </button>

        {/* Reading Pacing Metronome */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowPacingMetronomeModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Live Reading Speedometer & Syllable Metronome"
        >
          <Gauge size={18} />
          <span>Cadence HUD</span>
        </button>
        {/* Vocal Dynamics Master Rack */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowVocalDynamicsModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Vocal Dynamics, Noise Gate & De-Esser Studio"
        >
          <Sliders size={18} />
          <span>Vocal Rack</span>
        </button>

        {/* Squad 3D Audio Spatializer */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowSpatialAudioModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Squad Multi-Narrator 3D Audio Spatializer & Soundstage"
        >
          <Headphones size={18} />
          <span>3D Audio</span>
        </button>

        {/* Community Reading Habits Hub */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowHabitsHubModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Community Reading Habits & Daily Streak Hub"
        >
          <Flame size={18} />
          <span>Habits Hub</span>
        </button>

        {/* Literary Dono TTS Studio */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowDonationTtsModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Literary TTS Custom Voices & Sparks Dono Reader"
        >
          <Volume2 size={18} />
          <span>Dono TTS</span>
        </button>
        {/* Co-Stream Voice Theatre */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowCoStreamRolesModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Co-Stream Voice Theatre & Full Cast Role Splitter"
        >
          <Users size={18} />
          <span>Cast Roles</span>
        </button>

        {/* Broadcaster Achievements */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowAchievementsModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Broadcaster Quests & Path to Master Storyteller"
        >
          <Trophy size={18} />
          <span>Quests</span>
        </button>

        {/* VIP Reader Badges */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowVipFlairsModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Archivist VIP Reader Badges & Custom Chat Flairs"
        >
          <Gem size={18} />
          <span>VIP Flairs</span>
        </button>

        {/* Live Chapter Recap */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowChapterRecapModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Live Chapter Summary & Previously On... Catch-Up HUD"
        >
          <FileText size={18} />
          <span>Story Recap</span>
        </button>
        {/* Mystery Book Box Prize Wheel */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowMysteryBoxModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Mystery Book Box & Community Prize Wheel Giveaway"
        >
          <Gift size={18} />
          <span>Prize Wheel</span>
        </button>

        {/* Live Reading Telemetry */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowTelemetryModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Live Reading Velocity & Vocabulary Telemetry HUD"
        >
          <Activity size={18} />
          <span>Telemetry</span>
        </button>

        {/* Lore Master Trivia Gauntlet */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowTriviaArenaModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Lore Master Chapter Trivia Gauntlet & Quiz Duel"
        >
          <Swords size={18} />
          <span>Trivia Duel</span>
        </button>

        {/* Narrator Vocal Warmup Studio */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowVocalWarmupModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Narrator Vocal Warmup & Breath Control Studio"
        >
          <Mic size={18} />
          <span>Vocal Suite</span>
        </button>
        {/* Mod Action Audit Trail */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowModAuditModal(true);
          }}
          className="btn-quick-action action-gold"
          title="High Council Moderation Action Log & Safety Audit Trail"
        >
          <ShieldAlert size={18} />
          <span>Mod Log</span>
        </button>

        {/* Content Classification & Warnings */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowContentWarnModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Literary Content & Trigger Warnings Studio"
        >
          <Tag size={18} />
          <span>Warnings</span>
        </button>

        {/* Stream Latency & Audio-Only Transcoder */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowLatencyModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Stream Latency & Audio-Only Commuter Mode Switcher"
        >
          <Radio size={18} />
          <span>Latency</span>
        </button>

        {/* Live Chat Emote Combos */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowEmoteComboWidget(true);
          }}
          className="btn-quick-action action-gold"
          title="Live Chat Emote Combos & Reading Hype Multiplier"
        >
          <Flame size={18} />
          <span>Combos</span>
        </button>

        {/* Pinned Announcements */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowPinnedModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Pinned Chat Announcements & Megaphone Banner Studio"
        >
          <Megaphone size={18} />
          <span>Pin Banner</span>
        </button>

        {/* Timestamped VOD Chapter Index */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowVodMarkersModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Timestamped Chapter VOD Markers & Story Index"
        >
          <BookOpen size={18} />
          <span>Chapters</span>
        </button>

        {/* Community Predictions Pool */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowPredictionsModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Literary Plot Predictions & Sparks Staking Pool"
        >
          <TrendingUp size={18} />
          <span>Prediction</span>
        </button>

        {/* Quiet Library Whispers */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowWhispersModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Quiet Library Whispers & Co-Reader Direct Messages"
        >
          <MessageSquare size={18} />
          <span>Whispers</span>
        </button>

        {/* Community Gift Bomb */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowGiftBombModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Community Gift Subscriptions & Bomb Shower"
        >
          <Gift size={18} />
          <span>Gift Bomb</span>
        </button>

        {/* Channel Points Custom Rewards Studio */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowPointsStudioModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Sparks & Channel Points Custom Rewards Studio"
        >
          <Sparkles size={18} />
          <span>Points Studio</span>
        </button>

        {/* Chapter Intermission Tea Break */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowCommercialModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Chapter Intermission & Cozy Tea Break Manager"
        >
          <Coffee size={18} />
          <span>Intermission</span>
        </button>

        {/* Dual-Narrator Audio Mixer */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowDualAudioModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Dual-Narrator Gain & Foley Ducking Mixer"
        >
          <Sliders size={18} />
          <span>Audio Mixer</span>
        </button>

        {/* VOD Highlights & Shorts Trimmer */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowClipEditorModal(true);
          }}
          className="btn-quick-action action-gold"
          title="VOD Chapter Highlights & TikTok/Shorts Trimmer"
        >
          <Scissors size={18} />
          <span>Clip Studio</span>
        </button>

        {/* Channel Rules & Spoiler Pact */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowChannelRulesModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Channel Rules & Spoiler Agreement Gate"
        >
          <ShieldCheck size={18} />
          <span>Channel Rules</span>
        </button>

        {/* 3D Stream Bookshelf Studio */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowBookshelfModal(true);
          }}
          className="btn-quick-action action-purple"
          title="3D Stream Bookshelf & Trophy Showcase Studio"
        >
          <Library size={18} />
          <span>Bookshelf</span>
        </button>

        {/* Subscriber Tenure & Streaks */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowSubMilestonesModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Subscriber Loyalty Tenure & Reading Streaks"
        >
          <Crown size={18} />
          <span>Sub Streaks</span>
        </button>

        {/* Lore Hype Train 2.0 */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowHypeTrainModal(true);
          }}
          className="btn-quick-action action-gold"
          title="The Lore Hype Train & Guild Surge Engine"
        >
          <Zap size={18} />
          <span>Hype Train</span>
        </button>

        {/* Channel Leaderboards */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowLeaderboardsModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Channel Patron & Reading Leaderboard Podium"
        >
          <Award size={18} />
          <span>Leaderboard</span>
        </button>

        {/* Literary Chat Studio */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowChatStudioModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Chat Appearance Customizer & Name Glow Studio"
        >
          <Palette size={18} />
          <span>Chat Studio</span>
        </button>

        {/* Discord Book Club Role Sync */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowDiscordSyncModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Discord Server & Subscriber Role Sync"
        >
          <MessageCircle size={18} />
          <span>Discord Sync</span>
        </button>

        {/* Viewer Watch Drops & Loot */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowDropsModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Live Broadcast Drops & Loot Vault"
        >
          <Trophy size={18} />
          <span>Loot Drops</span>
        </button>

        {/* Stream Deck Shortcuts */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowStreamDeckModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Elgato Stream Deck & Broadcaster Hotkeys Matrix"
        >
          <Keyboard size={18} />
          <span>Stream Deck</span>
        </button>

        {/* End-of-Stream Raid Station */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowRaidStationModal(true);
          }}
          className="btn-quick-action action-red"
          title="Outgoing Book Raid Station & Host Matchmaker"
        >
          <Flame size={18} />
          <span>Raid Station</span>
        </button>

        {/* Channel Roles & Badges */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowRolesModal(true);
          }}
          className="btn-quick-action action-purple"
          title="VIP, Moderator & Author Badge Management"
        >
          <Shield size={18} />
          <span>Roles & Badges</span>
        </button>

        {/* Stream Health & Audio Ingest Inspector */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowStreamHealthModal(true);
          }}
          className="btn-quick-action action-teal"
          title="Live Stream Health, Ingest Latency & LUFS Audio Meter"
        >
          <Activity size={18} />
          <span>Stream Health</span>
        </button>

        {/* Community Reading Goals */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowGoalHubModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Community Reading Goals & Stretch Unlock Rewards"
        >
          <Target size={18} />
          <span>Goals Hub</span>
        </button>

        {/* Streamer Shield Mode */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowShieldModal(true);
          }}
          className="btn-quick-action action-red"
          title="Emergency Shield Mode & Anti-Raid/Spoiler Defense"
        >
          <ShieldAlert size={18} />
          <span>Shield Mode</span>
        </button>

        {/* Creator Revenue & Payouts */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowPayoutsModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Creator Revenue & Stripe Payouts Hub"
        >
          <CreditCard size={18} />
          <span>Payouts</span>
        </button>

        {/* Streamer Merch Storefront */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowMerchModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Streamer Official Merchandise & Book Box Store"
        >
          <ShoppingBag size={18} />
          <span>Merch Store</span>
        </button>

        {/* Multi-Voice Character Cast Matrix */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowCastMatrixModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Live Multi-Voice Character Cast Roster"
        >
          <Theater size={18} />
          <span>Cast Matrix</span>
        </button>

        {/* OBS Stream Overlay Studio */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowOBSOverlayModal(true);
          }}
          className="btn-quick-action action-purple"
          title="OBS & Streamlabs Browser Source Studio"
        >
          <Video size={18} />
          <span>OBS Overlay</span>
        </button>

        {/* Audiobook Stems Marketplace */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowStemsModal(true);
          }}
          className="btn-quick-action action-cyan"
          title="Audiobook Multi-Stem Audio Marketplace"
        >
          <Disc size={18} />
          <span>Audio Stems</span>
        </button>

        {/* Emote & Badge Artists */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowEmoteArtistModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Book Club Emote & Badge Artist Directory"
        >
          <Palette size={18} />
          <span>Emote Artists</span>
        </button>

        {/* 24-Hour Marathon Hub */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowMarathonModal(true);
          }}
          className="btn-quick-action action-gold"
          title="24-Hour Read-A-Thon Marathon Hub"
        >
          <CalendarDays size={18} />
          <span>Marathon Hub</span>
        </button>

        {/* Publisher Bounty Board */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowBountyModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Publisher Bounty Board & Sponsored Reading Quests"
        >
          <Briefcase size={18} />
          <span>Bounties</span>
        </button>

        {/* Channel Trailer Studio */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowTrailerModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Channel Trailer Studio & Offline Screen"
        >
          <Tv size={18} />
          <span>Channel Trailer</span>
        </button>

        {/* Lore Codex Wiki */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowLoreWikiModal(true);
          }}
          className="btn-quick-action action-cyan"
          title="Spoiler-Shielded Lore & Character Codex"
        >
          <BookOpen size={18} />
          <span>Lore Codex</span>
        </button>

        {/* Community Watch Party */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowWatchPartyModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Community Watch Party & Co-Listening Lounge"
        >
          <Users size={18} />
          <span>Watch Party</span>
        </button>

        {/* Broadcast Moments */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowMomentsModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Trigger 60s Live Moment & Climax Badge Claim"
        >
          <Flame size={18} />
          <span>Moments</span>
        </button>

        {/* Channel Points Sound Alerts */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowSoundboardModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Channel Points Sound Alerts Board"
        >
          <BellRing size={18} />
          <span>Sound Alerts</span>
        </button>

        {/* VOD Transcript Timeline */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowTranscriptModal(true);
          }}
          className="btn-quick-action action-cyan"
          title="VOD Chapters & Interactive Transcript Timeline"
        >
          <FileText size={18} />
          <span>Transcripts</span>
        </button>

        {/* 4-Way Squad Co-Stream Multiview */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowSquadMulti(true);
          }}
          className="btn-quick-action action-gold"
          title="Launch 4-Way Squad Co-Stream Studio Grid"
        >
          <Grid size={18} />
          <span>Squad Multiview</span>
        </button>

        {/* Creator Subscriptions */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowSubModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Creator Subscriptions & Community Gift Subs"
        >
          <Crown size={18} />
          <span>Subscriptions</span>
        </button>

        {/* CYOA Story Branch Decision */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowBranchHUD(true);
          }}
          className="btn-quick-action action-purple"
          title="Choose Your Own Adventure Live Audience Decision"
        >
          <GitBranch size={18} />
          <span>CYOA Branch</span>
        </button>

        {/* Charity Marathon */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowCharityModal(true);
          }}
          className="btn-quick-action action-cyan"
          title="Live Book Charity Marathon & Milestones"
        >
          <HeartHandshake size={18} />
          <span>Charity Drive</span>
        </button>

        {/* Studio Voice Modulation DSP */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowVoiceRackModal(true);
          }}
          className="btn-quick-action action-purple"
          title="Voice Acting Audio DSP Modulation Rack"
        >
          <Sliders size={18} />
          <span>Voice FX Rack</span>
        </button>

        {/* Universal Translator */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowTranslatorModal(true);
          }}
          className="btn-quick-action action-cyan"
          title="Universal Multi-Language Live Translator"
        >
          <Languages size={18} />
          <span>Subtitles</span>
        </button>

        {/* Grand Bazaar Merch */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowBazaarModal(true);
          }}
          className="btn-quick-action action-gold"
          title="The Grand Bazaar Merch & Book Swag Shop"
        >
          <ShoppingBag size={18} />
          <span>Merch Shop</span>
        </button>

        {/* Narrator Duel Face-Off */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowDuelModal(true);
          }}
          className="btn-quick-action action-red"
          title="Live Voice Acting Face-Off Showdown"
        >
          <Swords size={18} />
          <span>Narrator Duel</span>
        </button>

        {/* Second-Screen Companion Mode */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowCompanionModal(true);
          }}
          className="btn-quick-action action-cyan"
          title="Second-Screen Mobile Reader & Gamepad"
        >
          <Smartphone size={18} />
          <span>Companion HUD</span>
        </button>

        {/* Interactive World Map */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowMapHUD(true);
          }}
          className="btn-quick-action action-cyan"
          title="Interactive World Map & Journey Tracker"
        >
          <Compass size={18} />
          <span>World Map</span>
        </button>

        {/* Chronicler AI Co-Host */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowChroniclerModal(true);
          }}
          className="btn-quick-action action-gold"
          title="The Chronicler AI (Live Literary Co-Host)"
        >
          <Bot size={18} />
          <span>Chronicler AI</span>
        </button>

        {/* Creator & Publisher Insights */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowAnalyticsModal(true);
          }}
          className="btn-quick-action action-cyan"
          title="Creator & Publisher Analytics Command Center"
        >
          <BarChart2 size={18} />
          <span>Creator Insights</span>
        </button>

        {/* Character Voice Morpher */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowVoiceMorphModal(true);
          }}
          className="btn-quick-action action-cyan"
          title="Real-Time Character Voice Shifter & DSP Studio"
        >
          <Mic size={18} />
          <span>Voice Morpher</span>
        </button>

        {/* Book Battle Royale Tournament */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowBattleArena(true);
          }}
          className="btn-quick-action action-gold"
          title="Launch Live Book Battle Trivia Tournament"
        >
          <Trophy size={18} />
          <span>Book Battle</span>
        </button>

        {/* Smart Foley & Auto Sound-FX */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowFoleyModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Smart Foley & Automated Story Sound FX"
        >
          <Zap size={18} />
          <span>Smart Foley</span>
        </button>

        {/* Book Club Discussion Stage */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowStageModal(true);
          }}
          className="btn-quick-action action-cyan"
          title="Manage Audience Voice Q&A Stage"
        >
          <Hand size={18} />
          <span>Book Club Stage</span>
        </button>

        {/* Audiobook Master Exporter */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowAudiobookModal(true);
          }}
          className="btn-quick-action action-gold"
          title="Multi-Track Stem Audio Studio & Audiobook Exporter"
        >
          <Layers size={18} />
          <span>Audiobook Master</span>
        </button>

        {/* Guest Star Stage */}
        {onOpenGuestStar && (
          <button
            onClick={() => {
              soundFX.playPop();
              onOpenGuestStar();
            }}
            className="btn-quick-action action-cyan"
            title="Launch Multi-Reader Stage"
          >
            <Users size={18} />
            <span>Guest Star</span>
          </button>
        )}

        {/* Raid Channel */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowRaid(true);
          }}
          className="btn-quick-action action-purple"
          title="Initiate Channel Raid"
        >
          <Radio size={18} />
          <span>Raid Channel</span>
        </button>

        {/* Start Poll */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowPoll(true);
          }}
          className="btn-quick-action action-cyan"
          title="Run Community Poll"
        >
          <BarChart2 size={18} />
          <span>Start Poll</span>
        </button>

        {/* Drop Stream Marker */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowMarker(true);
          }}
          className="btn-quick-action action-gold"
          title="Drop Stream Marker (Alt+M)"
        >
          <Bookmark size={18} />
          <span>Add Marker</span>
        </button>

        {/* AutoMod & Safety */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowAutoMod(true);
          }}
          className="btn-quick-action action-green"
          title="AutoMod & Blocked Terms"
        >
          <Shield size={18} />
          <span>AutoMod Safety</span>
        </button>

        {/* Redemptions Queue */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowRedemptions(true);
          }}
          className="btn-quick-action action-orange"
          title="Channel Point Redemptions Queue"
        >
          <Sparkles size={18} />
          <span>Reward Queue</span>
        </button>

        {/* Weekly Schedule */}
        <button
          onClick={() => {
            soundFX.playPop();
            setShowSchedule(true);
          }}
          className="btn-quick-action action-blue"
          title="Manage Weekly Schedule"
        >
          <Calendar size={18} />
          <span>Schedule</span>
        </button>

        {/* Emotes Studio Link */}
        <Link to="/emotes" className="btn-quick-action action-pink" title="Emotes & Badges Studio">
          <Smile size={18} />
          <span>Emotes Studio</span>
        </Link>

        {/* Video Producer Link */}
        <Link to="/producer" className="btn-quick-action action-teal" title="VOD Manager & Highlights">
          <Film size={18} />
          <span>Video Producer</span>
        </Link>

        {/* Analytics Hub Link */}
        <Link to="/analytics" className="btn-quick-action action-indigo" title="Channel Analytics & Revenue">
          <BarChart3 size={18} />
          <span>Analytics</span>
        </Link>
      </div>

      {/* MODALS */}
      {showRaid && (
        <RaidModal
          currentViewerCount={1420}
          currentStreamerId="mock_lillyreads"
          onInitiateRaid={() => setShowRaid(false)}
          onClose={() => setShowRaid(false)}
        />
      )}

      {showPoll && (
        <ChatPollModal
          onStartPoll={(poll) => {
            if (onStartPoll) onStartPoll(poll);
            setShowPoll(false);
          }}
          onClose={() => setShowPoll(false)}
        />
      )}

      {showMarker && (
        <StreamMarkerModal
          onAddMarker={(desc, time) => {
            if (onAddMarker) onAddMarker(desc, time);
            setShowMarker(false);
          }}
          onClose={() => setShowMarker(false)}
        />
      )}

      {showAutoMod && (
        <AutoModSettingsModal onClose={() => setShowAutoMod(false)} />
      )}

      {showRedemptions && (
        <RedemptionsQueueModal onClose={() => setShowRedemptions(false)} />
      )}

      {showSchedule && (
        <ScheduleCalendarModal
          streamerName={streamerName}
          isOwner={true}
          onClose={() => setShowSchedule(false)}
        />
      )}

      {showAudiobookModal && (
        <AudiobookExportModal
          bookTitle="The Fellowship of the Ring"
          author="J.R.R. Tolkien"
          chapterTitle="Chapter 2: The Shadow of the Past"
          onClose={() => setShowAudiobookModal(false)}
        />
      )}

      {showStageModal && (
        <BookClubStageModal
          isBroadcaster={true}
          activeSpeaker={null}
          onBringSpeakerOnAir={(_req) => {
            soundFX.playPop();
          }}
          onClose={() => setShowStageModal(false)}
        />
      )}

      {showFoleyModal && (
        <SmartFoleyStudioModal
          isFoleyEnabled={isFoleyEnabled}
          onToggleFoley={(enabled) => setIsFoleyEnabled(enabled)}
          onClose={() => setShowFoleyModal(false)}
        />
      )}

      {showBattleArena && (
        <BookBattleArena
          streamerName={streamerName}
          onClose={() => setShowBattleArena(false)}
        />
      )}

      {showVoiceMorphModal && (
        <VoiceMorphStudioModal
          onClose={() => setShowVoiceMorphModal(false)}
        />
      )}

      {showAnalyticsModal && (
        <CreatorAnalyticsModal
          onClose={() => setShowAnalyticsModal(false)}
        />
      )}

      {showMapHUD && (
        <InteractiveMapHUD
          onClose={() => setShowMapHUD(false)}
        />
      )}

      {showChroniclerModal && (
        <ChroniclerOracleModal
          onClose={() => setShowChroniclerModal(false)}
        />
      )}

      {showDuelModal && (
        <NarratorDuelModal
          onClose={() => setShowDuelModal(false)}
        />
      )}

      {showCompanionModal && (
        <CompanionModeModal
          onClose={() => setShowCompanionModal(false)}
        />
      )}

      {showTranslatorModal && (
        <UniversalTranslatorModal
          onClose={() => setShowTranslatorModal(false)}
        />
      )}

      {showBazaarModal && (
        <GrandBazaarModal
          onClose={() => setShowBazaarModal(false)}
        />
      )}

      {showSubModal && (
        <SubscriptionModal
          streamerName={streamerName}
          streamerId="streamer_primary"
          onClose={() => setShowSubModal(false)}
        />
      )}

      {showBranchHUD && (
        <StoryBranchHUD
          onClose={() => setShowBranchHUD(false)}
        />
      )}

      {showCharityModal && (
        <CharityMarathonWidget
          onClose={() => setShowCharityModal(false)}
        />
      )}

      {showVoiceRackModal && (
        <VoiceModulationRack
          onClose={() => setShowVoiceRackModal(false)}
        />
      )}

      {showMomentsModal && (
        <ReaderMomentsModal
          isStreamer={true}
          streamerName={streamerName}
          onClose={() => setShowMomentsModal(false)}
        />
      )}

      {showSoundboardModal && (
        <ViewerSoundboardModal
          streamerName={streamerName}
          onClose={() => setShowSoundboardModal(false)}
        />
      )}

      {showTranscriptModal && (
        <VodTranscriptViewer
          onClose={() => setShowTranscriptModal(false)}
        />
      )}

      {showSquadMulti && (
        <SquadMultiviewPlayer
          onClose={() => setShowSquadMulti(false)}
        />
      )}

      {showBountyModal && (
        <PublisherBountyBoardModal
          streamerName={streamerName}
          onClose={() => setShowBountyModal(false)}
        />
      )}

      {showTrailerModal && (
        <ChannelTrailerModal
          streamerName={streamerName}
          isOwner={true}
          onClose={() => setShowTrailerModal(false)}
        />
      )}

      {showLoreWikiModal && (
        <LoreGlossaryOverlay
          onClose={() => setShowLoreWikiModal(false)}
        />
      )}

      {showWatchPartyModal && (
        <WatchPartyRoomModal
          onClose={() => setShowWatchPartyModal(false)}
        />
      )}

      {showOBSOverlayModal && (
        <OBSOverlayStudioModal
          streamerName={streamerName}
          onClose={() => setShowOBSOverlayModal(false)}
        />
      )}

      {showStemsModal && (
        <AudiobookStemsMarketplaceModal
          onClose={() => setShowStemsModal(false)}
        />
      )}

      {showEmoteArtistModal && (
        <EmoteArtistAttributionModal
          onClose={() => setShowEmoteArtistModal(false)}
        />
      )}

      {showMarathonModal && (
        <MarathonScheduleHubModal
          onClose={() => setShowMarathonModal(false)}
        />
      )}

      {showShieldModal && (
        <ShieldModeModal
          streamerName={streamerName}
          onClose={() => setShowShieldModal(false)}
        />
      )}

      {showPayoutsModal && (
        <CreatorPayoutsModal
          streamerName={streamerName}
          onClose={() => setShowPayoutsModal(false)}
        />
      )}

      {showMerchModal && (
        <MerchStorefrontModal
          streamerName={streamerName}
          onClose={() => setShowMerchModal(false)}
        />
      )}

      {showCastMatrixModal && (
        <CharacterCastMatrixModal
          onClose={() => setShowCastMatrixModal(false)}
        />
      )}

      {showRaidStationModal && (
        <RaidStationModal
          streamerName={streamerName}
          onClose={() => setShowRaidStationModal(false)}
        />
      )}

      {showRolesModal && (
        <ChannelRolesModal
          streamerName={streamerName}
          onClose={() => setShowRolesModal(false)}
        />
      )}

      {showStreamHealthModal && (
        <StreamHealthModal
          onClose={() => setShowStreamHealthModal(false)}
        />
      )}

      {showGoalHubModal && (
        <CommunityGoalHubModal
          streamerName={streamerName}
          onClose={() => setShowGoalHubModal(false)}
        />
      )}

      {showHypeTrainModal && (
        <HypeTrainEngineModal
          streamerName={streamerName}
          onClose={() => setShowHypeTrainModal(false)}
        />
      )}

      {showLeaderboardsModal && (
        <StreamLeaderboardsModal
          streamerName={streamerName}
          onClose={() => setShowLeaderboardsModal(false)}
        />
      )}

      {showChatStudioModal && (
        <ChatSettingsStudioModal
          onClose={() => setShowChatStudioModal(false)}
        />
      )}

      {showDiscordSyncModal && (
        <DiscordRoleSyncModal
          streamerName={streamerName}
          onClose={() => setShowDiscordSyncModal(false)}
        />
      )}

      {showDropsModal && (
        <ViewerDropsModal
          onClose={() => setShowDropsModal(false)}
        />
      )}

      {showStreamDeckModal && (
        <StreamDeckShortcutsModal
          onClose={() => setShowStreamDeckModal(false)}
        />
      )}

      {showClipEditorModal && (
        <ClipEditorStudioModal
          streamerName={streamerName}
          onClose={() => setShowClipEditorModal(false)}
        />
      )}

      {showChannelRulesModal && (
        <ChannelRulesGateModal
          streamerName={streamerName}
          onClose={() => setShowChannelRulesModal(false)}
        />
      )}

      {showBookshelfModal && (
        <BookshelfCustomizerModal
          streamerName={streamerName}
          onClose={() => setShowBookshelfModal(false)}
        />
      )}

      {showSubMilestonesModal && (
        <SubMilestonesModal
          streamerName={streamerName}
          onClose={() => setShowSubMilestonesModal(false)}
        />
      )}

      {showGiftBombModal && (
        <CommunityGiftBombModal
          streamerName={streamerName}
          onClose={() => setShowGiftBombModal(false)}
        />
      )}

      {showPointsStudioModal && (
        <ChannelPointsStudioModal
          streamerName={streamerName}
          onClose={() => setShowPointsStudioModal(false)}
        />
      )}

      {showCommercialModal && (
        <CommercialBreakModal
          streamerName={streamerName}
          onClose={() => setShowCommercialModal(false)}
        />
      )}

      {showDualAudioModal && (
        <DualAudioMixerModal
          streamerName={streamerName}
          onClose={() => setShowDualAudioModal(false)}
        />
      )}

      {showPinnedModal && (
        <PinnedMessageStudioModal
          streamerName={streamerName}
          onClose={() => setShowPinnedModal(false)}
        />
      )}

      {showVodMarkersModal && (
        <VodChapterMarkersModal
          streamerName={streamerName}
          onClose={() => setShowVodMarkersModal(false)}
        />
      )}

      {showPredictionsModal && (
        <CommunityPredictionsModal
          streamerName={streamerName}
          onClose={() => setShowPredictionsModal(false)}
        />
      )}

      {showWhispersModal && (
        <WhisperMessagesModal
          onClose={() => setShowWhispersModal(false)}
        />
      )}

      {showModAuditModal && (
        <ModActionAuditLogModal
          streamerName={streamerName}
          onClose={() => setShowModAuditModal(false)}
        />
      )}

      {showContentWarnModal && (
        <ContentClassificationModal
          streamerName={streamerName}
          onClose={() => setShowContentWarnModal(false)}
        />
      )}

      {showLatencyModal && (
        <StreamLatencySettingsModal
          onClose={() => setShowLatencyModal(false)}
        />
      )}

      {showEmoteComboWidget && (
        <ChatEmoteComboWidget
          onClose={() => setShowEmoteComboWidget(false)}
        />
      )}

      {showMysteryBoxModal && (
        <MysteryBookBoxModal
          streamerName={streamerName}
          onClose={() => setShowMysteryBoxModal(false)}
        />
      )}

      {showTelemetryModal && (
        <ReadingTelemetryModal
          streamerName={streamerName}
          onClose={() => setShowTelemetryModal(false)}
        />
      )}

      {showTriviaArenaModal && (
        <BookTriviaArenaModal
          streamerName={streamerName}
          onClose={() => setShowTriviaArenaModal(false)}
        />
      )}

      {showVocalWarmupModal && (
        <VocalWarmupStudioModal
          streamerName={streamerName}
          onClose={() => setShowVocalWarmupModal(false)}
        />
      )}

      {showCoStreamRolesModal && (
        <CoStreamRoleSplitterModal
          streamerName={streamerName}
          onClose={() => setShowCoStreamRolesModal(false)}
        />
      )}

      {showAchievementsModal && (
        <CreatorAchievementsModal
          streamerName={streamerName}
          onClose={() => setShowAchievementsModal(false)}
        />
      )}

      {showVipFlairsModal && (
        <VipReaderFlairsModal
          streamerName={streamerName}
          onClose={() => setShowVipFlairsModal(false)}
        />
      )}

      {showChapterRecapModal && (
        <LiveChapterRecapModal
          streamerName={streamerName}
          onClose={() => setShowChapterRecapModal(false)}
        />
      )}

      {showVocalDynamicsModal && (
        <VocalDynamicsRackModal
          streamerName={streamerName}
          onClose={() => setShowVocalDynamicsModal(false)}
        />
      )}

      {showSpatialAudioModal && (
        <SquadSpatialAudioModal
          streamerName={streamerName}
          onClose={() => setShowSpatialAudioModal(false)}
        />
      )}

      {showHabitsHubModal && (
        <ReadingHabitsHubModal
          streamerName={streamerName}
          onClose={() => setShowHabitsHubModal(false)}
        />
      )}

      {showDonationTtsModal && (
        <DonationTtsStudioModal
          streamerName={streamerName}
          onClose={() => setShowDonationTtsModal(false)}
        />
      )}

      {showSubGiftModal && (
        <SubGiftLeaderboardModal
          streamerName={streamerName}
          onClose={() => setShowSubGiftModal(false)}
        />
      )}

      {showHighlightReelModal && (
        <HighlightReelGeneratorModal
          streamerName={streamerName}
          onClose={() => setShowHighlightReelModal(false)}
        />
      )}

      {showChatVerifyModal && (
        <ChatVerificationModal
          streamerName={streamerName}
          onClose={() => setShowChatVerifyModal(false)}
        />
      )}

      {showPacingMetronomeModal && (
        <ReadingPacingPacerModal
          streamerName={streamerName}
          onClose={() => setShowPacingMetronomeModal(false)}
        />
      )}

      {showSoundtrackModal && (
        <SoundtrackIntegrationModal
          streamerName={streamerName}
          onClose={() => setShowSoundtrackModal(false)}
        />
      )}

      {showCliffhangerWagerModal && (
        <CliffhangerWagersModal
          streamerName={streamerName}
          onClose={() => setShowCliffhangerWagerModal(false)}
        />
      )}

      {showEmoteSlotsModal && (
        <EmoteSlotsManagerModal
          streamerName={streamerName}
          onClose={() => setShowEmoteSlotsModal(false)}
        />
      )}

      {showCheatSheetModal && (
        <NarratorCheatSheetModal
          streamerName={streamerName}
          onClose={() => setShowCheatSheetModal(false)}
        />
      )}

      {showBackstageWhisperModal && (
        <BackstageWhisperModal
          streamerName={streamerName}
          onClose={() => setShowBackstageWhisperModal(false)}
        />
      )}

      {showJournalModal && (
        <ViewerJournalBookmarksModal
          streamerName={streamerName}
          onClose={() => setShowJournalModal(false)}
        />
      )}

      {showAuctionModal && (
        <CommunityAuctionModal
          streamerName={streamerName}
          onClose={() => setShowAuctionModal(false)}
        />
      )}

      {showSkillTreeModal && (
        <NarratorSkillTreeModal
          streamerName={streamerName}
          onClose={() => setShowSkillTreeModal(false)}
        />
      )}

      {showStreamTagTaxonomyModal && (
        <StreamTagTaxonomyModal
          streamerName={streamerName}
          onClose={() => setShowStreamTagTaxonomyModal(false)}
        />
      )}

      {showNarratorFaceOffModal && (
        <NarratorFaceOffModal
          streamerName={streamerName}
          onClose={() => setShowNarratorFaceOffModal(false)}
        />
      )}

      {showSubscribersWallModal && (
        <SubscribersWallOfHonorModal
          streamerName={streamerName}
          onClose={() => setShowSubscribersWallModal(false)}
        />
      )}

      {showVocalWarmupTrainerModal && (
        <VocalWarmupTrainerModal
          streamerName={streamerName}
          onClose={() => setShowVocalWarmupTrainerModal(false)}
        />
      )}

      {showChatThrottleModal && (
        <ChatPacingThrottleModal
          streamerName={streamerName}
          onClose={() => setShowChatThrottleModal(false)}
        />
      )}

      {showBookProgressModal && (
        <ChapterProgressSyncModal
          streamerName={streamerName}
          onClose={() => setShowBookProgressModal(false)}
        />
      )}

      {showSparksPinataModal && (
        <CommunitySparksPinataModal
          streamerName={streamerName}
          onClose={() => setShowSparksPinataModal(false)}
        />
      )}

      {showWorldAtlasModal && (
        <WorldLoreAtlasModal
          streamerName={streamerName}
          onClose={() => setShowWorldAtlasModal(false)}
        />
      )}

      {showAdBreakModal && (
        <AdBreakCountdownModal
          streamerName={streamerName}
          onClose={() => setShowAdBreakModal(false)}
        />
      )}

      {showSentimentHeatmapModal && (
        <ReaderSentimentHeatmapModal
          streamerName={streamerName}
          onClose={() => setShowSentimentHeatmapModal(false)}
        />
      )}

      {showGuildBattlepassModal && (
        <GuildReadingBattlepassModal
          streamerName={streamerName}
          onClose={() => setShowGuildBattlepassModal(false)}
        />
      )}

      {showAutoHostTeamsModal && (
        <AutoHostChannelTeamsModal
          streamerName={streamerName}
          onClose={() => setShowAutoHostTeamsModal(false)}
        />
      )}

      {showMultiCamModal && (
        <StreamDirectorMultiCamModal
          streamerName={streamerName}
          onClose={() => setShowMultiCamModal(false)}
        />
      )}

      {showOverlayThemesModal && (
        <OverlayThemesStudioModal
          streamerName={streamerName}
          onClose={() => setShowOverlayThemesModal(false)}
        />
      )}

      {showScreenFxModal && (
        <ScreenFxEmoteCannonModal
          streamerName={streamerName}
          onClose={() => setShowScreenFxModal(false)}
        />
      )}

      {showTeleprompterModal && (
        <MobileTeleprompterRemoteModal
          streamerName={streamerName}
          onClose={() => setShowTeleprompterModal(false)}
        />
      )}

      {showAcousticModal && (
        <RoomAcousticOptimizerModal
          streamerName={streamerName}
          onClose={() => setShowAcousticModal(false)}
        />
      )}

      {showVoicePadModal && (
        <VoiceMorphPresetPadModal
          streamerName={streamerName}
          onClose={() => setShowVoicePadModal(false)}
        />
      )}

      {showAudioRoutingModal && (
        <BackstageAudioRoutingModal
          streamerName={streamerName}
          onClose={() => setShowAudioRoutingModal(false)}
        />
      )}

      {showWpmModal && (
        <WpmTachometerModal
          streamerName={streamerName}
          onClose={() => setShowWpmModal(false)}
        />
      )}

      {showBossRaidModal && (
        <ReadingBossEncounterModal
          streamerName={streamerName}
          onClose={() => setShowBossRaidModal(false)}
        />
      )}

      {showTournamentModal && (
        <BookTournamentBracketModal
          streamerName={streamerName}
          onClose={() => setShowTournamentModal(false)}
        />
      )}

      {showGiveawayModal && (
        <BookGiveawayRandomizerModal
          streamerName={streamerName}
          onClose={() => setShowGiveawayModal(false)}
        />
      )}

      {showBookmarkStampModal && (
        <ChapterBookmarkStampModal
          streamerName={streamerName}
          onClose={() => setShowBookmarkStampModal(false)}
        />
      )}

      {showCustomFontModal && (
        <CustomChannelFontModal
          streamerName={streamerName}
          onClose={() => setShowCustomFontModal(false)}
        />
      )}

      {showMerchShopModal && (
        <PrintOnDemandMerchModal
          streamerName={streamerName}
          onClose={() => setShowMerchShopModal(false)}
        />
      )}

      {showBountyTrackerModal && (
        <PublisherBountyTrackerModal
          streamerName={streamerName}
          onClose={() => setShowBountyTrackerModal(false)}
        />
      )}

      {showSubLoungeModal && (
        <SubOnlyLoungeModal
          streamerName={streamerName}
          onClose={() => setShowSubLoungeModal(false)}
        />
      )}

      {showLightingModal && (
        <SmartLightingSyncModal
          streamerName={streamerName}
          onClose={() => setShowLightingModal(false)}
        />
      )}

      {showModShieldModal && (
        <AutomatedModShieldRulesModal
          streamerName={streamerName}
          onClose={() => setShowModShieldModal(false)}
        />
      )}

      {showRadioModal && (
        <SilentStudyRadioModal
          streamerName={streamerName}
          onClose={() => setShowRadioModal(false)}
        />
      )}

      {showVodArchivesModal && (
        <InteractiveVodArchivesModal
          streamerName={streamerName}
          onClose={() => setShowVodArchivesModal(false)}
        />
      )}

      {showMultiCastDramaModal && (
        <MultiCastAudioDramaModal
          streamerName={streamerName}
          onClose={() => setShowMultiCastDramaModal(false)}
        />
      )}

      {showObsKeyerModal && (
        <ObsVirtualKeyerModal
          streamerName={streamerName}
          onClose={() => setShowObsKeyerModal(false)}
        />
      )}

      {showVerticalClipModal && (
        <VerticalClipTranscoderModal
          streamerName={streamerName}
          onClose={() => setShowVerticalClipModal(false)}
        />
      )}

      {showStreamDeckWsModal && (
        <StreamDeckWebSocketModal
          streamerName={streamerName}
          onClose={() => setShowStreamDeckWsModal(false)}
        />
      )}

      {showSpatialPannerModal && (
        <SpatialBinauralPannerModal
          streamerName={streamerName}
          onClose={() => setShowSpatialPannerModal(false)}
        />
      )}

      {showEyeContactModal && (
        <EyeContactCorrectorModal
          streamerName={streamerName}
          onClose={() => setShowEyeContactModal(false)}
        />
      )}

      {showRsvpModal && (
        <RsvpSpeedReaderModal
          streamerName={streamerName}
          onClose={() => setShowRsvpModal(false)}
        />
      )}

      {showManuscriptZoomModal && (
        <ManuscriptZoomLoupeModal
          streamerName={streamerName}
          onClose={() => setShowManuscriptZoomModal(false)}
        />
      )}

      {showVocalHealthModal && (
        <VocalHealthTelemetryModal
          streamerName={streamerName}
          onClose={() => setShowVocalHealthModal(false)}
        />
      )}

      {showIntercomModal && (
        <BackstageIntercomModal
          streamerName={streamerName}
          onClose={() => setShowIntercomModal(false)}
        />
      )}

      {showTerritoryWarsModal && (
        <GuildTerritoryWarsModal
          streamerName={streamerName}
          onClose={() => setShowTerritoryWarsModal(false)}
        />
      )}

      {showD20Modal && (
        <D20SkillCheckModal
          streamerName={streamerName}
          onClose={() => setShowD20Modal(false)}
        />
      )}

      {showLoreCardsModal && (
        <LoreTradingCardsModal
          streamerName={streamerName}
          onClose={() => setShowLoreCardsModal(false)}
        />
      )}

      {showCitadelModal && (
        <ReaderCitadelBookshelfModal
          streamerName={streamerName}
          onClose={() => setShowCitadelModal(false)}
        />
      )}

      {showRelayModal && (
        <GlobalReadingRelayModal
          streamerName={streamerName}
          onClose={() => setShowRelayModal(false)}
        />
      )}

      {showCrosswordModal && (
        <ChapterCrosswordWordleModal
          streamerName={streamerName}
          onClose={() => setShowCrosswordModal(false)}
        />
      )}

      {showFamiliarModal && (
        <BookwormFamiliarModal
          streamerName={streamerName}
          onClose={() => setShowFamiliarModal(false)}
        />
      )}

      {showArcheryModal && (
        <TriviaArcheryRangeModal
          streamerName={streamerName}
          onClose={() => setShowArcheryModal(false)}
        />
      )}

      {showTribunalModal && (
        <LoreCanonTribunalModal
          streamerName={streamerName}
          onClose={() => setShowTribunalModal(false)}
        />
      )}

      {showVolcanoModal && (
        <GoldLeafVolcanoModal
          streamerName={streamerName}
          onClose={() => setShowVolcanoModal(false)}
        />
      )}

      {showCrowdfundingModal && (
        <LiveCrowdfundingOverlayModal
          streamerName={streamerName}
          onClose={() => setShowCrowdfundingModal(false)}
        />
      )}

      {showBookSigningModal && (
        <DigitalBookSigningModal
          streamerName={streamerName}
          onClose={() => setShowBookSigningModal(false)}
        />
      )}

      {showEarlyAccessModal && (
        <ChapterEarlyAccessModal
          streamerName={streamerName}
          onClose={() => setShowEarlyAccessModal(false)}
        />
      )}

      {showBlindDateModal && (
        <BlindDateUnboxingModal
          streamerName={streamerName}
          onClose={() => setShowBlindDateModal(false)}
        />
      )}

      {showStripeDirectPayoutsModal && (
        <CreatorStripePayoutsModal
          streamerName={streamerName}
          onClose={() => setShowStripeDirectPayoutsModal(false)}
        />
      )}

      {showIndieBookshopModal && (
        <IndieBookshopAffiliateModal
          streamerName={streamerName}
          onClose={() => setShowIndieBookshopModal(false)}
        />
      )}

      {showBrandDealsModal && (
        <BookClubBrandDealsModal
          streamerName={streamerName}
          onClose={() => setShowBrandDealsModal(false)}
        />
      )}

      {showVipTicketsModal && (
        <VipTicketedEventsModal
          streamerName={streamerName}
          onClose={() => setShowVipTicketsModal(false)}
        />
      )}

      {showHardcoverStudioModal && (
        <CustomHardcoverStudioModal
          streamerName={streamerName}
          onClose={() => setShowHardcoverStudioModal(false)}
        />
      )}

      {showAuthorRoyaltyModal && (
        <AuthorRoyaltyLendingModal
          streamerName={streamerName}
          onClose={() => setShowAuthorRoyaltyModal(false)}
        />
      )}
    </div>
  );
};
