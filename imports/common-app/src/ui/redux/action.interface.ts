
import { Action } from 'redux';

export interface IActionError {
  error: string | number;
  reason ? : string;
  details ? : string;
  message ? : string;
}

export interface IPayloadAction extends Action {
  payload?: any;
  error?:IActionError;
}

/*
TODO: How do I use ActionsObservable with typed actions?
 import { Operator } from 'rxjs/Operator';
 import { ActionsObservable } from 'redux-observable';

export class ActionsPayloadObservable implements ActionsObservable {
  private actionsObservable:ActionsObservable;
  constructor(action:IPayloadAction) {
    this.actionsObservable = new ActionsObservable(action);
  }
  lift(operator: Operator<any, GamePlayAction>) {
    this.actionsObservable.lift(operator);
  }
  ofType(...key: any[]){
    this.actionsObservable.ofType(key)
  }

} */
