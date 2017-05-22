import {IUser, Tools} from 'common-app';

export function transformUser(firebaseUser: firebase.User, currentValues:IUser = null): IUser {
  let retVal: IUser;
  const core: IUser = {
    _id: firebaseUser.uid,
    username: null,
    emails: [{address: firebaseUser.email, verified: firebaseUser.emailVerified}],
    profile: {},
    roles: []
  };
  if (currentValues) {
    retVal = Tools.deepCopy(currentValues);
    const firebaseEmail = firebaseUser.email;
    retVal._id = core._id;
    if (!(retVal.emails.find( (email) => email.address===firebaseEmail))) {
      retVal.emails.push({address: firebaseEmail, verified: firebaseUser.emailVerified})
    }
  } else {
    retVal = core;
    retVal.profile['avatar-original'] = firebaseUser.photoURL;
    retVal.profile.name = firebaseUser.displayName;
  }
  return retVal;
}