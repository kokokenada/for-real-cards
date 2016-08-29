import { combineReducers, Reducer, ReducersMapObject } from 'redux';
import {NgRedux} from "ng2-redux";

import {IAppState} from "./state.interface";
import {ReduxModule} from "./redux-module.class";
import { createEpicMiddleware } from 'redux-observable';

export class BaseApp<T> {
  private reducers:ReducersMapObject = {};
  private epics: any[] =[]; // TODO: How to I properly type this?
  private enhancers: any[] = [];
  private ngRedux: NgRedux<IAppState>
  constructor (
    modules:ReduxModule<T>[],
    ngRedux: NgRedux<IAppState>
  ) {
    this.ngRedux = ngRedux;
    modules.forEach((module:ReduxModule<T>)=> {

      let reducer:ReducersMapObject = {};
      let stopTypeScriptComplaint:any = module.reducer; // tsc compiler Doesn't like .name (even though it's declared as a function and works just fine...)
      reducer[stopTypeScriptComplaint.name] = module.reducer;
      this.reducers = Object.assign(this.reducers, reducer);
      module.epics.forEach( (epic)=>{this.epics.push( createEpicMiddleware(epic) )});
      module.enhancers.forEach( (enhancer)=>{this.enhancers.push(enhancer)});
    });
    const rootReducer = combineReducers<IAppState>(this.reducers);

    ngRedux.configureStore(rootReducer, {}, this.epics, this.enhancers);
  }

}