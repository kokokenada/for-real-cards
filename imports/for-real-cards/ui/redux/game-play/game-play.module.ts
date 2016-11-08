/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
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

  initialize():void {}
}