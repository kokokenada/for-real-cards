import {Injectable} from "@angular/core";

import { ReduxPackage, IAppState, IPayloadAction } from 'redux-package';
import { featureToggleReducer } from "./feature-toggle.reducer";
import { FeatureToggleActions } from './feature-toggle.actions';

@Injectable()
export class FeatureToggleModule extends ReduxPackage<IAppState, IPayloadAction>  {
  reducers=[{name:'featureToggleReducer', reducer:featureToggleReducer}];
  action = FeatureToggleActions;
  constructor() {
    super();
  }
}