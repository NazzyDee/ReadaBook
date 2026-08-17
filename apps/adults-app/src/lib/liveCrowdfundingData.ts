export interface CrowdfundingTier {
  id: string;
  tierName: string;
  pledgeAmountUSD: number;
  rewardDescription: string;
  backersCount: number;
  isLimited: boolean;
  slotsRemaining: number | null;
}

export interface LiveCrowdfundingCampaign {
  id: string;
  projectTitle: string;
  platform: 'KICKSTARTER' | 'BACKERKIT' | 'READABOOK_DIRECT';
  currentFundedUSD: number;
  fundingGoalUSD: number;
  daysRemaining: number;
  stretchGoalTitle: string;
  stretchGoalUSD: number;
  tiers: CrowdfundingTier[];
}

export const DEFAULT_CROWDFUNDING: LiveCrowdfundingCampaign = {
  id: 'campaign_leather_omnibus',
  projectTitle: 'The Illustrated Dragon-Rider Omnibus (Handbound Leather & Foil Edition)',
  platform: 'KICKSTARTER',
  currentFundedUSD: 84200,
  fundingGoalUSD: 25000,
  daysRemaining: 12,
  stretchGoalTitle: 'Custom Sprayed Edge Artwork & Ribbon Bookmark',
  stretchGoalUSD: 100000,
  tiers: [
    {
      id: 'tier_digital_ebook',
      tierName: 'Digital Grimoire E-Book',
      pledgeAmountUSD: 25,
      rewardDescription: 'DRM-Free EPUB + Author Live Stream Voice Commentary Audio Track',
      backersCount: 480,
      isLimited: false,
      slotsRemaining: null
    },
    {
      id: 'tier_hardcover_slipcase',
      tierName: 'Deluxe Gold Foil Slipcase Hardcover',
      pledgeAmountUSD: 120,
      rewardDescription: 'Signed First Edition Hardcover + Custom Metal Bookmark + Backer Crest',
      backersCount: 350,
      isLimited: true,
      slotsRemaining: 15
    },
    {
      id: 'tier_immortal_patron',
      tierName: 'Immortal Patron (Name in Book)',
      pledgeAmountUSD: 500,
      rewardDescription: 'Your name immortalized as a taverner NPC in Chapter 4 + Hand-carved wax seal',
      backersCount: 18,
      isLimited: true,
      slotsRemaining: 2
    }
  ]
};
