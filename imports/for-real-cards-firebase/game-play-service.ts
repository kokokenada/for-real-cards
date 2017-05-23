import App = firebase.app.App;

import {Observable} from 'rxjs/Observable';

import {
  GamePlayAction,
  HandInterface,
  IGamePlayService
} from '../for-real-cards-lib';

import {IDocumentChange, LoginPackage} from 'common-app';
import {fromFireBaseOn} from '../common-app-firebase';
import {TopLevelNames} from './top-level-names';
import {CardEncoder} from '../for-real-cards-lib/redux-packages/game-play/card-encoder';
import {GamePlayStartFirebase} from './game-start-service';
import {GamePlayActionInterface} from '../for-real-cards-lib/redux-packages/game-play/action.class';
import {conditionObjectForFirebase} from '../common-app-firebase/conditionObjectForFirebase';

export class GamePlayServiceFirebase implements IGamePlayService {
  db: firebase.database.Database;

  constructor(private firebase: App) {
    this.db = firebase.database();
  }


  private  checkUser(gameId: string, userId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      GamePlayStartFirebase.getHandsSnaphot(this.db, gameId).then(
        (snapshotHands) => {
          if (GamePlayStartFirebase.doesUserExist(snapshotHands, userId))
            resolve(true);
          else
            reject('gameId "' + gameId + '" was not found for current user ' + userId + "'")
        }
      )
    });
  }

  private _addAction(action: GamePlayAction): Promise<string> {
    return new Promise((resolve, reject) => {
      const actionRef = this.db.ref(TopLevelNames.ACTION + '/' + action.gameId);
      const newActionRef = actionRef.push();
      this.checkUser(action.gameId, action.creatorId);
      action.cardsEncoded = CardEncoder.encodeCards(action.cards);

      if (action.gameConfig) {
        action.gameConfig._deck_id = action.gameConfig.deck.id;
      }
      action.creatorId = LoginPackage.lastLoginState.userId;
      action._id = newActionRef.key; // Makes it like Mongo & some parts of app read _id
      let actionSave: any = conditionObjectForFirebase(action);
      actionSave.dateCreated = (new Date()).getTime();
      newActionRef.set(actionSave)
        .then(() => {
          resolve(newActionRef.key)
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  actionPush(action: GamePlayActionInterface): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._addAction(action)
        .then(() => {
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        });
    });
  }

  actionArrayPush(actions: GamePlayActionInterface[]): Promise<boolean> {
    return new Promise((resolve, reject) => {

      let action: GamePlayAction = actions[0];
      this._addAction(action)
        .then((groupId) => {
          let error = false;
          for (let i = 1; i < actions.length; i++) {
            action = actions[i];
            action.relatedActionId = groupId;
            this._addAction(action)
              .then()
              .catch((error) => {
                error = true;
                reject(error);
              });
            if (error)
              break;
          }
          if (!error) {
            resolve(true);
          }
        })
        .catch((error) => {
          reject(error)
        });

    })
  }

  watchHands(gameId: string): Promise<Observable<IDocumentChange<HandInterface>>> {
    return new Promise((resolve, reject) => {
      resolve(fromFireBaseOn(GamePlayStartFirebase.getHandsRef(this.db, gameId)))
    });
  }

  watchGameActions(gameId: string): Promise<Observable<IDocumentChange<HandInterface>>> {
    return new Promise((resolve, reject) => {
      resolve(fromFireBaseOn(
        this.db.ref(TopLevelNames.ACTION + '/' + gameId + '/')
        )
      );
    });
  }

  /*  watchGameActions(gameId: string): Promise<Observable<IDocumentChange<GamePlayAction>>> {
   return new Promise((resolve, reject) => {
   GamePlayStartFirebase.getHandsRef(this.db, gameId)
   .then(([snapshotHands, handRef]) => {
   resolve(fromFireBaseOn(handRef))
   })
   .catch((error) => {
   reject(error)
   });

   });
   }
   */

  startSubscriptions(gameId) { // Not needed
  }
}

