///<reference path='../../../../../../node_modules/immutable/dist/immutable.d.ts'/>
import Immutable = require('immutable');
import { IPayloadAction } from '../action.interface';
import { ModalActions } from './modal-actions.class';
import {IModalActionPayload, IModalState} from './modal.types'

const INITIAL_STATE:IModalState = {
  params: {},
  result: {},
  component: null,
  displaying:false,
  opening:false,
  closing:false
};

export function modalReducer(
  state: IModalState = INITIAL_STATE,
  action: IPayloadAction): IModalState
{
  let payload:IModalActionPayload = action.payload;
  switch (action.type) {
    case ModalActions.MODAL_OPEN_REQUEST:
      console.log('in modalReducer open')
      console.log(state)
      console.log(action)
      return Object.assign({}, state, {params: payload.params, opening:true, component: payload.component});
    case ModalActions.MODAL_OPEN_SUCCESS:
      return Object.assign({}, state, {displaying:true, opening:false});
    case ModalActions.MODAL_RESOLVE_REQUEST:
      return Object.assign({}, state, {result: payload.result, closing:true});
    case ModalActions.MODAL_RESOLVE_SUCCESS:
      return Object.assign({}, state, {closing:false, displaying:false});
    default:
      return state;
  }
}

