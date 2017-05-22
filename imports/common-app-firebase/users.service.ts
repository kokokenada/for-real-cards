import App = firebase.app.App;
import { Observable } from 'rxjs';

import { IUser, IDocumentChange } from 'common-app';
import {IUsersService} from '../common-app/src/ui/redux/users/users-service-interface';

export class UsersServiceFirebase implements IUsersService {
  constructor(private firebase: App) {
  }
  createUsersObserver():Observable<IDocumentChange<IUser>>
  {
    return Observable.never(); // Depends on app calling UsersActions.dispatchChange()
  }
}
