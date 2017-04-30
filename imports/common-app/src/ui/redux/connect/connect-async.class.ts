import { Injectable } from '@angular/core';
import { IPayloadAction } from 'redux-package';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';

import { ConnectService } from "./connect.service";
import { ConnectActions } from "./connect-actions.class";


@Injectable()
export class ConnectAsync {

  connect = (action$: Observable<IPayloadAction>) => {
    return action$.filter(({ type }) => type === ConnectActions.CONNECT_START)
      .flatMap(({ payload }) => {
        if (ConnectService.isConnected()) {
          // We're already connected, so dispatch a success reponse
          return Observable.from([ConnectActions.successFactory(ConnectService.getServerURL())]);
        } else {
          // Not connected,
          return Observable.from([ConnectActions.attemptFactory(ConnectService.getServerURL())]);
        }
      });
  };

  attempt= (action$: Observable<IPayloadAction>) => {
    return action$.filter(({ type }) => type === ConnectActions.CONNECT_ATTEMPT)
      .flatMap(({ payload }) => {
        if (ConnectService.isConnected()) {
          return Observable.from([ConnectActions.successFactory(ConnectService.getServerURL())]);
        } else {
          ConnectService.reconnect();
          return Observable.from([ConnectActions.attemptFactory(ConnectService.getServerURL())]).delay(5000);
        }
      });
  };

  setNewServer= (action$: Observable<IPayloadAction>) => {
    return action$.filter(({ type }) => type === ConnectActions.CONNECT_SET_SERVER)
      .flatMap(({ payload }) => {
        ConnectService.disconnect();
        ConnectService.setServerTo(payload.serverURL);
        return Observable.from([ConnectActions.attemptFactory(ConnectService.getServerURL())]);
      }
    );
  };
}
