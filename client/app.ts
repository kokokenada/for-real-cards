/**
 * Created by kenono on 2016-05-24.
 */
import 'reflect-metadata';
import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import {ForRealCardsTopFrame} from "../imports/for-real-cards"; (ForRealCardsTopFrame)

@Component({
  selector: 'app',
  template: '<for-real-cards-top-frame></for-real-cards-top-frame>'
})
class ForRealCards { }

bootstrap(ForRealCards);
