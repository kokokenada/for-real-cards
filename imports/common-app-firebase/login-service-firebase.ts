import {Observable} from 'rxjs';

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
import {conditionObjectForFirebase} from './conditionObjectForFirebase';

export let USERS_COLLECTION_NAME = 'user_profiles';

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
            checkUserProfile(this.firebase.database(), user);

            resolve(
              LoginActions.loginSuccessFactory(user, user._id)
            );
          }, (error) => {
            this.handleError(error);
          }
        );
    })
  }

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
          saveUserProfile(this.firebase.database(), user)
            .then(() => {
              resolve(
                LoginActions.loginSuccessFactory(user, user._id)
              );
            })
            .catch((error) => {
              this.handleError(error);
              reject(error);
            });
          console.info('Create User successful.');
        }
      });
    });
  };

  createTempUser(): Promise<IPayloadAction> {
    throw 'create temp user not yet implemented';
  }

  saveUser(edittedUserObject: IUser): Promise<IPayloadAction> {
    return new Promise((resolve, reject) => {

      saveUserProfile(this.firebase.database(), edittedUserObject)
        .then(() => {
          resolve(
            LoginActions.saveUserResponseFactory(edittedUserObject)
          );
        })
        .catch((error) => {
          this.handleError(error);
          reject(error);
        });
    });
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
    const isAuto = (loginState: ILoginState): boolean => {
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

    this.firebase.auth().onAuthStateChanged((fbuser) => {
      console.log('Log in dectected  - autologin checker');
      const user = transformUser(fbuser);
      console.log(user);
      if (user) {
        checkUserProfile(this.firebase.database(), user);
        subject.next(LoginActions.loginSuccessFactory(
          user,
          user._id,
          isAuto(lastLoginState)
        ));
      }
    });
    return subject;
  }

  watchCurrentUser(): Observable<ILoginActionPayload> {
    let subject = new Subject();

    this.firebase.auth().onAuthStateChanged((fbuser) => {
      console.log('Log in dectected  - current user watcher');
      const user = transformUser(fbuser);

      getUserProfileRef(this.firebase.database(), user)
        .on('value', (snapshot) => {
          const savedProfile:IUser = snapshot.val();

          const newUserInfo = transformUser(fbuser, savedProfile);
          console.log(newUserInfo);
          subject.next(LoginActions.currentUserChangeFactory(newUserInfo))
        });

    });
    return subject;
  }
}

function getUserProfileRef(db: firebase.database.Database, user: IUser) : firebase.database.Reference {
  return db.ref(USERS_COLLECTION_NAME + '/' + user._id);
}

export function saveUserProfile(db: firebase.database.Database, user: IUser): firebase.Promise<any> {
  return getUserProfileRef(db, user)
    .set(
      conditionObjectForFirebase(user)
    );
}

function checkUserProfile(db: firebase.database.Database, user: IUser): firebase.Promise<any> {
  return getUserProfileRef(db, user)
    .once('value', (check) => {
      if (check.val() === null) {
        // Profile does not exist, let's create one
        saveUserProfile(db, user)
          .then(() => {
            console.log('profile created for user');
            console.log(user);
          })
          .catch((error) => {
            console.log('error creating profile')
            console.log(error);
            console.log(user);
          });
      }
    });

}