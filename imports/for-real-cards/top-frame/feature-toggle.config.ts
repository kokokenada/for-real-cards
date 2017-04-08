import { IFeatureToggleConfigSet } from '../../common-app/src/ui';


// Beware that the initial settings might be overridden by redux state persistence
export const featureToggleConfigs: IFeatureToggleConfigSet = {
  'mobile-tracking': {
    setting: false,
    responsible: 'Ken Ono',
    description:
      `Controls if we track mobile usage`,
    shouldExpireAt: new Date('2017-08-31')
  },
  'redux-console-logging': {
    setting: false,
    description: 'turns on or off console logging of redux state changes'
  },
  'desktop-ionic': {
    setting: false,
    description: 'Use ionic desktop'
  },
  'mobile-ionic': {
    setting: true,
    description: 'Use ionic desktop'
  }
};
