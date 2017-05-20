import { Observable } from 'rxjs';

import {
  Credentials,
  IDocumentChange,
  LoginActions,
  ILoginService,
  ILoginActionPayload,
  IUser, ILoginState, LOGIN_PACKAGE_NAME
} from 'common-app';
import {IActionError, IPayloadAction, ReduxPackageCombiner} from 'redux-package';
import App = firebase.app.App;
import {transformUser} from './transform-user';
import {Subject} from 'rxjs/Subject';

export class LoginServiceFirebase implements ILoginService {
  constructor(private firebase: App) {
  }

  login(credentials: Credentials): Promise<IPayloadAction> {
    return new Promise((resolve, reject) => {
      console.debug("logging in:" + JSON.stringify(credentials));
      credentials.saveCredentials();
      this.firebase.auth().signInWithEmailAndPassword(credentials.username, credentials.password)
        .then((fbUser: firebase.User) => {
            let user = transformUser(fbUser);
            console.info('Login successful.');
            resolve(
              LoginActions.loginSuccessFactory(user, user._id)
            );
          }, (error) => {
            this.handleError(error);
          }
        );
    })
  }

  static defaultAvatarUrl() { // Move this
    return //Meteor.absoluteUrl('default-avatar.png');
  };

  private handleError(error) {
    let emitError: IActionError = {
      error: error.code,
      message: error.message
    };
    LoginActions.errorNotification(emitError);
  }

  register(credentials: Credentials): Promise<IPayloadAction> {
    return new Promise((resolve, reject) => {
      console.debug("Creating user:" + JSON.stringify(credentials));
      credentials.saveCredentials();

      this.firebase.auth().createUserWithEmailAndPassword(
        credentials.username,
        credentials.password
      ).catch((error) => {
        this.handleError(error);
      }).then((fbUser: firebase.User) => {
        if (fbUser) {
          let user = transformUser(fbUser);
          console.info('Create User successful.');
          resolve(
            LoginActions.loginSuccessFactory(user, user._id)
          );
        }
      });
    });
  };

  createTempUser(): Promise<IPayloadAction> {
    throw 'create temp user not yet implemented';
  }

  saveUser(edittedUserObject: IUser): Promise<IPayloadAction> {
    throw 'update user not yet implemented';
  }

  logOut(): Promise<IPayloadAction> {
    return new Promise((resolve, reject) => {
      this.firebase.auth().signOut().then(
        () => {
          resolve(LoginActions.loggedOutFactory());
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  watchForAutoLogin(): Observable<ILoginActionPayload> {
    const isAuto = ( loginState: ILoginState ): boolean => {
      if (loginState)
        return loginState.userId === null;
      return false;
    };

    let lastLoginState = null;
    ReduxPackageCombiner
      .select(LOGIN_PACKAGE_NAME)
      .subscribe((loginState: ILoginState) => {
        lastLoginState = loginState;
      });

    let subject = new Subject();

    this.firebase.auth().onAuthStateChanged( (fbuser) => {
      console.log('Log in dectecyed');
      const user = transformUser(fbuser);
      console.log(user);
      if (user) {
        subject.next( LoginActions.loginSuccessFactory(
          user,
          user._id,
          isAuto(lastLoginState)
        ));
      }
    });
    return subject;
  }

  watchCurrentUser(): Observable<ILoginActionPayload> {
    return Observable.never();
  }

  defaultAvatarUrl(): string {
    return 'default-avatar.png';
  }
}