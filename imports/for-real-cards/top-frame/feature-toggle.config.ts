import { IFeatureToggleConfigSet } from 'common-app';

export const FEATURE_TOGGLE_USE_FIREBASE = 'firebase';

// Beware that the initial settings might be overridden by redux state persistence
export const featureToggleConfigs: IFeatureToggleConfigSet = {
  'mobile-tracking': {
    setting: true,
    responsible: 'Ken Ono',
    description:
      `Controls if we track mobile usage`,
    shouldExpireAt: new Date('2017-08-31')
  },
  'redux-console-logging': {
    setting: true,
    description: 'turns on or off console logging of redux state changes'
  },
  'desktop-ionic': {
    setting: false,
    description: 'Use ionic desktop'
  },
  'mobile-ionic': {
    setting: false,
    description: 'Use ionic desktop'
  },
  'analytics-logger': {
    setting: false,
    description: 'Analytics events to console'
  },
  [FEATURE_TOGGLE_USE_FIREBASE]: {
    setting: false,
  }
};
