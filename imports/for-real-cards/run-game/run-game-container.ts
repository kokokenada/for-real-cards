/**
 * Created by kenono on 2016-05-27.
 */
import { Input } from '@angular/core';
import { OnActivate, Router, RouteSegment } from '@angular/router';


export class RunGameContainer {
  @Input() gameId:string;
  constructor(private router: Router) {

  }
  routerOnActivate(curr: RouteSegment) {
    let id = curr.getParam('id');
    this.gameId = id;
  }

}