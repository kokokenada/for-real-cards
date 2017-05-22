
function conditionWithDepthCheck(obj: Object, depth: number): Object {
  let ret = {};
  Object.keys(obj).forEach( (key) => {
    let val = obj[key];
    let remove = false;
    if (val === undefined)
      val = null;
    else if (val === null)
      {} // No-op
    else if ( typeof val === 'object' ) {
      if (depth>100)
        throw 'conditionObjectForFirebase exceeded depth of 100';
      val = conditionWithDepthCheck(val, depth++)
    } else if (typeof val === 'function') {
      remove = true;
    }
    if (!remove)
      ret[key] = val;
  });
  return ret;
}


export function conditionObjectForFirebase(obj: Object): Object {
  return conditionWithDepthCheck(obj, 0);
}
