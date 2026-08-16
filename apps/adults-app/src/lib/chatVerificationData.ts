export interface ChatVerificationGateSettings {
  mode: 'RELAXED' | 'STANDARD' | 'IRONCLAD';
  mustBeFollower: boolean;
  minFollowDurationMinutes: number;
  mustHaveCompletedBook: boolean;
  mustBeSubscribed: boolean;
  mustHaveVerifiedEmail: boolean;
  mustHavePhoneVerified: boolean;
  minAccountAgeDays: number;
  slowModeSeconds: number;
}

export const DEFAULT_CHAT_VERIFICATION: ChatVerificationGateSettings = {
  mode: 'STANDARD',
  mustBeFollower: true,
  minFollowDurationMinutes: 10,
  mustHaveCompletedBook: true,
  mustBeSubscribed: false,
  mustHaveVerifiedEmail: true,
  mustHavePhoneVerified: false,
  minAccountAgeDays: 7,
  slowModeSeconds: 5
};
