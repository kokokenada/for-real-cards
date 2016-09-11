/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import {Injectable} from "@angular/core";

import { IAppState, ReduxModule} from '../../../../common-app';
import {gamePlayReducer} from "./game-play.reducer";
import {GamePlayAsync} from "./game-play-async.class";
import {GamePlayActions} from "./game-play-actions.class";

@Injectable()
export class GamePlayModule extends ReduxModule<IAppState>  {
  reducer={name: 'gamePlayReducer', reducer:gamePlayReducer};

  constructor(
    private gamePlayEpics:GamePlayAsync,
    public actions:GamePlayActions
  ) {
    super();
    this.middlewares.push(
      gamePlayEpics.gamePlayMiddleware
    );
  }

  initialize():void {}
}