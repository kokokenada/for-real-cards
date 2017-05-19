
import {GamePlayActions} from "./game-play-actions";
import { IGamePlayState } from "./game-play-state";
import { IGamePlayActionPayload } from "./game-play-payload-interface";
import {IPayloadAction} from 'redux-package';
import {IGamePlayService} from './game-play-service-interface';


export class GamePlayAsync {
  constructor(private service: IGamePlayService) {

  }
  gamePlayMiddleware = (gameState: IGamePlayState) => next => (action: IPayloadAction) => {
    let payload: IGamePlayActionPayload = action.payload;
    switch (action.type) {
      case GamePlayActions.GAME_PLAY_ACTION_PUSH:
        this.service.actionPush(payload.gamePlayAction).then(()=>{}, (error) => {
          GamePlayActions.error(error);
        } );
        break;
      case GamePlayActions.GAME_PLAY_ACTIONSSS_PUSH:
        this.service.actionArrayPush(payload.gamePlayActions).then( ()=>{}, (error) => {
          GamePlayActions.error(error);
        });
        break;
      case GamePlayActions.GAME_PLAY_INITIALIZE:
        this.service.watchGamePlayActionsAndHand(payload.gameId);
        break;
    }
    return next(action);
  };
}
