import {Injectable} from "@angular/core";

import {gamePlayReducer} from "./game-play.reducer";
import {GamePlayAsync} from "./game-play-async.class";
import {GamePlayActions} from "./game-play-actions.class";
import {ReduxModule} from "../../../../common-app/src/ui/redux/redux-module.class";
import {IAppState} from "../../../../common-app/src/ui/redux/state.interface";
import {IPayloadAction} from "../../../../common-app/src/ui/redux/action.interface";

@Injectable()
export class GamePlayModule extends ReduxModule<IAppState, IPayloadAction>  {
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