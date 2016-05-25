/**
 * Created by kenono on 2016-05-08.
 */
import {Component} from "../../common/ui-twbs_ng15/util";
import {RunGameTable} from "./run-game-table"; (RunGameTable )
@Component(
  {
    module: 'fastcards',
    selector: 'runGameHandAndTable',
    template: `

  <run-game-table for-player="true" height="45vh" width="100hw" game-id="{{vm.gameId}}"></run-game-table>
  <run-game-hand game-id="{{vm.gameId}}" style="width:100vw; height: 45vh"></run-game-hand>
          `,
    controller: RunGameHandAndTable,
    controllerAs: 'vm',
    bindings: {
      gameId: '@'
    }
  }
)
export class RunGameHandAndTable {
  gameId:string;
}

