import {IActionError, IPayloadAction} from "./action.interface";

export class ReduxModuleUtil {

  static errorFactory(actionType:string, error:IActionError):IPayloadAction {
    return {type: actionType, error: error };
  }

  static arrayToMap<T>(arr:any[], key:string="_id"):Immutable.Map<string, T> {
    let obj:Object = {};
    arr.forEach( (item:any)=>{
      obj[key] = item;
    });
    return Immutable.fromJS(obj);
  }
}