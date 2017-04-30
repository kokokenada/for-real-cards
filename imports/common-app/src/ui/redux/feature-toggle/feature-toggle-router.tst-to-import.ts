import 'reflect-metadata';
import 'zone.js';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/proxy';
import * as chai from "chai";
import * as spies from 'chai-spies';
import { Observable } from 'rxjs';
import { NgRedux } from '@angular-redux/store';
import { FeatureToggleActions } from './feature-toggle.actions';
import { ToggleRouter } from './feature-toggle-router';
import { NgZone } from '@angular/core';

import { TestBed } from '@angular/core/testing';
import {ReduxPackageCombiner} from "redux-package";
import {FeatureToggleModule} from "./feature-toggle.module";

class MockNgZone {
  run(fn) {
    return fn();
  }
}
describe('toggle router', () => {
  describe('getStateFromConfig(config)', () => {
    it('returns the toggles state from a config object', () => {
      const configs = {
        'feature1': {setting: false},
        'feature2': {setting: true},
        'cta': {setting: 'contact'}
      };

      const state = ToggleRouter.getStateFromConfig(configs);

      chai.expect(state).to.deep.equal({
        'feature1': false,
        'feature2': true,
        'cta': 'contact'
      });
    });
  });

  describe('router operations', () => {
    let ngRedux;
    let toggleSetting$: Observable<any>;
    let toggleRouter: ToggleRouter;
    const watched = (newValue) => {};
    chai.use(spies);
    const spy = chai.spy(watched);
    beforeEach(() => {
      ngRedux = new NgRedux(new MockNgZone() as NgZone);
      let featureToggleActions: FeatureToggleActions = new FeatureToggleActions();
      let featureToggleModule: FeatureToggleModule = new FeatureToggleModule();
      toggleRouter = new ToggleRouter(ngRedux, featureToggleActions);
      TestBed.configureTestingModule({
        providers: [
          {provide: NgRedux, useValue: ngRedux},
          {provide: FeatureToggleActions, useValue: featureToggleActions},
          {provide: ToggleRouter, useValue: toggleRouter},
          {provide: FeatureToggleModule, useValue: featureToggleModule}
        ],
      });

      ReduxPackageCombiner.configure([featureToggleModule], ngRedux);

      const configs = {
        'cta': {setting: 'contact'}
      };
      featureToggleActions.initialize(configs);

      toggleSetting$ = toggleRouter.watch('cta');
      toggleSetting$.subscribe((newValue) => {
        spy(newValue);
      });

      toggleRouter.setFeatureState({cta: 'value'});

    });

    it('should return the value that was set', () => {
      chai.expect(toggleRouter.getFeatureState('cta')).to.be.equal('value');
    });

    it('watcher should be called', () => {
      chai.expect(spy).to.have.been.called.with('value');
    });


    it('should throw when setting a toggle not defined in config', () => {
      const wrap = () => {
        toggleRouter.setFeatureState({notThere: 'value'});
      };
      chai.expect(wrap).to.throw();
    });
  });

});
