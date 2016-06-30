/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
//import { require } from 'meteor/modules'
declare var require:any;

import { Injectable, Inject } from '@angular/core';

import { ModalService  } from "../../common-app/ui-ng2/index";
import { PlatformTools } from "../../common-app/api/services/platform-tools";

import { GameConfig } from "../api/index";

@Injectable()
export class DealModalService {
  open(gameConfig:GameConfig):Promise<GameConfig> {
    let dealModal;
    if (PlatformTools.isIonic()) {
      dealModal = require("./deal-modal.ionic").DealModal;
    } else if (PlatformTools.isTWBS()) {
      dealModal = require("./deal-modal.twbs").DealModal;
    } else {
      throw "Unsupported platform";
    }
    return ModalService.open(dealModal, "frc-deal-modal", {gameConfig: gameConfig});
  }
}
