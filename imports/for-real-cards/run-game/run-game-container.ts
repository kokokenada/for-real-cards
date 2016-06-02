/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code licensed under GPL 3.0
 */

import { Input } from '@angular/core';
import { OnActivate, Router, RouteSegment } from '@angular/router';


export class RunGameContainer {
  @Input() gameId:string;
  constructor(private router: Router) {

  }
  routerOnActivate(curr: RouteSegment) {
    this.gameId = curr.getParam('id');
  }
}