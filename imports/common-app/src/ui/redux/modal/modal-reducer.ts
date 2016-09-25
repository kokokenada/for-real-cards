///<reference path='../../../../../../node_modules/immutable/dist/immutable.d.ts'/>
import Immutable = require('immutable');
import { IPayloadAction } from '../action.interface';
import { ModalActions } from './modal-actions.class';
import {IModalActionPayload, IModalState} from './modal.types'

const INITIAL_STATE:IModalState = {
  params: {},
  result: {},
  displaying:false
};

export function modalReducer(
  state: IModalState = INITIAL_STATE,
  action: IPayloadAction): IModalState
{
  let payload:IModalActionPayload = action.payload;
  switch (action.type) {
    case ModalActions.MODAL_OPEN:
      return Object.assign({}, state, {params: payload.params, displaying:true});
    case ModalActions.MODAL_RESOLVE:
      return Object.assign({}, state, {params: payload.result, displaying:false});
    default:
      return state;
  }
}

