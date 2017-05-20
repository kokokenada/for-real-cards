import App = firebase.app.App;

import {LoginPackage} from 'common-app';
import {IGameStartService} from '../for-real-cards-lib';
import {getNextSequence} from './counter.model';
import { TopLevelNames } from './top-level-names';

export class GamePlayStartFirebase implements IGameStartService {
  db: firebase.database.Database;

  constructor(private firebase: App) {
    this.db = firebase.database();
  }

  newGame(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      getNextSequence(this.db, TopLevelNames.GAME).then(
        (id) => {

          const gameRef = this.db.ref( TopLevelNames.GAME);
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
    return this._joinGame(gameId, LoginPackage.lastLoginState.userId, password, false);
  }

  loadGame(gameId: string, password: string): Promise<boolean> {
    return this._joinGame(gameId, LoginPackage.lastLoginState.userId, password, true);
  }

  _joinGame(gameId: string, userId: string, password: string, load: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {

        gameKeyFromId(this.db, gameId)
          .then((key: string) => {
            this.db.ref( TopLevelNames.GAME + '/' + key).once('value')
              .then(
                (snapshotGame: firebase.database.DataSnapshot) => {
                  let gameRec = snapshotGame.val();
                  if (!gameRec) {
                    reject('game id ' + gameId + ' key ' + key + ' not found')
                  } else {
                    let handRef = this.db.ref( TopLevelNames.HAND + '/' + gameId + '/');
                    handRef.once('value')
                      .then(
                        (snapshotHands) => {
                          let exists = false;
                          snapshotHands.forEach( (hand) => { // See if joining user already has a hand
                            if ( hand.val().userId === userId)
                              exists = true;
                          } );
                          if ( exists) {
                            resolve(true);
                          } else {
                            if (load) { // this is a check only
                              reject('cannot load gameId:' + gameId + ' user id ' + userId);
                            } else {
                              let position: number = snapshotHands.numChildren();
                              console.debug('adding hand. userID: ' + userId + ", gameId:" + gameId + ", pos:" + position);
                              let newHandRef = handRef.push();
                              newHandRef.set(
                                {
                                  gameId: gameId, 
                                  position: position, 
                                  userId: userId,
                                  dateCreated: (new Date()).getTime()
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
                })
              .catch((error) => {
                reject(error);
              })
          })
          .catch((error) => {
            reject(error)
          });


      }
    )
  }
}

function gameKeyFromId(db: firebase.database.Database, id: string): Promise<string> {
  return new Promise((resolve, reject) => {
    db.ref( TopLevelNames.GAME ).orderByChild('_id').equalTo(id).once('value')
      .then((snapshot: firebase.database.DataSnapshot) => {
        if (snapshot.numChildren()===1)
          resolve(Object.keys( snapshot.val() )[0]);
        else
          reject('system error.  expected id ' + id + ' to only have one child')
      })
      .catch((error) => {
        reject(error);
      })
  });
}

