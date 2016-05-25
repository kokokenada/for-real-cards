/**
 * Created by kenono on 2016-05-08.
 */
import {Component, timeoutApply} from "../../common/ui-twbs_ng15/util";
import {Avatar} from '../../common/ui-twbs_ng15/avatar'; (Avatar);
import {Hand, HandCollection} from  '../api/models/hand.model.ts';
import {Card} from "../api/models/card.model"
import {AccountTools, UserEvent, UserEventType} from "../../common/api/services/account-tools";
import {GameRenderingTools} from "../api/services/game-rendering-tools";
import Disposable = Rx.Disposable;

@Component(
  {
    module: 'fastcards',
    selector: 'player',
    template: `


<div style="position: relative; 
             width:100%; 
             height: 100%;
             display: block;
              overflow-y: hidden;
              overflow-x: hidden;
             border-width: 1px; border-style: outset; border-color: darkblue; background-color: white">
  <!-- NAME -->
  <div style="
            position: absolute;
            width:  100%;
            top: 0;
            height: 1.2em;
            text-align: center; 
            white-space: nowrap;
            background-color:lightgray; color:darkblue; padding: 0; margin: 0">
    {{vm.displayName()}}
  </div>
  <!-- AVATAR -->
  <avatar ng-click="vm.clickedAvatar()" user-id="{{vm.hand.userId}}"  shape="rectangle"
      style="     
        position: absolute;
        top: 1.2em;
         display: inline-block;
        height: 60%;
        max-height: 60%;
        width: auto
         "
   >  
  </avatar>
  <!-- CARDS -->
  <div style="position: absolute; display: inline-block; top: 80%; z-index: 100; width: 100%;  " >
    <div 
      ng-repeat="card in vm.getCardsInHand()" 
      style="display: inline-block;  
      width:{{vm.cardWidth()}}%;
      height:auto;"
      >
      <img style="height:auto; width:90%" src="{{vm.getCardBackURL()}}"/>        
    </div>
  </div>
  <!-- Tricks -->
  <div 
    ng-repeat="trick in vm.getTricks()" 
    style="position: absolute; top:0; left:{{(vm.getTrickLeft($index))}}%; 
    width:{{vm.getTrickWidth()}}%;
    z-index: 200;
    ">
    <img style="height:auto; width:100%" src="{{vm.getCardBackURL()}}"/>        
  </div>

</div>
  <!-- card count -->
  <label ng-show="vm.numberOfCards()" class="card-count" 
  style="position: absolute; 10%; top:80%; left:90%; font-size: x-small; z-index: 250;">{{vm.numberOfCards()}}</label>

          `,
    controller: Player,
    controllerAs: 'vm',
    bindings: {
      hand: '<'
    }
  }
)
export class Player {
  hand:Hand;
  $scope:any;
  disposable:Disposable;
  private _displayName:string;

  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    this.disposable = AccountTools.startObserving((event:UserEvent)=>{
      if (event.eventType===UserEventType.DISPLAY_NAME_UPDATE && event.userId===this.hand.userId) {
        this._displayName = event.displayName;
        timeoutApply(this.$scope)
      }
    });
  }
  $onDestroy() {
    if (this.disposable) {
      this.disposable.dispose();
    }
  }

  getCardsInHand():Card[] {
    return this.hand.cardsInHand;
  }

  getCardBackURL():string {
    return GameRenderingTools.getCardBackURL(this.hand.gameId);
  }

  displayName():string {
    return this._displayName;
  }

  cardWidth():string {
    return (100/Math.max(this.getCardsInHand().length,5)).toString();
  }

  getTricks():Card[][] {
    return this.hand.tricks;
  }

  getTrickWidth():number {
    let numberOfSlots = Math.max(this.hand.tricks[0].length, 4);
    return (100/numberOfSlots);
  }

  getTrickLeft(index:number):number {
    return index * this.getTrickWidth();
  }

  numberOfCards():number {
    if (!this.hand.cardsInHand)
      return 0;
    return this.hand.cardsInHand.length;
  }

  clickedAvatar():void {
    if (this.hand.userId === Meteor.userId() ) {
      alert('clicked self')
    } else {
      alert('clicked' + this.hand.userId)
    }
  }

}