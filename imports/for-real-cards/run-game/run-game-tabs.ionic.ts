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
    template: `
<ion-header>
  <ion-navbar *navbar>
    <button menuToggle>
       <ion-icon name='menu'></ion-icon>
    </button>
    <ion-title>
      <top-frame-header></top-frame-header>      
    </ion-title>
  </ion-navbar>
</ion-header>
  <ion-tabs>
    <ion-tab [root]="ionTab1" tabTitle="Hand and Table"></ion-tab>
    <ion-tab [root]="ionTab2" [rootParams]="handParams" tabTitle="Hand"></ion-tab>
    <ion-tab [root]="ionTab3" [rootParams]="tableParams" tabTitle="Table"></ion-tab>
  </ion-tabs>
`
  }
)

export class RunGameTabs extends RunGameContainer{
  ionTab1:Type<any> = RunGameHandAndTable;
  ionTab2:Type<any> = RunGameHand;
  ionTab3:Type<any> = RunGameTable;
  handParams = {
    showTableProxy: true
  };
  tableParams = {
    height:"90vw",
    width:"100hw"
  };
  constructor(private ngZone:NgZone) {
    super(ngZone);
  };
}

