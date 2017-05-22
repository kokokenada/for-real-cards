import {GamePlayActions} from "./game-play-actions";
import {IGamePlayState} from "./game-play-state";
import {IGamePlayActionPayload} from "./game-play-payload-interface";
import {IPayloadAction} from 'redux-package';
import {IGamePlayService} from './game-play-service-interface';
import {GamePlayAction} from './action.class';
import {HandInterface} from './hand.class';
import {BatchAndWatch, batchAndWatch, EDocumentChangeType, IDocumentChange} from 'common-app';
import {CardEncoder} from './card-encoder';


export class GamePlayAsync {
  constructor(private service: IGamePlayService) {
  }

  gamePlayMiddleware = (gameState: IGamePlayState) => next => (action: IPayloadAction) => {
    let payload: IGamePlayActionPayload = action.payload;
    switch (action.type) {
      case GamePlayActions.GAME_PLAY_ACTION_PUSH:
        this.service.actionPush(payload.gamePlayAction).then(() => {
        }, (error) => {
          GamePlayActions.error(error);
        });
        break;
      case GamePlayActions.GAME_PLAY_ACTIONSSS_PUSH:
        this.service.actionArrayPush(payload.gamePlayActions).then(() => {
        }, (error) => {
          GamePlayActions.error(error);
        });
        break;
      case GamePlayActions.GAME_PLAY_INITIALIZE:
        this.watchGamePlayActionsAndHand(payload.gameId);
        break;
    }
    return next(action);
  };


  watchGamePlayActionsAndHand(gameId: string): void {
    console.log('watchGamePlayActionsAndHand')
    console.log(gameId)
    this.service.startSubscriptions(gameId);

    let knownHands: HandInterface[] = [];
    let buffer: GamePlayAction[] = [];
    this.service.watchHands(gameId)
      .then((hands$) => {
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
                this.service.startSubscriptions(gameId); // Rerun subscription so users gets refreshed (reactive join issue  in Meteor)
                break;
              }
              default: // TODO: handle user leaving
            }
          }
        );
      })
      .catch((error) => {
        GamePlayActions.error(error);
      });

    console.log('execute action query. gameId:' + gameId);


    this.service.watchGameActions(gameId)
      .then((gameActions$) => {
        let watched: BatchAndWatch<IDocumentChange<GamePlayAction>> = <any>batchAndWatch(gameActions$, window.setTimeout);
        watched.batchObservable.subscribe((gamePlayActionChanges: IDocumentChange<GamePlayAction>[]) => {
          gamePlayActionChanges.forEach((gamePlayActionChange: IDocumentChange<GamePlayAction>) => {
            console.log('batchAndWACTH 1 ')
            console.log(gamePlayActionChange)
            switch (gamePlayActionChange.changeType) {
              case EDocumentChangeType.NEW: {
                buffer.push(CardEncoder.decode(gamePlayActionChange.newDocument));
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
            if (buffer.length > 0) {
              GamePlayActions.receiveActions(buffer);
              buffer = [];
            }
          }
        });
        watched.watchedObservable.subscribe(
          (gamePlayActionChange: IDocumentChange<GamePlayAction>) => {
            console.log('batchAndWACTH 2')
            console.log(gamePlayActionChange)
            switch (gamePlayActionChange.changeType) {
              case EDocumentChangeType.NEW: {
                let action: GamePlayAction = gamePlayActionChange.newDocument;

                // If the hand is not read yet, defer.  There is probably a more streamy way (Observable.bufferWhen???)
                if (isHandReady(knownHands, action)) {
                  GamePlayActions.receiveAction(CardEncoder.decode(action));
                } else {
                  buffer.push(CardEncoder.decode(action));
                }
                break;
              }
              default:
                GamePlayActions.error('only expecting new game state records')
            }
          }
        );
      })
      .catch((error) => {
        GamePlayActions.error(error);
      });
  }
}


/**
 * Check to see if action is ready, where ready means the hands it references are present
 * @param hands
 * @param action
 * @returns {boolean}
 */
function isHandReady(hands: HandInterface[], action: GamePlayAction): boolean {
  if (action.toPlayerId && hands.findIndex(hand => hand.userId === action.toPlayerId) === -1)
    return false;
  if (action.fromPlayerId && hands.findIndex(hand => hand.userId === action.fromPlayerId) === -1)
    return false;
  return true;
}

function isBufferReady(knownHands: HandInterface[], buffer: GamePlayAction[]): boolean {
  let wholeBufferReady = true;
  for (let i = 0; i < buffer.length; i++) { // Flush the whole buffer only, to avoid order of processing glitches
    let bufferedAction = buffer[i];
    if (!isHandReady(knownHands, bufferedAction)) {
      wholeBufferReady = false;
      break;
    }
  }
  return wholeBufferReady;
}
