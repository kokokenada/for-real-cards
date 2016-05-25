/**
 * Created by kenono on 2016-05-24.
 */
import 'reflect-metadata';
import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';

@Component({
  selector: 'app',
  templateUrl: 'client/app.html'
})
class ForRealCards { }

bootstrap(ForRealCards);
