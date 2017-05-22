
import {gameStartReducer} from "./game-start.reducer";
import {GameStartActions} from "./game-start-actions";
import { ReduxPackage, IAppState, IPayloadAction} from 'redux-package';
import {IGameStartService} from './game-start-service-interface';
import {GameStartAsync} from './game-start-async';
export let GAME_START_PACKAGE_NAME = 'game-start';

export class GameStartPackage extends ReduxPackage<IAppState, IPayloadAction>  {
  constructor(private service:IGameStartService) {
    super();
    const async = new GameStartAsync(this.service);
    this.middlewares.push(
      async.gameNavigationMiddleware
    );
  }
  reducers=[
    {name: GAME_START_PACKAGE_NAME, reducer:gameStartReducer},
  ];
  action = GameStartActions;

  initialize():void {

  }
}