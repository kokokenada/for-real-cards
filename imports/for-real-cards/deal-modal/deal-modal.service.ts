/**
 * Created by kenono on 2016-05-30.
 */
import { Injectable, Inject } from '@angular/core';
import { Subject } from "rxjs";

import { ModalService, MODAL_PROVIDERS } from "../../common-app/ui-twbs-ng2";
import { GameConfig } from "../api";


@Injectable()
export class DealModalService {
  constructor(private modalService:ModalService) {
    
  }
  open(gameConfig:GameConfig):Subject {
    return this.modalService.open("frc-deal-modal", {gameConfig: gameConfig});
  }
}

export let DEAL_MODAL_PROVIDERS = MODAL_PROVIDERS.concat([DealModalService]);
