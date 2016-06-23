/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
import { Component } from '@angular/core';

import {NewGame} from './new-game';
import {JoinGame} from './join-game';
import {PlatformTools, TargetPlatformId} from "../../common-app/api/services/platform-tools";

function template():string {
  switch (PlatformTools.getTargetPlatforrm()) {
    case TargetPlatformId.IONIC:
      return `
<ion-navbar *navbar>
  <ion-title>
    Enter Game
  </ion-title>
</ion-navbar>

  <new-game></new-game>
  <join-game></join-game>

`;
    case TargetPlatformId.TWBS_CORDOVA:
    case TargetPlatformId.TWBS_WEB:
      return `
  <new-game></new-game>
  <join-game></join-game>
`;
    default:
      log.error('Styling not developed for target platform')
  }
}

@Component({
  selector: 'enter-game',
  directives: [NewGame, JoinGame],
  template: template()
})
export class EnterGame {
}