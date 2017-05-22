import {Observable} from 'rxjs';
import {Subject} from 'rxjs/Subject';

import {
  Credentials,
  ILoginActionPayload,
  ILoginService, ILoginState,
  IUser,
  LOGIN_PACKAGE_NAME,
  LoginActions,
  ReduxModuleUtil
} from 'common-app';
import {IPayloadAction, ReduxPackageCombiner,} from 'redux-package';


export class LoginServiceMeteor implements ILoginService {

  login(credentials: Credentials): Promise<IPayloadAction> {
    return new Promise((resolve, reject) => {
      credentials.saveCredentials();
      console.log(Meteor);
      Meteor.loginWithPassword(
        credentials.email ? credentials.email : credentials.username, credentials.password,
        (error) => {
          if (error) {
            console.info(error);
            reject(ReduxModuleUtil.errorFactory(LoginActions.LOGIN_ERROR, error));
          } else {
            console.info('Login successful.');
            resolve(
              LoginActions.loginSuccessFactory(
                this.userFromMeteorUser(Meteor.user()), Meteor.userId(), false
              )
            );
          }
        });

    })
  }

  defaultAvatarUrl(): string { // Move this
    return Meteor.absoluteUrl('default-avatar.png');
  };

  register(credentials: Credentials): Promise<IPayloadAction> {
    return new Promise((resolve, reject) => {
      console.debug("Creating user:" + credentials.username + ", " + credentials.email);
      credentials.saveCredentials();
      Accounts.createUser({
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
        profile: {
          createdOn: new Date()
        }
      }, (error) => {
        if (error) {
          console.error(error);
          reject(ReduxModuleUtil.errorFactory(LoginActions.LOGIN_ERROR, error));
        } else {
          console.info("Register successful.")
          resolve(LoginActions.loginSuccessFactory(
            this.userFromMeteorUser(Meteor.user()), Meteor.userId(), false
          ));
        }
      })
    });
  };

  createTempUser(): Promise<IPayloadAction> {
    return new Promise((resolve, reject) => {
      Meteor.call('CommonGetNextSequence', 'temp_user', (error, result) => {
        if (error) {
          reject(ReduxModuleUtil.errorFactory(LoginActions.LOGIN_ERROR, error));
        } else {
          let userId = 'tmp_' + result.toString();
          let credentials: Credentials = new Credentials(
            userId,
            "",
            Math.random().toString()
          );
          this.register(credentials).then(
            (action) => {
              console.info("Registering tmp user successful.")
              resolve(action);
            }, (error) => {
              reject(ReduxModuleUtil.errorFactory(LoginActions.LOGIN_ERROR, error));
            }
          );
        }
      });
    });
  }

  saveUser(edittedUserObject: IUser): Promise<IPayloadAction> {
    return new Promise((resolve, reject) => {
      console.log("in saveUser execution")
      Meteor.call('commonAppUpdateUser',
        edittedUserObject,
        function (error, numberAffected: number) {
          if (error) {
            console.error(error);
            reject(ReduxModuleUtil.errorFactory(LoginActions.LOGIN_ERROR, error));
          } else {
            if (numberAffected === 1) {
              resolve(LoginActions.saveUserResponseFactory(edittedUserObject));
            } else {
              let errorDescription: string = 'Unexpected number of records affected. (' + numberAffected + ')';
              console.error(errorDescription);
              reject(ReduxModuleUtil.errorFactory(LoginActions.LOGIN_ERROR, error));
            }
          }
        }
      );
    });
  }

  logOut(): Promise<IPayloadAction> {
    return new Promise((resolve, reject) => {
      Meteor.logout((error) => {
        if (error) {
          console.error('Error logging out')
          console.error(error)
          reject(ReduxModuleUtil.errorFactory(LoginActions.LOGIN_ERROR, error));
        } else {
          resolve(LoginActions.loggedOutFactory());
        }
      });
    })
  };

  watchForAutoLogin(): Observable<ILoginActionPayload> {
    const isAuto = ( loginState: ILoginState ): boolean => {
      if (loginState)
        return loginState.userId === null;
      return false;
    };

    let meteorUser = Meteor.user();
    let lastLoginState = null;
    ReduxPackageCombiner
      .select(LOGIN_PACKAGE_NAME)
      .subscribe((loginState: ILoginState) => {
        lastLoginState = loginState;
      });
    if (meteorUser) {
      return Observable.of(LoginActions.loginSuccessFactory(
        this.userFromMeteorUser(meteorUser),
        meteorUser._id,
        isAuto(lastLoginState)
      ));
    }

    let subject = new Subject();
    let timer = Observable.timer(500, 1000);
    let subscription = timer.subscribe(() => {
      let meteorUser = Meteor.user();
      if (meteorUser) {
        subject.next( LoginActions.loginSuccessFactory(
          this.userFromMeteorUser(meteorUser),
          meteorUser._id,
          isAuto(lastLoginState)
        ));
        subject.complete();
        subscription.unsubscribe();
      }
    });
    return subject;
  };

  watchCurrentUser(): Observable<ILoginActionPayload> {
    let subject = new Subject();
    Tracker.autorun( () => {
      let user = Meteor.user();
      console.log(user)
      subject.next( LoginActions.currentUserChangeFactory(this.userFromMeteorUser(user)))
    });
    return subject;
  }

  private userFromMeteorUser(userMeteor: Meteor.User): IUser {
    if (!userMeteor)
      return null;
    let user: IUser = {
      _id: userMeteor._id,
      emails: userMeteor.emails,
      profile: userMeteor.profile,
      services: userMeteor.services,
      username: userMeteor.username,
      roles: userMeteor.roles,
    }
    return user;
  }

}