import {Injectable} from "@angular/core";

import { ReduxModule} from '../redux-module.class';
import { modalReducer} from "./modal-reducer";
import { IAppState } from "../state.interface";
import { IPayloadAction } from "../action.interface";
import { ModalActions} from "./modal-actions.class";

@Injectable()
export class ModalModule extends ReduxModule<IAppState, IPayloadAction>  {
  reducers=[{name:'modalReducer', reducer: modalReducer}];
  actions = ModalActions;
}