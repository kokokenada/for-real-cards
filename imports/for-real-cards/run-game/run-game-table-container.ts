/**
 * Created by kenono on 2016-05-08.
 */
import {Component} from "../../common/ui-twbs_ng15/util";
import {RunGameTable} from "./run-game-table"; (RunGameTable)

@Component(
  {
    module: 'fastcards',
    selector: 'runGameTableContainer',
    template: `

  <run-game-table height="90vw" width="100hw" game-id="{{vm.gameId}}"></run-game-table>
          `,
    controller: RunGameTableContainer,
    controllerAs: 'vm',
    bindings: {
      gameId: '@'
    }
  }
)
export class RunGameTableContainer {
  gameId:string;

  $routerOnActivate(next) {
    this.gameId = next.params.gameId;
  }
}
