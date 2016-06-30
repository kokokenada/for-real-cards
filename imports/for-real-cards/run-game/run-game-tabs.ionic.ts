/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Component, NgZone, Type } from '@angular/core';

import { RunGameHandAndTable } from "./run-game-hand-and-table";
import { RunGameHand } from "./run-game-hand";
import { RunGameTable } from "./run-game-table";
import { RunGameContainer } from "./run-game-container";

@Component(
  {
    selector: 'run-game-tabs',
    directives: [RunGameHandAndTable, RunGameHand, RunGameTable],
    template: `
<ion-header>
  <ion-navbar *navbar>
    <button menuToggle>
       <ion-icon name='menu'></ion-icon>
    </button>
    <ion-title>
      Game ID !!!
    </ion-title>
  </ion-navbar>
</ion-header>
  <ion-tabs>
    <ion-tab [root]="ionTab1" tabTitle="Hand and Table"></ion-tab>
    <ion-tab [root]="ionTab2" tabTitle="Hand"></ion-tab>
    <ion-tab [root]="ionTab3" tabTitle="Table"></ion-tab>
  </ion-tabs>
`
  }
)

export class RunGameTabs extends RunGameContainer{
  ionTab1:Type = RunGameHandAndTable;
  ionTab2:Type = RunGameHand;
  ionTab3:Type = RunGameTable;
  constructor(private ngZone:NgZone) {
    super(ngZone);
  }
}

