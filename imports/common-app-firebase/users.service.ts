import App = firebase.app.App;
import { Observable } from 'rxjs';

import { IUser, IDocumentChange, IUsersService } from 'common-app';

export class UsersServiceFirebase implements IUsersService {
  constructor(private firebase: App) {
  }
  createUsersObserver():Observable<IDocumentChange<IUser>>
  {
    return Observable.never(); // Depends on app calling UsersActions.dispatchChange()
  }
}
