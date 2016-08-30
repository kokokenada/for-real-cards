
import {NeverObservable} from 'rxjs/observable/NeverObservable';
import { Action } from 'redux';

export class NeverObservableAction extends NeverObservable<Action> {
  type:string;
  constructor() {
    super();
  }
}