import { Component, Input, NgZone } from '@angular/core';
import { Menus, MenuItem } from "../../ui/index";

@Component({
  selector: 'popover-menu',
  template: `

    <div class="btn-group" dropdown>
      <button dropdownToggle type="button" class="btn btn-primary dropdown-toggle" style="font-size: x-large"></button>
      <ul *dropdownMenu class="dropdown-menu dropdown-menu-right" role="menu">
        <li
            *ngFor="let item of getMenuItems() | menuFilter"
            (click)="itemSelected(item)"
            role="menuitem"
            class="dropdown-item"
        >
          {{item.title}}
        </li>      
      </ul>
    </div>
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