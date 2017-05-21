import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import { IPayloadAction  } from 'redux-package';

import { IDocumentChange, IUser } from 'common-app';

import { UsersActions } from "./users-actions";
import {IUsersService} from './users-service-interface';

export class UsersAsync {
  constructor(private service: IUsersService) {
  }

  watchUsers = (action$: Observable<IPayloadAction>) => {
    return action$
      .filter(({ type }) => type === UsersActions.WATCH)
      .flatMap(({ payload }) => {
        return this.service.createUsersObserver().map( (change:IDocumentChange<IUser>)=>{
          return UsersActions.changeFactory(change);
        })
        .catch(error => Observable.of(error));

      });
  }

}
