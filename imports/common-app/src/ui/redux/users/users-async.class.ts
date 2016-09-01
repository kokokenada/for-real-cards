import { Injectable } from '@angular/core';
import { IPayloadAction  } from '../action.interface';
import { Observable } from 'rxjs/Observable';
import { Store } from "redux";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
//import 'rxjs/add/observable/delay';

import { UsersService } from "./users.service";
import { UsersActions } from "./users-actions.class";
import {IAppState} from "../state.interface";
import {IUsersState} from "./users.types";
import {IDocumentChange} from "../../reactive-data/document-change.interface";
import {User} from "../../../../../common-app-api/src/api/models/user.model";


@Injectable()
export class UsersAsync {
  constructor(private usersActions: UsersActions) {}

  watchUsers = (action$: Observable<IPayloadAction>) => {
    return action$.filter(({ type }) => type === UsersActions.WATCH)
      .flatMap(({ payload }) => {
        return UsersService.createUsersObserver().map( (change:IDocumentChange<User>)=>{
          return UsersActions.changeFactory(change);
        });

      });
  }

}
