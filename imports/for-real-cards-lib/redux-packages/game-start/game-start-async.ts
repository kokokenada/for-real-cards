import { IException } from 'common-app';
import { IGameStartState } from "./game-start-state-interface";
import { IGameStartActionPayload } from "./game-start-payload-interface";
import { GameStartActions } from "./game-start-actions";
import { GamePlayActions } from "../game-play";
import { IPayloadAction } from 'redux-package';
import { IGameStartService } from './game-play-service-interface';



export class GameStartAsync {
  constructor(private service:IGameStartService) {
  }
  gameNavigationMiddleware = (state: IGameStartState) => next => (action: IPayloadAction) => {
    let payload: IGameStartActionPayload = action.payload;
    switch (action.type) {
      case GameStartActions.START_NEW_GAME_REQUEST:
        this.service.newGame(payload.password).then( (gameId: string)=> {
          GamePlayActions.initialize(gameId);
          GameStartActions.joinGameSuccess(gameId);
        }, (error)=>{
          GameStartActions.error(error);
        } );
        break;
      case GameStartActions.JOIN_GAME_REQUEST:
        this.service.joinGame(payload.gameId, payload.password).then(
          (success)=>{
            GamePlayActions.initialize(payload.gameId);
            GameStartActions.joinGameSuccess(payload.gameId);
          },
          (error)=>{
            if (error.error === "gameId-not-found") {
              let specificError:IException = {
                code:'gameId-not-found',
                message: "That game ID does not exist. Game Id=" + payload.gameId
              };
              GameStartActions.error(specificError);
            } else {
              GameStartActions.error(error);
            }
          }
        );
        break;
      case GameStartActions.VIEW_GAME_REQUEST: // Fallthrough
      case GameStartActions.LOAD_GAME_REQUEST:
        this.service.loadGame(payload.gameId, payload.password).then(
          (result)=>{
            GamePlayActions.initialize(payload.gameId);
            if (action.type===GameStartActions.VIEW_GAME_REQUEST)
              GameStartActions.viewGameSuccess(payload.gameId);
            else
              GameStartActions.loadGameSuccess(payload.gameId);
          },
          (error)=>{
            GameStartActions.error(error);
          }
        );
        break;
    }
    return next(action);
  };
}
