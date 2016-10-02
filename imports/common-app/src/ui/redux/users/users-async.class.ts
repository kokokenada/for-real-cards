import { Injectable } from '@angular/core';
import { IPayloadAction  } from '../action.interface';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';

import { User } from "../../../../../common-app-api/src/api/models/user.model";

import { UsersService } from "./users.service";
import { UsersActions } from "./users-actions.class";
import { IDocumentChange } from "../../reactive-data/document-change.interface";


@Injectable()
export class UsersAsync {

  watchUsers = (action$: Observable<IPayloadAction>) => {
    return action$.filter(({ type }) => type === UsersActions.WATCH)
      .flatMap(({ payload }) => {
        return UsersService.createUsersObserver().map( (change:IDocumentChange<User>)=>{
          return UsersActions.changeFactory(change);
        })
        .catch(error => Observable.of(error));

      });
  }

}
