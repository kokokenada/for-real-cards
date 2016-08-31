/**
 * Created by kenono on 2016-04-16.
 */

import { Component, Input, NgZone } from '@angular/core';
import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import { Menus, MenuItem } from "../ui/index";
import { MenuFilterPipe}  from '../ui-ng2';


@Component({
  selector: 'popover-menu',
  directives: [DROPDOWN_DIRECTIVES],
  pipes: [MenuFilterPipe],
  template: `

    <span dropdown (on-toggle)="toggled($event)">
      <span dropdownToggle class="glyphicon glyphicon-menu-hamburger" style="font-size: x-large" aria-hidden="true"></span>
      <ul class="dropdown-menu dropdown-menu-right" >
        <li
            *ngFor="let item of getMenuItems() | menuFilter"
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
  constructor(private ngZone:NgZone) {
  }
  private menuItems:MenuItem[];

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
          this.menuItems.push(subMenuItem);
        });
      }
    }
    return this.menuItems;
  }

  itemSelected(menuItem:MenuItem) {
    menuItem.selected();
  }

}