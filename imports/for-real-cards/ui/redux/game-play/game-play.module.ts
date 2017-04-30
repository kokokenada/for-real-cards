import {Injectable} from "@angular/core";

import {gamePlayReducer} from "./game-play.reducer";
import {GamePlayAsync} from "./game-play-async.class";
import {GamePlayActions} from "./game-play-actions.class";
import {ReduxPackage, IAppState, IPayloadAction} from 'redux-package';

@Injectable()
export class GamePlayModule extends ReduxPackage<IAppState, IPayloadAction>  {
  reducers=[{name: 'gamePlayReducer', reducer:gamePlayReducer}];
  actions = GamePlayActions;
  constructor(
    private gamePlayEpics:GamePlayAsync,
  ) {
    super();
    this.middlewares.push(
      gamePlayEpics.gamePlayMiddleware
    );
  }
}