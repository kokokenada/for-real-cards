import { combineReducers, Reducer, ReducersMapObject } from 'redux';
import {NgRedux} from "ng2-redux";

import {IAppState} from "./state.interface";
import {ReduxModule} from "./redux-module.class";
import { createEpicMiddleware } from 'redux-observable';

export class BaseApp<T> {
  private reducers:ReducersMapObject = {};
  private epics: any[]; // TODO: How to I properly type this?
  private enhancers: any[];
  constructor (
    modules:ReduxModule<T>[],
    private ngRedux: NgRedux<IAppState>
  ) {
    modules.forEach((module:ReduxModule<T>)=> {
      this.reducers = Object.assign(this.reducers, module.reducer);
      module.epics.forEach( (epic)=>{this.epics.push( createEpicMiddleware(epic) )});
      module.enhancers.forEach( (enhancer)=>{this.enhancers.push(enhancer)});
    });
    const rootReducer = combineReducers<IAppState>(this.reducers);

    ngRedux.configureStore(rootReducer, {}, this.epics, this.enhancers);
  }

}