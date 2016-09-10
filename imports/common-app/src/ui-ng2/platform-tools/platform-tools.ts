import { Injector } from '@angular/core'
declare var require:any;

export enum TargetPlatformId {
  TWBS_WEB,
  TWBS_CORDOVA,
  NG_MATERIAL_WEB,
  NG_MATERIAL_CORDOVA,
  IONIC
}

export class PlatformTools {
  private static targetPlatForm:TargetPlatformId;
  private static platformSpecificTools:any;

  private static importSCSS():void {
    console.log('importing scss')
    console.log(PlatformTools.targetPlatForm)
    switch (PlatformTools.targetPlatForm) {
      case TargetPlatformId.IONIC:
      {
        require('../../ui-ionic/scss/ionic.scss' + ''); // The + '' prevents Meteor build from pucking if ionic.scss is not there
        PlatformTools.platformSpecificTools = require('../../ui-ionic/platform-tools/platform-tools-ionic' + '');
        //require('../../ui-ionic/scss/test.css');
        break;
      }
      case TargetPlatformId.TWBS_CORDOVA:
      case TargetPlatformId.TWBS_WEB:
      {
//        require('../../ui-twbs-ng2/scss/bootstrap.scss');

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

  static isTWBS():boolean {
    if (PlatformTools.targetPlatForm===undefined)
      throw "Call setTargetPlatform() to set platform";
    return (PlatformTools.targetPlatForm===TargetPlatformId.TWBS_CORDOVA || PlatformTools.targetPlatForm===TargetPlatformId.TWBS_WEB);
  }

  static isCordova():boolean {
    return Meteor.isCordova;
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

  static getNavParams(injector:Injector):any {
    switch (PlatformTools.targetPlatForm) {
      case TargetPlatformId.IONIC:
        return PlatformTools.platformSpecificTools.getNavParams(injector);
      default:
        throw "Unsupported or unexpected platform id";
    }
  }

}