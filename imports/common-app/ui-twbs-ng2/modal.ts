/**
 * Created by kenono on 2016-04-23.
 */
import * as log from 'loglevel';
import {Tools} from '../../common-app/api'
import {Subject} from 'rxjs';
import { Component } from '@angular/core';

interface ModalInfo {
  subject:Subject;
  payload;
}

@Component({
  template: Modal.template
})
export class Modal {
  // All static members due to issues with construction (class gets constructed by modal)
  private static serviceCreated:boolean = false;
  private static modalService;
  private static modules:string[];
  private static subject:Subject;
  private static staticModalInstance;
  private static template:string;
  constructor() {
  }

  static open(params=undefined, size=undefined, animationsEnabled=true):Subject {
      let paramsString = "";
      let componentSelector:string = this.name;
      if (params) {
        let keys:string[] = _.keys(params);
        for (let i=0; i<keys.length; i++) {
          let key = keys[i];
          let value = params[key].toString();
          if (value.indexOf("'")!==-1) {
            throw "Can't have ' in value";
          }
          paramsString += " " + Tools.dasherize(key) + " = '" + value + "'";
        }
      }
      Modal.template = '<' + Tools.dasherize(componentSelector) + paramsString + '></' + Tools.dasherize(componentSelector) + ">";

/*            modalInstance.result.then(function (modalInfo:ModalInfo) {
              modalInfo.subject.next(modalInfo.payload);
              modalInfo.subject.complete();
            }, function (modalInfo:ModalInfo) {
              modalInfo.subject.next(modalInfo.payload);
              modalInfo.subject.complete();
            });
            return modalInstance;
          }
        }])
        */
    Modal.subject = new Subject();
    Modal.staticModalInstance = Modal.modalService.open(componentSelector, params, size, animationsEnabled);
    return Modal.subject;
  }

  complete(payload=undefined) {
    let modalInfo = {subject: Modal.subject, payload: payload}
    Modal.staticModalInstance.dismiss(modalInfo);
  }
}
