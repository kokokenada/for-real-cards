//import { require } from 'meteor/modules'
import {IGamePlayState} from '../ui/redux/game-play/game-play.types';
declare var require:any;

import { Injectable } from '@angular/core';

import { ModalService } from "../../common-app/src/ui/redux/modal/modal.service";
import { PlatformTools } from "../../common-app/src/ui-ng2/platform-tools/platform-tools";
import { GameConfig } from "../api/index";
import { DealModalParam, DealModalResult } from "./deal-modal-params-and-result";

@Injectable()
export class DealModalService {
  constructor(private modalService:ModalService) {}
  open(gameState: IGamePlayState):Promise<DealModalResult> {
    let dealModal;
    if (PlatformTools.isIonic()) {
      dealModal = require("./deal-modal.ionic").DealModal;
    } else if (PlatformTools.isTWBS()) {
      dealModal = require("./deal-modal.twbs").DealModal;
    } else {
      throw "Unsupported platform";
    }
    return this.modalService.asPromise<DealModalParam, DealModalResult>(dealModal, {gameState});
  }
}
