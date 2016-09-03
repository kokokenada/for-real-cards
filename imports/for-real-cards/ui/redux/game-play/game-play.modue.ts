import {Injectable} from "@angular/core";

import { IAppState, ReduxModule} from '../../../../common-app';
import {gamePlayReducer} from "./game-play.reducer";
import {GamePlayAsync} from "./game-play-async.class";
import {GamePlayActions} from "./game-play-actions.class";

@Injectable()
export class GamePlayModule extends ReduxModule<IAppState>  {
  reducer=gamePlayReducer;

  constructor(
    private forRealCardsEpics:GamePlayAsync,
    public actions:GamePlayActions
  ) {
    super();
//    this.epics.push(forRealCardsEpics.loginNavigation);
  }

  initialize():void {}
}