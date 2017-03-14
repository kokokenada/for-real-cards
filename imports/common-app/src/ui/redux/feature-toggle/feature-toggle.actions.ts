import { Injectable } from '@angular/core';
import { ReduxModuleCombiner } from "../redux-module-combiner";

import { ToggleUtil } from './feature-toggle-util';
import {IFeatureToggleConfigSet} from "./feature-toggle.types";

@Injectable()
export class FeatureToggleActions {
  static TOGGLE_FEATURE = 'TOGGLE_FEATURE';
  static FEATURE_TOGGLE_INITIALIZE = 'FEATURE_TOGGLE_INITIALIZE';


  toggleFeatureSetting(target) {
    ReduxModuleCombiner.ngRedux.dispatch({
      type: FeatureToggleActions.TOGGLE_FEATURE,
      payload: ToggleUtil.stripIds(target),
    });
  }

  initialize(configSet: IFeatureToggleConfigSet) {
    ReduxModuleCombiner.ngRedux.dispatch({
      type: FeatureToggleActions.FEATURE_TOGGLE_INITIALIZE,
      payload: ToggleUtil.stripIds(configSet),
    });
  }
}
