
import {Meteor} from 'meteor/meteor';
//import {FastCardsTopFrame} from './top-frame.ts'
import { Component } from '@angular/core';

@Component(
  {
    module: 'fastcards',
    selector: 'newGame',
    controller: NewGame,
    controllerAs: 'vm',
    require: {
      topFrame: '^fastCardsTopFrame'
    },
    template: `
<div class="panel panel-default">
  <form class="form-horizontal">
    <div class="panel-heading">
      <h3 class="panel-title">New Game</h3>
    </div>
    <div class="panel-body">
      <div class="form-group">
        <div class="col-xs-1"></div>
        <label class="col-xs-4" for="password">Password (optional):</label>
        <div class="col-xs-7">
          <input class="form-control" ng-model="vm.password" type="text" id="password">
        </div>
      </div>
      <button type="button" class="btn btn-success btn-block" ng-click="vm.newGame()">
        Start Game
      </button>
      </div>
  </form>
</div>
`
  }
)
export class NewGame{
  $log:any;
  $scope:any;
  topFrame:FastCardsTopFrame;
  selectedDeck = 0;
  constructor($log, $scope) {
    this.$log = $log;
    this.$scope = $scope;
  }
  password: string;
  newGame() {
    Meteor.call('FastCardsNewGame', this.password, (error, result)=>{
      if (error) {
        this.$log.error(error);
      } else {
        this.topFrame.constructor.navigateToHand(this.$scope, result, this.password);
        this.topFrame.setGameDescription("New Game (id " + result + ")");
      }
    });
  }
}

