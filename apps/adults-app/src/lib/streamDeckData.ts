export interface StreamDeckKeyMapping {
  id: string;
  actionName: string;
  category: 'Navigation' | 'Audio & Foley' | 'Safety & Shield' | 'Clips & Markers';
  defaultKey: string;
  icon: string;
  description: string;
}

export const MOCK_STREAM_DECK_KEYS: StreamDeckKeyMapping[] = [
  {
    id: 'key_page_next',
    actionName: 'Turn Page Forward',
    category: 'Navigation',
    defaultKey: 'Right Arrow (→)',
    icon: '📖',
    description: 'Increments reader page counter and updates stream HUD'
  },
  {
    id: 'key_page_prev',
    actionName: 'Turn Page Backward',
    category: 'Navigation',
    defaultKey: 'Left Arrow (←)',
    icon: '📜',
    description: 'Decrements reader page counter and updates stream HUD'
  },
  {
    id: 'key_clip_30s',
    actionName: 'Instant 30s Clip',
    category: 'Clips & Markers',
    defaultKey: 'Key C',
    icon: '✂️',
    description: 'Captures and renders past 30 seconds of high-fidelity stream audio'
  },
  {
    id: 'key_foley_mute',
    actionName: 'Mute / Solo Foley SFX',
    category: 'Audio & Foley',
    defaultKey: 'Key M',
    icon: '🌧️',
    description: 'Quickly silences ambient rain, footsteps, or hearth background tracks'
  },
  {
    id: 'key_panic_shield',
    actionName: 'Trigger Shield Mode',
    category: 'Safety & Shield',
    defaultKey: 'Key S',
    icon: '🛡️',
    description: 'Emergency 1-click panic lockdown of chat and spoiler shields'
  },
  {
    id: 'key_sound_harp',
    actionName: 'Trigger Fantasy Harp SFX',
    category: 'Audio & Foley',
    defaultKey: 'Key H',
    icon: '✨',
    description: 'Plays melodic acoustic Celtic lute chime to chat and stream overlay'
  }
];
