import {Injectable} from "@angular/core";

import { ReduxModule } from '../redux-module.class';
import { featureToggleReducer } from "./feature-toggle.reducer";
import { IAppState } from "../state.interface";
import { IPayloadAction } from "../action.interface";
import { FeatureToggleActions } from './feature-toggle.actions';

@Injectable()
export class FeatureToggleModule extends ReduxModule<IAppState, IPayloadAction>  {
  reducers=[{name:'featureToggleReducer', reducer:featureToggleReducer}];
  action = FeatureToggleActions;
  constructor() {
    super();
  }

  initialize():void {}
}