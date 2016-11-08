/*
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */
//import { require } from 'meteor/modules'
declare var require:any;

import { Injectable } from '@angular/core';

import { ModalService } from "../../common-app/src/ui/redux/modal/modal.service";
import { PlatformTools } from "../../common-app/src/ui-ng2/platform-tools/platform-tools";
import { GameConfig } from "../api/index";
import { DealModalParamAndResult } from "./deal-modal-params-and-result";

@Injectable()
export class DealModalService {
  constructor(private modalService:ModalService) {}
  open(gameConfig:GameConfig):Promise<DealModalParamAndResult> {
    let dealModal;
    if (PlatformTools.isIonic()) {
      dealModal = require("./deal-modal.ionic").DealModal;
    } else if (PlatformTools.isTWBS()) {
      dealModal = require("./deal-modal.twbs").DealModal;
    } else {
      throw "Unsupported platform";
    }
    return this.modalService.asPromise<DealModalParamAndResult, DealModalParamAndResult>(dealModal, {gameConfig: gameConfig});
  }
}
