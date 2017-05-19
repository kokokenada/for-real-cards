import {Observable} from 'rxjs/Observable';

import {GamePlayAction, GamePlayActions, HandInterface, IGamePlayActionPayload, IGamePlayService } from '../for-real-cards-lib';

import {GAME_SUBSCRIPTION_NAME, GameSubscriptionOptions } from './game.publications';
import {EDocumentChangeType, IDocumentChange} from 'common-app';
import {BatchAndWatch, MeteorCursorObservers} from '../common-app-meteor';
import {GamePlayActionCollection} from './action.model';
import {HandCollection} from './hand.model';

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

  watchGamePlayActionsAndHand(gameId: string): void {
    Tracker.autorun(()=> {
      console.log('watchGamePlayActionsAndHand')
      console.log(gameId)
      let subscriptionHandle = runSubscription(gameId);

      let isReady = subscriptionHandle.ready();
      if (!isReady) {
        console.log('not ready')
      } else {
        let knownHands: HandInterface[] = [];
        let buffer: GamePlayAction[] = [];
        let handsCursor: Mongo.Cursor<any> = HandCollection.find({gameId: gameId}, {sort: {dateCreated: 1}});
        let hands$: Observable<IDocumentChange<HandInterface>> = MeteorCursorObservers.fromMeteorCursor<HandInterface>(handsCursor);
        hands$.subscribe(
          (handChange: IDocumentChange<HandInterface>) => {
            switch (handChange.changeType) {
              case EDocumentChangeType.NEW: {
                 console.log('Hand Collection change. gameId=' + gameId)
                GamePlayActions.newHand(gameId, handChange.newDocument);
                knownHands.push(handChange.newDocument);
                console.log(knownHands);
                console.log(buffer);
                if (isBufferReady(knownHands, buffer)) {
                  GamePlayActions.receiveActions(buffer);
                  buffer = [];
                }
                subscriptionHandle = runSubscription(gameId); // Rerun subscription so users gets refreshed (reactive join issue)
                break;
              }
              default: // TODO: handle user leaving
//              console.log('handChange - not sure if it matters');
//              console.log(handChange);
            }
          }
        );
      console.log('execute action query. gameId:' + gameId);
        let actionCursor: Mongo.Cursor<any> = GamePlayActionCollection.find({gameId: gameId}, {sort: {dateCreated: 1}});

        let gameActions$: Observable<IDocumentChange<GamePlayAction>> = MeteorCursorObservers.fromMeteorCursor<GamePlayAction>(actionCursor);
        let batchAndWatch: BatchAndWatch<IDocumentChange<GamePlayAction>> = MeteorCursorObservers.batchAndWatch(gameActions$);
        batchAndWatch.batchObservable.subscribe((gamePlayActionChanges: IDocumentChange<GamePlayAction>[]) => {
          gamePlayActionChanges.forEach((gamePlayActionChange: IDocumentChange<GamePlayAction>) => {
            console.log('batchAndWACTH 1 ')
            console.log(gamePlayActionChange)
            switch (gamePlayActionChange.changeType) {
              case EDocumentChangeType.NEW: {
                buffer.push(gamePlayActionChange.newDocument);
                break;
              }
              default:
                GamePlayActions.error('only expecting new game state records')
            }

          });
          if (isBufferReady(knownHands, buffer)) {
            console.log('batchAndWatch 3 ')
            console.log(knownHands)
            console.log(buffer)
            GamePlayActions.receiveActions(buffer);
            buffer = [];
          }
        });
        batchAndWatch.watchedObservable.subscribe(
          (gamePlayActionChange: IDocumentChange<GamePlayAction>) => {
            console.log('batchAndWACTH 2')
            console.log(gamePlayActionChange)
            switch (gamePlayActionChange.changeType) {
              case EDocumentChangeType.NEW: {
                let action: GamePlayAction = gamePlayActionChange.newDocument;

                // If the hand is not read yet, defer.  There is probably a more streamy way (Observable.bufferWhen???)
                if (isHandReady(knownHands, action)) {
                  GamePlayActions.receiveAction(action);
                } else {
                  buffer.push(action);
                }
                break;
              }
              default:
                GamePlayActions.error('only expecting new game state records')
            }
          }
        );
      }
    })
  }

}

/**
 * Check to see if action is ready, where ready means the hands it references are present
 * @param hands
 * @param action
 * @returns {boolean}
 */
function isHandReady(hands:HandInterface[], action:GamePlayAction):boolean {
  if (action.toPlayerId && hands.findIndex( hand => hand.userId===action.toPlayerId ) === -1)
    return false;
  if (action.fromPlayerId && hands.findIndex( hand => hand.userId===action.fromPlayerId ) === -1 )
    return false;
  return true;
}

function isBufferReady(knownHands:HandInterface[], buffer:GamePlayAction[]):boolean {
  let wholeBufferReady = true;
  for (let i = 0; i<buffer.length; i++) { // Flush the whole buffer only, to avoid order of processing glitches
    let bufferedAction = buffer[i];
    if (!isHandReady(knownHands, bufferedAction)) {
      wholeBufferReady = false;
      break;
    }
  }
  return wholeBufferReady;
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

