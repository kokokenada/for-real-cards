/**
 * Copyright Ken Ono, Fabrica Technolology 2016
 * Source code license under Creative Commons - Attribution-NonCommercial 2.0 Canada (CC BY-NC 2.0 CA)
 */

import { Input } from '@angular/core';
import { Router, RouteSegment } from '@angular/router';


export class RunGameContainer {
  @Input() gameId:string;
  constructor(private router: Router) {

  }
  routerOnActivate(curr: RouteSegment) {
    this.gameId = curr.getParam('id');
  }
}