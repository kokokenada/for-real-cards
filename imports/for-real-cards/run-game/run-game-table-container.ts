/**
 * Created by kenono on 2016-05-08.
 */
import { Component, Input } from '@angular/core';
import { RunGameTable } from "./run-game-table"; (RunGameTable)

@Component(
  {
    selector: 'runGameTableContainer',
    template: `

  <run-game-table height="90vw" width="100hw" game-id="{{vm.gameId}}"></run-game-table>
          `,
    controller: RunGameTableContainer,
    controllerAs: 'vm',
  }
)
export class RunGameTableContainer {
  @Input() gameId:string;

  $routerOnActivate(next) {
    this.gameId = next.params.gameId;
  }
}
