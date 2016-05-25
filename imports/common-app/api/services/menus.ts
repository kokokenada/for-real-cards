/**
 * Created by kenono on 2016-04-16.
 */

import {Meteor} from 'meteor/meteor';
import 'underscore'
import * as log from 'loglevel';

export interface MenuItemDefintion {
  id:string;
  parentId?: string;
  title?:string;
  context?:string[];
  componentNames?:string[];
  event?:string;
  type?:string;
  roles?:string[];
  position?:number;
  items?:MenuItem[];
  parent?:MenuItem;
  callback? (m:MenuItem):void;
}

export class MenuItem implements MenuItemDefintion {
  id:string;
  parentId: string;
  title:string;
  context:string[];
  componentNames:string[];
  event:string;
  type:string;
  roles:string[];
  position:number;
  items:MenuItem[];
  parent:MenuItem;
  callback(m:MenuItem):void{};
  //menu:MenuItemDefintion;
  constructor(options:MenuItemDefintion) {
    options.type = options.type || 'item';
    options.roles = options.roles || ['user', 'admin'];
    options.position = options.position || 0;
    options.items = options.items || [];
    _.extend(this, options);
    //this.menu=options;
  }
  private shouldRender () {
    let user = Meteor.user();
    if (!!~this.roles.indexOf('*') || this.roles.length===0) {
      return true;
    } else {
      if (!user) {
        return false;
      }
      let roles:string[] = user.roles ? user.roles.concat('user') : ['user']; // Everyone is a user
      for (let userRoleIndex in roles) {
        for (let roleIndex in this.roles) {
          if (this.roles[roleIndex] === roles[userRoleIndex]) {
            return true;
          }
        }
      }
    }
    return false;
  };
}

export class Menus {
  private static menus:MenuItem[] = [];
  private static savedForLater = [];

  constructor() {
  }

  static getMenus() {
    return this.menus;
  }

  static getMenuFromId(id:string, menus:MenuItem[]=this.menus):MenuItem {
    let item = _.find(menus, (menu:MenuItem)=>{
      return menu.id===id;
    });
    if (item) {
      return item;
    } else {
      for (let i =0; i<menus.length; i++) {
        let sub:MenuItem = menus[i];
        item = this.getMenuFromId(id, sub.items); // recurse
        if (item)
          return item;
      }
      return null;
    }
  }

  static removeId(id:string): void {
    // broken. I wonder if I'll ever need it
    let index = _.indexOf(this.menus, (menu:MenuItem)=>{
      return menu.id===id;
    });
    if (index>=-1)
      this.menus.splice(index, 1);
    else
      throw Meteor.Error('missing-menu-id', "Can't find menu id '" + id + "' to delete");
  }


  // Validate menu existance
  static validateMenuExistance(menuId:string):MenuItem {
    if (menuId && menuId.length) {
      let menuItem:MenuItem = this.getMenuFromId(menuId);
      if (menuItem) {
        return menuItem;
      } else {
        log.error('Menu "' + menuId + '" does not exist');
      }
    } else {
      log.error('MenuId was not provided');
    }
    return null;
  };

  // Get the menu object by menu id
  static getMenu = function (menuId:string):MenuItem {
    // Validate that the menu exists
    let menuItem:MenuItem = this.validateMenuExistance(menuId);

    // Return the menu object
    return menuItem;
  };

  // Add new menu object by menu id
  static addMenu(options:MenuItemDefintion):MenuItem {
    // Create the new menu
    this.menus.push(new MenuItem(options));
    this.trySavedForLater();

    // Return the menu object
    return this.getMenuFromId(options.id);
  };

  // Remove existing menu object by menu id
  static removeMenu(menuId:string):void {
    // Validate that the menu exists
    this.validateMenuExistance(menuId);

    // Return the menu object

    this.removeMenu(menuId);
  };

/*  // Add menu item object
  static addMenuItem(parentMenuId:string, options:MenuItemDefintion):MenuItem {
    options = options || {};

    console.log('addMenuItem')
    console.log(options)

    // Validate that the menu exists
    this.validateMenuExistance(parentMenuId);

    // Push new menu item
    this.getMenuFromId(parentMenuId).menu.items.push( new MenuItem(options));

    // Add submenu items
    if (options.items) {
      for (let i in options.items) {
        this.addSubMenuItem(parentMenuId + '_' +i, menuId, options.items[i]);
      }
    }

    // See if some orphans can be integrated
    this.trySavedForLater();

    // Return the menu object
    return this.getMenuFromId(menuId);
  };
*/
  private static saveForLater(parentId:string, options:MenuItemDefintion):void {
    this.savedForLater.push({parentId: parentId, options: options});
  };

  // Add submenu item object
  static addSubMenuItem(parentId:string, options:MenuItemDefintion):MenuItem {


    // Search for menu item
    let parent:MenuItem = this.getMenuFromId(parentId);
    if (parent) {
      parent.items.push(new MenuItem(options));
      this.trySavedForLater();
      let returnedMenuItem  = this.getMenuFromId(options.id);
      returnedMenuItem.parent = parent;
//      console.log('addSubMenuItem')
//      console.log(returnedMenuItem)
      return returnedMenuItem;
    } else {
//      console.log('saved for later')
      this.saveForLater(parentId, options);
      return null;
    }
  };

  private static  trySavedForLater():void {
    let tryList = this.savedForLater;
    this.savedForLater = [];
    for (let i = 0; i < tryList.length; i++) {
      if (this.addSubMenuItem(tryList[i].parentId, tryList[i].options)) {
        tryList.splice(i,1);
      }
    }
  };

}
