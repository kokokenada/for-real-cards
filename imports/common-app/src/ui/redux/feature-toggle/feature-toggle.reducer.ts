import { IPayloadAction } from 'redux-package';
import { FeatureToggleActions } from './feature-toggle.actions';
import { INITIAL_STATE, fromConfig } from './feature-toggle.initial-state';
import { IToggleRecord } from './feature-toggle.types';

export function featureToggleReducer(
  state: IToggleRecord = INITIAL_STATE,
  action: IPayloadAction
): IToggleRecord {
  const payload = action.payload;

  switch (action.type) {
    case FeatureToggleActions.TOGGLE_FEATURE:
      return state.merge(payload);
    case FeatureToggleActions.FEATURE_TOGGLE_INITIALIZE:
      return fromConfig(payload);
    default:
      return state;
  }
}
