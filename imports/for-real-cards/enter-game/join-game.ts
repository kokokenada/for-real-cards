import { Component, Input } from '@angular/core';
import {Meteor} from 'meteor/meteor';
import {FastCardsTopFrame} from './top-frame.ts';


@Component(
  {
    selector: 'joinGame',
    controller: JoinGame,
    controllerAs: 'vm',
    require: {
      topFrame: '^fastCardsTopFrame'
    },
    template: `
 
 <div class="panel panel-default">
  <form class="form-horizontal">
    <div class="panel-heading">
      <h3 class="panel-title">Join Game</h3>
    </div>
    <div class="panel-body">
      <div class="form-group">
        <div class="col-xs-1"></div>
        <label class="col-xs-4 control-label" for="game-id">Game Id:</label>
        <div class="col-xs-7">
          <input ng-model="vm.gameId" type="text" class="form-control" id="game-id">
        </div>
      </div>
      <div class="form-group">
        <div class="col-xs-1"></div>
        <label class="col-xs-4 control-label" for="password">Password (if required):</label>
        <div class="col-xs-7">
          <input ng-model="vm.password" type="text" class="form-control" id="password">
        </div>
      </div>
      <button type="button" ng-click="vm.joinGame()" class="btn btn-success btn-block">
          Join Game
      </button>
      <button type="button" ng-click="vm.displayGame()" class="btn btn-default btn-block">
          Display Game Table
      </button>
    </div>
  </form>
</div>

    `
})
export class JoinGame{
  $log:any;
  $scope:any;
  password:string;
  gameId:string;
  topFrame:FastCardsTopFrame;
  constructor($log, $scope) {
    this.$log = $log;
    this.$scope = $scope;
  }
  joinGame() {
    this.topFrame.constructor.navigateToHand(this.$scope, this.gameId, this.password);
    this.topFrame.setGameDescription("New Game (id " + this.gameId + ")");
  };
  displayGame() {
    this.topFrame.constructor.navigateToTable(this.$scope, this.gameId, this.password);
    this.topFrame.setGameDescription("New Game (id " + this.gameId + ")");
  }; 
}