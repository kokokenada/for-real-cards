//import { require } from 'meteor/modules'
import {IGamePlayState} from '../ui/redux/game-play/game-play.types';

import { Injectable } from '@angular/core';

import { ModalService } from "../../common-app/src/ui/redux/modal/modal.service";
import { GameConfig } from "../api/index";
import {IBetModalParams, IBetModalResult} from './bet-modal.types';
import {BetModal} from './bet-modal';

@Injectable()
export class BetlModalService {
  constructor(private modalService:ModalService) {}
  open(gameState: IGamePlayState):Promise<IBetModalResult> {
    return this.modalService.asPromise<IBetModalParams, IBetModalResult>(BetModal, {gameState});
  }
}
