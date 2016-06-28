/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */


import { Component, NgZone, Type } from '@angular/core';
import { TAB_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap'

import { RunGameHandAndTable } from "./run-game-hand-and-table";
import { RunGameHand } from "./run-game-hand";
import { RunGameTable } from "./run-game-table";
import { RunGameContainer } from "./run-game-container";
import {TargetPlatformId, PlatformTools} from "../../common-app/api/services/platform-tools";

function template():string {
  switch (PlatformTools.getTargetPlatforrm()) {
    case TargetPlatformId.IONIC:
      return `
<ion-header>
  <ion-navbar *navbar>
    <button menuToggle>MN
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
`;
    case TargetPlatformId.TWBS_CORDOVA:
    case TargetPlatformId.TWBS_WEB:
      return `
 
  <tabset active="active">
    <tab index="0" heading="Hand and Table">
      <run-game-hand-and-table></run-game-hand-and-table>
    </tab>
    <tab index="1" heading="Hand">
      <run-game-hand showTableProxy="true"></run-game-hand>    
    </tab> 
    <tab index="2" heading="Table">
     <run-game-table height="90vw" width="100hw"></run-game-table>  
    </tab>
  </tabset>
      `;
    default:
      log.error('Styling not developed for target platform')
  }
}

@Component(
  {
    selector: 'run-game-tabs',
    directives: [RunGameHandAndTable, RunGameHand, RunGameTable, TAB_DIRECTIVES],
    template: template()
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

