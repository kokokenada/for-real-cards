import { Component, Input, NgZone } from '@angular/core';
import { Menus, MenuItem } from "../../ui/index";

@Component({
  selector: 'popover-menu',
  template: `

    <div class="d-inline-block" ngbDropdown>
      <button id="dropdownMenu1" class="btn btn-primary" ngbDropdownToggle style="font-size: x-large"></button>
      <div class="dropdown-menu dropdown-menu-right">
        <button
            *ngFor="let item of getMenuItems() | menuFilter"
            (click)="itemSelected(item)"
            class="dropdown-item"
        >
          {{item.title}}
        </button>      
      </div>
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