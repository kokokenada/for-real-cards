/*
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
//import { require } from 'meteor/modules'
declare var require:any;

import { Injectable } from '@angular/core';


import { GameConfig } from "../api/index";
import {ModalActions} from "../../common-app/src/ui/redux/modal/modal-actions.class";
import {ModalService} from "../../common-app/src/ui/redux/modal/modal.service";
import {PlatformTools} from "../../common-app/src/ui-ng2/platform-tools/platform-tools";

@Injectable()
export class DealModalService {
  constructor(private modalActions:ModalActions, private modalService:ModalService) {}
  debugger;
  open(gameConfig:GameConfig):Promise<GameConfig> {
    let dealModal;
    if (PlatformTools.isIonic()) {
      dealModal = require("./deal-modal.ionic").DealModal;
    } else if (PlatformTools.isTWBS()) {
      dealModal = require("./deal-modal.twbs").DealModal;
    } else {
      throw "Unsupported platform";
    }
    return this.modalService.asPromise<GameConfig>(dealModal, {gameConfig: gameConfig});
  }
}
