import { IPayloadAction } from 'redux-package';
import { ModalActions } from './modal-actions.class';
import {IModalActionPayload, IModalState} from './modal.types'

const INITIAL_STATE:IModalState<any, any> = {
  params: {},
  result: {},
  component: null,
  lastEvent: ''
};

export function modalReducer(
  state: IModalState<any, any> = INITIAL_STATE,
  action: IPayloadAction): IModalState<any, any>
{
  let payload:IModalActionPayload = action.payload;
  switch (action.type) {
    case ModalActions.MODAL_OPEN_REQUEST:
      return Object.assign({}, state, {params: payload.params, opening:true, component: payload.component, lastEvent:action.type});
    case ModalActions.MODAL_OPEN_SUCCESS:
      return Object.assign({}, state, {displaying:true, opening:false, lastEvent:action.type});
    case ModalActions.MODAL_RESOLVE_REQUEST:
      return Object.assign({}, state, {result: payload.result, closing:true, lastEvent:action.type});
    case ModalActions.MODAL_RESOLVE_SUCCESS:
      return Object.assign({}, state, {closing:false, displaying:false, lastEvent:action.type});
    default:
      return state;
  }
}

