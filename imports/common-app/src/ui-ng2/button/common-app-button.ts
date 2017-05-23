import { Component, ComponentFactory, Compiler, Directive, EventEmitter, Input, Output, Type, ViewContainerRef } from '@angular/core';
import { PlatformTools } from "../platform-tools/platform-tools";
declare var require:any;

export let CommonAppButton;
if (PlatformTools.isIonic()) { // TODO: make this happen at build time. (how?)
  CommonAppButton = require('../../ui-ionic/button/common-app-button.ionic').CommonAppButton;
} else if (PlatformTools.isTWBS()) {
  CommonAppButton = require('../../ui-twbs-ng2/button/common-app-button.twbs').CommonAppButton;
} else {
  throw "unsupported Platform in CommonPopups";
}


