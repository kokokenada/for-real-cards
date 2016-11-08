import { Component, Optional } from '@angular/core';
import {PlatformTools, TargetPlatformId} from "../../common-app/src/ui-ng2/platform-tools/platform-tools";


function template():string {
  switch (PlatformTools.getTargetPlatforrm()) {
    case TargetPlatformId.IONIC:
      return `
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

  <new-game></new-game>
  <join-game></join-game>

<ion-content>
  <button>Test 1</button>
  <button>Test 2</button>
  <button>Test 3</button>
  <button>Test 4</button>

</ion-content>
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
  template: template()
})
export class EnterGame {
}