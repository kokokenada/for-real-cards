import { Injectable } from '@angular/core';

///<reference path='../../../../../node_modules/immutable/dist/immutable.d.ts'/>
import Immutable = require('immutable');

import {combineReducers, Reducer, ReducersMapObject} from 'redux';
import {NgRedux} from "ng2-redux";

import {IAppState} from "./state.interface";
import {ReduxModule} from "./redux-module.class";
import {createEpicMiddleware} from 'redux-observable';
import {IPayloadAction} from "./action.interface";

@Injectable()
export class ReduxModuleCombiner {
  private reducers: ReducersMapObject = {};
  private middlewares: any[] = []; // TODO: How to I properly type this?
  private enhancers: any[] = [];
  public static ngRedux: NgRedux<IAppState>;


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

  configure(modules: ReduxModule<IAppState, IPayloadAction>[],
            ngRedux: NgRedux<IAppState>) {
    ReduxModuleCombiner.ngRedux = ngRedux;
    modules.forEach((module: ReduxModule<IAppState, IPayloadAction>)=> {

      let reducer: ReducersMapObject = {};
      console.log(module.reducer.name)
      if (this.reducers[module.reducer.name]) {
        throw "Two included reducers have the identical name of " + module.reducer.name;
      }
      reducer[module.reducer.name] = module.reducer.reducer;
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
    modules.forEach((module: ReduxModule<IAppState, IPayloadAction>)=> {
      module.initialize();
    })
  }
}