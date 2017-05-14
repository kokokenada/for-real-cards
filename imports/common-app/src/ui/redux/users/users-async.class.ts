import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import { IPayloadAction  } from 'redux-package';

import { IDocumentChange, IUser } from 'common-app';

import { UsersService } from "./users.service";
import { UsersActions } from "./users-actions.class";


@Injectable()
export class UsersAsync {

  watchUsers = (action$: Observable<IPayloadAction>) => {
    return action$
      .filter(({ type }) => type === UsersActions.WATCH)
      .flatMap(({ payload }) => {
        return UsersService.createUsersObserver().map( (change:IDocumentChange<IUser>)=>{
          return UsersActions.changeFactory(change);
        })
        .catch(error => Observable.of(error));

      });
  }

}
