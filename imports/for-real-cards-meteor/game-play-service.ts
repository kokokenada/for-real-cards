import {Observable} from 'rxjs/Observable';

import {GamePlayAction, GamePlayActions, HandInterface, IGamePlayActionPayload, IGamePlayService } from '../for-real-cards-lib';

import { GAME_SUBSCRIPTION_NAME, GameSubscriptionOptions } from './game.publications';
import { BatchAndWatch, batchAndWatch, EDocumentChangeType, IDocumentChange } from 'common-app';
import { MeteorCursorObservers } from '../common-app-meteor';
import { GamePlayActionCollection } from './action.model';
import { HandCollection } from './hand.model';

export class GamePlayServiceMeteor implements IGamePlayService {
  actionPush(action: IGamePlayActionPayload): Promise<boolean> {
    console.log('actionPush')
    console.log(action)
    return new Promise((resolve, reject) => {
      Meteor.call('fastcards.NewAction', action, (error)=> {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          resolve(true)
        }
      });

    });
  }

  actionArrayPush(actions: IGamePlayActionPayload[]): Promise<boolean> {
    console.log('actionArrayPush')
    console.log(actions)
    return new Promise((resolve, reject) => {
      Meteor.call('fastcards.NewActions', actions, (error)=> {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          resolve(true);
        }
      });

    });
  }
  watchHands(gameId: string): Promise<Observable<IDocumentChange<HandInterface>>> {
    return new Promise( (resolve, reject) => {
      let handsCursor: Mongo.Cursor<any> = HandCollection.find({gameId: gameId}, {sort: {dateCreated: 1}});
      let hands$: Observable<IDocumentChange<HandInterface>> = MeteorCursorObservers.fromMeteorCursor<HandInterface>(handsCursor);
      resolve(hands$);
    } );
  }

  watchGameActions(gameId: string): Promise<Observable<IDocumentChange<HandInterface>>> {
    return new Promise( (resolve, reject) => {
      let actionCursor: Mongo.Cursor<any> = GamePlayActionCollection.find({gameId: gameId}, {sort: {dateCreated: 1}});
      let gameActions$: Observable<IDocumentChange<GamePlayAction>> = MeteorCursorObservers.fromMeteorCursor<GamePlayAction>(actionCursor);
      resolve(gameActions$);
    });
  }
  startSubscriptions(gameId) {
    let subscriptionHandle = runSubscription(gameId);
    let isReady = subscriptionHandle.ready();
    if (!isReady) {
      console.log('not ready')
    }
  }

//  watchGamePlayActionsAndHand(gameId: string): void {
//    Tracker.autorun(()=> {
}

function runSubscription(gameId:string) {
  let options: GameSubscriptionOptions = {gameId: gameId};
  return Meteor.subscribe(GAME_SUBSCRIPTION_NAME, options, {
    onStop: (error) => {
      if (error) {
        log.error("Error returned from Meteor.subscribe");
        log.error(error);
        GamePlayActions.error(error);
      }
    },
    onReady: ()=> {

    }
  });
}

