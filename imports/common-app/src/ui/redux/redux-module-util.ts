import {IActionError, IPayloadAction} from "./action.interface";
import {fromJS, Map} from 'immutable'
export class ReduxModuleUtil {

  static errorFactory(actionType:string, error:IActionError):IPayloadAction {
    return {type: actionType, error: error };
  }

  static arrayToMap<T>(arr:any[], key:string="_id"):Map<string, T> {
    let obj:Object = {};
    arr.forEach( (item:any)=>{
      obj[key] = item;
    });
    return fromJS(obj);
  }
}