import App = firebase.app.App;

import {EDocumentChangeType, IDocumentChange, IUser, LoginPackage} from 'common-app';
import {IGameStartService, HandInterface} from '../for-real-cards-lib';
import {getNextSequence} from './counter.model';
import {TopLevelNames} from './top-level-names';
import {USERS_COLLECTION_NAME} from '../common-app-firebase/login-service-firebase';
import {fromFireBaseOn} from '../common-app-firebase/fromFireBaseOn';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

export class GamePlayStartFirebase implements IGameStartService {
  db: firebase.database.Database;

  constructor(private firebase: App) {
    this.db = firebase.database();
  }

  newGame(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      getNextSequence(this.db, TopLevelNames.GAME).then(
        (id) => {

          const gameRef = this.db.ref(TopLevelNames.GAME);
          const newGameRef = gameRef.push();
          newGameRef.set({
            _id: id,
            creatorId: LoginPackage.lastLoginState.userId,
//          password: password  TODO: Add password support
            dateCreated: (new Date()).getTime()
          }).then(
            () => {
              this._joinGame(id, LoginPackage.lastLoginState.userId, password, false)
                .then(() => {
                  resolve(id)
                })
                .catch((error) => {
                  reject(error)
                });
            }
          ).catch(
            (error) => {
              reject(error)
            }
          )
        }
      ).catch(
        (error) => {
          reject(error)
        }
      );
    });
  }

  joinGame(gameId: string, password: string): Promise<boolean> {
    console.log('join game')
    console.log(LoginPackage.lastLoginState.userId)
    return this._joinGame(gameId, LoginPackage.lastLoginState.userId, password, false);
  }

  loadGame(gameId: string, password: string): Promise<boolean> {
    return this._joinGame(gameId, LoginPackage.lastLoginState.userId, password, true);
  }

  private _joinGame(gameId: string, userId: string, password: string, load: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
        GamePlayStartFirebase.getHandsSnaphot(this.db, gameId)
          .then(
            (snapshotHands) => {
              if (GamePlayStartFirebase.doesUserExist(snapshotHands, userId)) {
                resolve(true);
              } else {
                if (load) { // this is a check only
                  reject('cannot load gameId:' + gameId + ' user id ' + userId);
                } else {
                  let position: number = snapshotHands.numChildren();
                  console.debug('adding hand. userID: ' + userId + ", gameId:" + gameId + ", pos:" + position);
                  let newHandRef = GamePlayStartFirebase.getHandsRef(this.db, gameId).push();
                  newHandRef.set(
                    {
                      gameId: gameId,
                      position: position,
                      userId: userId,
                      dateCreated: (new Date()).getTime(),
                      _id: newHandRef.key
                    }
                  ).then(
                    () => {
                      resolve(true)
                    }
                  ).catch((error) => {
                    reject(error);
                  });
                }
              }
            }
          )
          .catch((error) => {
            reject(error);
          });
      }
    )
  }

  static gameKeyFromId(db: firebase.database.Database, id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      db.ref(TopLevelNames.GAME).orderByChild('_id').equalTo(id).once('value')
        .then((snapshot: firebase.database.DataSnapshot) => {
          if (snapshot.numChildren() === 1)
            resolve(Object.keys(snapshot.val())[0]);
          else
            reject('system error.  expected id ' + id + ' to only have one child')
        })
        .catch((error) => {
          reject(error);
        })
    });
  }

  static getHandsRef(db: firebase.database.Database, gameId: string): firebase.database.Reference {
    return db.ref(TopLevelNames.HAND + '/' + gameId + '/');
  }

  static getHandsSnaphot(db: firebase.database.Database, gameId: string): Promise<firebase.database.DataSnapshot> {
    return new Promise((resolve, reject) => {
      console.log('getHandsSnaphot')
      console.log(gameId)
      let handRef = db.ref(TopLevelNames.HAND + '/' + gameId + '/');
      handRef.once('value')
        .then((snapshotHands) => {
            resolve(snapshotHands);
          }
        )
        .catch((error) => {
          reject(error);
        });
    });
  }

  static getHandsRefOLD(db: firebase.database.Database, gameId: string): Promise<[firebase.database.DataSnapshot, firebase.database.Reference]> {
    return new Promise((resolve, reject) => {
      GamePlayStartFirebase.gameKeyFromId(db, gameId)
        .then((key: string) => {
          db.ref(TopLevelNames.GAME + '/' + key).once('value')
            .then((snapshotGame: firebase.database.DataSnapshot) => {
              if (snapshotGame.numChildren() === 0) { // integrity check
                reject('game id ' + gameId + ' key ' + key + ' not found')
              } else {
                let handRef = db.ref(TopLevelNames.HAND + '/' + gameId + '/');
                handRef.once('value')
                  .then((snapshotHands) => {
                      resolve([snapshotHands, handRef]);
                    }
                  )
                  .catch((error) => {
                    reject(error);
                  });
              }
            })
            .catch((error) => {
              reject(error);
            })
        })
        .catch((error) => {
          reject(error)
        });

    });
  }

  static doesUserExist(snapshotHands: firebase.database.DataSnapshot, userId: string): boolean {
    let exists = false;
    snapshotHands.forEach((hand: any) => { // See if joining user already has a hand
      if (hand.val().userId === userId)
        exists = true;
      return undefined;
    });
    return exists;
  }

  watchRelatedUsers(gameId: string): Promise<Observable<IDocumentChange<IUser>>> {
    return new Promise((resolve, reject) => {
      let handRef = GamePlayStartFirebase.getHandsRef(this.db, gameId);
      const subject = new Subject();
      const watchedUsers = {};

      fromFireBaseOn(handRef)
        .subscribe((handChange: IDocumentChange<HandInterface>) => {
          switch (handChange.changeType) {
            case EDocumentChangeType.CHANGED:
            case EDocumentChangeType.NEW: {
              const userId = handChange.newDocument.userId;
              // Are we watching?
              if (!watchedUsers[userId]) {
                // Not watching, so start watching
                const ref = this.db.ref(USERS_COLLECTION_NAME + '/' + userId);
                ref.on('value', (snapshortUser) => {
                  const user: IUser = snapshortUser.val();
                  console.log('emitting user change if truthy')
                  console.log(user);
                  if (user) {
                    const userChange: IDocumentChange<IUser> = {
                      changeType: EDocumentChangeType.CHANGED,
                      newDocument: user
                    };
                    subject.next(userChange);
                  }
                });
                watchedUsers[userId] = ref;
              }
            }
          }
        });


      resolve(subject)


    });
  }

}


