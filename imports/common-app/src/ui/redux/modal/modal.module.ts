import {Injectable} from "@angular/core";

import { ReduxPackage, IAppState, IPayloadAction } from 'redux-package';
import { modalReducer} from "./modal-reducer";
import { ModalActions} from "./modal-actions.class";

@Injectable()
export class ModalModule extends ReduxPackage<IAppState, IPayloadAction>  {
  reducers=[{name:'modalReducer', reducer: modalReducer}];
  actions = ModalActions;
}