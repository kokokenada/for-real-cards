import { Injectable } from '@angular/core';
import { IPayloadAction  } from '../action.interface';
import { Observable } from 'rxjs/Observable';
import { Store } from "redux";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
//import 'rxjs/add/observable/delay';

import { ConnectService } from "./connect.service";
import { ConnectActions } from "./connect-actions.class";
import {IAppState} from "../state.interface";
import {IConnectState} from "./connect.types";


@Injectable()
export class ConnectAsync {
  constructor(private connectActions: ConnectActions) {}

  connect = (action$: Observable<IPayloadAction>) => {
    return action$.filter(({ type }) => type === ConnectActions.CONNECT_START)
      .flatMap(({ payload }) => {
        if (ConnectService.isConnected()) {
          // We're already connected, so dispatch a success reponse
          return Observable.from([this.connectActions.successFactory(ConnectService.getServerURL())]);
        } else {
          // Not connected,
          return Observable.from([this.connectActions.attemptFactory(ConnectService.getServerURL())]);
        }
      });
  };

  attempt= (action$: Observable<IPayloadAction>, store: Store<IAppState>) => {
    return action$.filter(({ type }) => type === ConnectActions.CONNECT_ATTEMPT)
      .flatMap(({ payload }) => {
        if (ConnectService.isConnected()) {
          return Observable.from([this.connectActions.successFactory(ConnectService.getServerURL())]);
        } else {
          ConnectService.reconnect();
          return Observable.from([this.connectActions.attemptFactory(ConnectService.getServerURL())]).delay(5000);
        }
      });
  };

  setNewServer= (action$: Observable<IPayloadAction>) => {
    return action$.filter(({ type }) => type === ConnectActions.CONNECT_SET_SERVER)
      .flatMap(({ payload }) => {
        ConnectService.disconnect();
        ConnectService.setServerTo(payload.serverURL);
        return Observable.from([this.connectActions.attemptFactory(ConnectService.getServerURL())]);
      }
    );
  };
}
