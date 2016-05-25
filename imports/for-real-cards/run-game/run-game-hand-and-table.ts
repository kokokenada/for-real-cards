/**
 * Created by kenono on 2016-05-08.
 */
import { Component, Input } from '@angular/core';
import {RunGameTable} from "./run-game-table"; (RunGameTable )
@Component(
  {
    selector: 'run-game-hand-and-table',
    template: `

  <run-game-table for-player="true" height="45vh" width="100hw" game-id="{{vm.gameId}}"></run-game-table>
  <run-game-hand game-id="{{vm.gameId}}" style="width:100vw; height: 45vh"></run-game-hand>
          `,
    controllerAs: 'vm',
  }
)
export class RunGameHandAndTable {
  @Input() gameId:string;
}

