/**
 * Created by kenono on 2016-05-24.
 */
import 'reflect-metadata';
import 'zone.js/dist/zone';
import { Component, provide } from '@angular/core';
import { ROUTER_PROVIDERS } from '@angular/router';
import { LocationStrategy, HashLocationStrategy, APP_BASE_HREF } from '@angular/common';
import { bootstrap } from '@angular/platform-browser-dynamic';

import {ForRealCardsTopFrame} from "../imports/for-real-cards";

bootstrap(ForRealCardsTopFrame,
    [
      provide(APP_BASE_HREF, { useValue: '/' }),
      ROUTER_PROVIDERS,
      provide(LocationStrategy,
        {useClass: HashLocationStrategy})
    ]
);
