import { Alert } from 'ionic-angular';
import {PlatformToolsIonic} from "../services/platform-tools-ionic";
import {CommonPopupModal} from "../../ui-ng2/common-popups/common-popup.class";


export class CommonPopups {
  static alert(messageOrError, titleText:string="", okText:string="OK"):void {
    let message = CommonPopupModal.messageOrErrorToText(messageOrError);

    let alert = Alert.create({
      title: titleText,
      subTitle: message,
      buttons: [okText]
    });
    PlatformToolsIonic.getNav().present(alert);
  }
  static confirm(messageText:string, titleText:string="", okText:string="OK", cancelText:string="Cancel"):Promise<boolean> {
    return new Promise((resolve, reject)=>{
      let confirm = Alert.create({
        title: titleText,
        message: messageText,
        buttons: [
          {
            text: cancelText,
            handler: () => {
              resolve(null);
            }
          },
          {
            text: okText,
            handler: () => {
              resolve(true);
            }
          }
        ]
      });
      PlatformToolsIonic.getNav().present(confirm);
    });
  }
}