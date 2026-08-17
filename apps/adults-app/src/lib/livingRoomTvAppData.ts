export interface LivingRoomTvDevice {
  tvId: string;
  tvPlatform: 'APPLE_TV_4K' | 'ANDROID_TV_SONY' | 'FIRE_TV_STICK' | 'LG_WEBOS';
  tvRoomName: string;
  isCastingActive: boolean;
  tvResolution: '4K_HDR' | '1080P_60FPS';
  fireplaceModeEnabled: boolean;
}

export const DEFAULT_TV_DEVICES: LivingRoomTvDevice[] = [
  {
    tvId: 'tv_appletv_living',
    tvPlatform: 'APPLE_TV_4K',
    tvRoomName: 'Living Room 75" OLED',
    isCastingActive: true,
    tvResolution: '4K_HDR',
    fireplaceModeEnabled: true
  },
  {
    tvId: 'tv_bedroom_firetv',
    tvPlatform: 'FIRE_TV_STICK',
    tvRoomName: 'Master Bedroom Frame TV',
    isCastingActive: false,
    tvResolution: '1080P_60FPS',
    fireplaceModeEnabled: false
  }
];
