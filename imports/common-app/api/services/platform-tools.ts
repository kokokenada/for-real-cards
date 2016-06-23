import { Injectable } from '@angular/core';
//import { require } from 'meteor/modules'
declare var require:any;

export enum TargetPlatformId {
  TWBS_WEB,
  TWBS_CORDOVA,
  NG_MATERIAL_WEB,
  NG_MATERIAL_CORDOVA,
  IONIC
}

//@Injectable()
export class PlatformTools {
  private static targetPlatForm:TargetPlatformId;

  private static importSCSS():void {
    switch (PlatformTools.targetPlatForm) {
      case TargetPlatformId.IONIC:
      {
        require('../../ui-ionic/scss/ionic.scss');
        break;
      }
      case TargetPlatformId.TWBS_CORDOVA:
      case TargetPlatformId.TWBS_WEB:
      {
        require('../../ui-twbs-ng2/scss/bootstrap.scss');
        break;
      }
      case TargetPlatformId.NG_MATERIAL_CORDOVA:
      case TargetPlatformId.NG_MATERIAL_WEB: {
        console.error("NG SCCS import not implemented yet");
        break;
      }
      default: throw "Unexpected platformId. (Was setTargetPlatform called?)";
    }
  }

  static setTargetPlatform(targetPlatformId:TargetPlatformId) {
    PlatformTools.targetPlatForm = targetPlatformId;
    PlatformTools.importSCSS();
  }
  
  static getTargetPlatforrm():TargetPlatformId {
    return PlatformTools.targetPlatForm;
  }

  static isIonic():boolean {
    if (PlatformTools.targetPlatForm===undefined)
      throw "Call setTargetPlatform() to set platform";
    return PlatformTools.targetPlatForm===TargetPlatformId.IONIC
  }

  static platformNameSegment():string {
    switch (PlatformTools.targetPlatForm) {
      case TargetPlatformId.IONIC: return "ionic";
      case TargetPlatformId.TWBS_CORDOVA: return "twbs";
      case TargetPlatformId.TWBS_WEB: return "twbs";
      case TargetPlatformId.NG_MATERIAL_CORDOVA: return "md";
      case TargetPlatformId.NG_MATERIAL_WEB: return "md";
      default: throw "Unexpected platformId. (Was setTargetPlatform called?)";
    }
  }
}