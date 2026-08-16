export interface SpatialNarratorNode {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  panPosition: 'LEFT' | 'CENTER_LEFT' | 'CENTER' | 'CENTER_RIGHT' | 'RIGHT';
  volumePercent: number;
  color: string;
}

export interface ReverbEnvironment {
  id: string;
  name: string;
  description: string;
  reverbDecaySeconds: number;
  icon: string;
}

export const MOCK_SPATIAL_NARRATORS: SpatialNarratorNode[] = [
  {
    id: 'narr_host',
    name: 'Host (You)',
    role: 'Lead Narrator',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    panPosition: 'CENTER',
    volumePercent: 100,
    color: '#ffd700'
  },
  {
    id: 'narr_guest1',
    name: 'GrimNarrator',
    role: 'Gandalf / Villains',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    panPosition: 'LEFT',
    volumePercent: 90,
    color: '#00b4d8'
  },
  {
    id: 'narr_guest2',
    name: 'LillysNumberOneFan',
    role: 'Bilbo / Companions',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    panPosition: 'RIGHT',
    volumePercent: 95,
    color: '#00ff88'
  }
];

export const REVERB_ENVIRONMENTS: ReverbEnvironment[] = [
  {
    id: 'rev_library',
    name: 'Ancient High Library',
    description: 'High vaulted stone ceilings with warm, rich ambient tail.',
    reverbDecaySeconds: 1.8,
    icon: '🏛️'
  },
  {
    id: 'rev_cabin',
    name: 'Cozy Timber Hearth Cabin',
    description: 'Warm, dry intimate wooden reflections with crackling fire.',
    reverbDecaySeconds: 0.6,
    icon: '🪵'
  },
  {
    id: 'rev_cathedral',
    name: 'Gothic Lore Cathedral',
    description: 'Deep resonant orchestral acoustics and ethereal decay.',
    reverbDecaySeconds: 3.2,
    icon: '⛪'
  }
];
