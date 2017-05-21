
import {IDocumentChange, IUser} from 'common-app';
import {Observable} from 'rxjs/Observable';

export interface IUsersService {
  createUsersObserver():Observable<IDocumentChange<IUser>>;
}