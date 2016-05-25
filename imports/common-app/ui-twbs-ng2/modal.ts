/**
 * Created by kenono on 2016-04-23.
 */
import * as log from 'loglevel';
import 'angular';
import {dasherize, dashToCamel} from './util'
import {Subject, Rx} from 'rx';
import {Meteor} from 'meteor/meteor';

interface ModalInfo {
  subject:Subject;
  payload;
}

export class Modal {
  // All static members due to issues with construction (class gets constructed by modal)
  private static serviceCreated:boolean = false;
  private static modalService;
  private static modules:string[];
  private static subject:Subject;
  private static staticModalInstance;

  constructor() {
  }

  static open(params=undefined, size=undefined, animationsEnabled=true):Subject {
    let modules:string[] = [this.prototype.componentDefinition.module];
    let componentSelector:string = this.name;
    if (!Modal.serviceCreated) {
      Modal.modules = modules;

      angular.module('common')
        .service('common.modal.service', ['$uibModal', function ($uibModal) {
          let self = this;
          self.open = (componentSelector, params=undefined, size=undefined, animationsEnabled=true)=> {
            let paramsString:string = "";
            if (params) {
              let keys:string[] = _.keys(params);
              for (let i=0; i<keys.length; i++) {
                let key = keys[i];
                let value = params[key].toString();
                if (value.indexOf("'")!==-1) {
                  throw "Can't have ' in value";
                }
                paramsString += " " + dasherize(key) + " = '" + value + "'";
              }
            }
            let modalInstance = $uibModal.open({
              animation: animationsEnabled,
              template: function() {return '<' + dasherize(componentSelector) + paramsString + '></' + dasherize(componentSelector) + ">" },
              controller: 'common.modal.controller',
              size: size
            });

            modalInstance.result.then(function (modalInfo:ModalInfo) {
              modalInfo.subject.onNext(modalInfo.payload);
              modalInfo.subject.onCompleted();
            }, function (modalInfo:ModalInfo) {
              modalInfo.subject.onNext(modalInfo.payload);
              modalInfo.subject.onCompleted();
            });
            return modalInstance;
          }
        }])
        .controller('common.modal.controller', ['$uibModal', function ($uibModal) {
          let self = this;
        }]);
      let required:string[] = ['ng', 'ui.bootstrap', 'common'];
      Array.prototype.push.apply(required, modules);
      Modal.modalService = angular.injector(required).get('common.modal.service');
      Modal.serviceCreated = true;
    } else {
      if (!_.isEqual(modules, Modal.modules))  {
        log.error('modules inconsistently constructed. Expected modules and Modal.modules to be equal');
        log.error(modules);
        log.error(Modal.modules);
      }
    }
    Modal.subject = new Rx.Subject();
    Modal.staticModalInstance = Modal.modalService.open(componentSelector, params, size, animationsEnabled);
    return Modal.subject;
  }

  complete(payload=undefined) {
    let modalInfo = {subject: Modal.subject, payload: payload}
    Modal.staticModalInstance.dismiss(modalInfo);
  }
}
