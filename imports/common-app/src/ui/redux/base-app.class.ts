import {combineReducers, Reducer, ReducersMapObject} from 'redux';
import {NgRedux} from "ng2-redux";

import {IAppState} from "./state.interface";
import {ReduxModule} from "./redux-module.class";
import {createEpicMiddleware} from 'redux-observable';
import {IPayloadAction, IActionError} from "./action.interface";

export class BaseApp<T> {
  private reducers: ReducersMapObject = {};
  private middlewares: any[] = []; // TODO: How to I properly type this?
  private enhancers: any[] = [];
  private ngRedux: NgRedux<IAppState>;

  /**
   * Logs all actions and states after they are dispatched.
   */
  private logger = store => next => action => {
    console.group(action.type);
    console.info('Logger: dispatching:', action)
    let result = next(action);
    console.log('Logger: next state', store.getState())
    console.groupEnd();
    return result;
  };

  turnOnConsoleLogging() {
    this.middlewares.push(this.logger);
  }

  configure(modules: ReduxModule<T>[],
            ngRedux: NgRedux<IAppState>) {
    this.ngRedux = ngRedux;
    modules.forEach((module: ReduxModule<T>)=> {

      let reducer: ReducersMapObject = {};
      let stopTypeScriptComplaint: any = module.reducer; // tsc compiler Doesn't like .name (even though it's declared as a function and works just fine...)
      reducer[stopTypeScriptComplaint.name] = module.reducer;
      this.reducers = Object.assign(this.reducers, reducer);
      module.epics.forEach((epic)=> {
        this.middlewares.push(createEpicMiddleware(epic))
      });
      module.middlewares.forEach((middleware)=> {
        this.middlewares.push(middleware)
      });
      module.enhancers.forEach((enhancer)=> {
        this.enhancers.push(enhancer)
      });
    });
    const rootReducer = combineReducers<IAppState>(this.reducers);

    ngRedux.configureStore(rootReducer, {}, this.middlewares, this.enhancers);
  }

  static errorFactory(actionType:string, error:IActionError):IPayloadAction {
    return {type: actionType, error: error };
  }
}