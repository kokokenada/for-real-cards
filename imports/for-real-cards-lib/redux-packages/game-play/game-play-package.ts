
import {gamePlayReducer} from "./game-play.reducer";
import {GamePlayAsync} from "./game-play-async";
import {GamePlayActions} from "./game-play-actions";
import {ReduxPackage, IAppState, IPayloadAction} from 'redux-package';
import {IGamePlayService} from './game-play-service-interface';

export let GAME_PLAY_PACKAGE_NAME = 'game-play';

export class GamePlayPackage extends ReduxPackage<IAppState, IPayloadAction>  {
  reducers=[{name: GAME_PLAY_PACKAGE_NAME, reducer:gamePlayReducer}];
  actions = GamePlayActions;
  constructor(service: IGamePlayService)
  {
    super();
    const gamePlayAsync = new GamePlayAsync(service);
    this.middlewares.push(
      gamePlayAsync.gamePlayMiddleware
    );
  }
}