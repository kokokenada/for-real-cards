import {Injectable} from "@angular/core";

import { ReduxModule} from '../redux-module.class';
import { modalReducer} from "./modal-reducer";
import { ModalAsync} from "./modal-async.class";
import { IAppState } from "../state.interface";
import { IPayloadAction } from "../action.interface";
import { ModalActions} from "./modal-actions.class";

@Injectable()
export class ModalModule extends ReduxModule<IAppState, IPayloadAction>  {
  reducer={name:'modalReducer', reducer: modalReducer};

  constructor(private modalAsync:ModalAsync, public actions:ModalActions) {
    super();
    this.middlewares.push(modalAsync.modalMiddleware);
  }

  initialize():void {
  }
}