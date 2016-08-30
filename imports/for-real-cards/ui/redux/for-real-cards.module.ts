import {Injectable} from "@angular/core";

import { IAppState, ReduxModule} from '../../../common-app';
import {forRealCardsReducer} from "./for-real-cards.reducer";
import {ForRealCardsAsync} from "./for-real-cards-async.class";
import {ForRealCardsActions} from "./for-real-cards-actions.class";

@Injectable()
export class ForRealCardsModule extends ReduxModule<IAppState>  {
  reducer=forRealCardsReducer;

  constructor(
    private forRealCardsEpics:ForRealCardsAsync,
    public actions:ForRealCardsActions
  ) {
    super();
//    this.epics.push(forRealCardsEpics.loginNavigation);
  }
}