/**
 * Created by kenono on 2016-04-16.
 */

import { Component, Input } from '@angular/core';
import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { Subscription } from 'rxjs'

import { Menus, MenuItem, UserEvent, UserEventType } from "../api"


@Component({
  selector: 'popover-menu',
  directives: [DROPDOWN_DIRECTIVES],
  template: `

    <span dropdown (on-toggle)="toggled($event)">
      <span dropdownToggle class="glyphicon glyphicon-menu-hamburger"  aria-hidden="true"></span>
      <ul class="dropdown-menu dropdown-menu-right" >
        <li
            *ngFor="let item of getMenuItems()"
            (click)="itemSelected(item)"
        >
          <p>{{item.title}}</p>
        </li>      
      </ul>
    </span>
`,
})
export class PopoverMenu {
  @Input() menuId: string;
  private menuItems:MenuItem[];
  private subscription:Subscription;

  ngOnInit() {
    this.subscription = UserEvent.startObserving((event:UserEvent)=>{
      if (event.eventType===UserEventType.LOGIN || event.eventType===UserEventType.ROLL_UPDATE) {
        this.menuItems =null;
        this.getMenuItems();
      }
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getMenuItems():MenuItem[] {
    if (!this.menuItems) {
      let menuItem:MenuItem = Menus.getMenuFromId(this.menuId);

//    console.log('menuId: ' + this.menuId + ' menuItem:');
//    console.log(menuItem);
//      console.log('user:' + Meteor.userId())
//      console.log(Meteor.user())
      if (menuItem){
        this.menuItems = [];
        menuItem.items.forEach((subMenuItem:MenuItem)=>{
          if (subMenuItem.shouldRender()) {
            this.menuItems.push(subMenuItem);
          }
        });
      }
    }
    return this.menuItems;
  }

  itemSelected(menuItem:MenuItem) {
//    console.log(menuItem);
    if (menuItem.event) {
//      this.$rootScope.$broadcast(menuItem.event);
    }
    if (menuItem.callback) {
      menuItem.callback(menuItem);
    }
  }

}