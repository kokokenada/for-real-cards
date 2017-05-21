
function conditionWithDepthCheck(obj: Object, depth: number): Object {
  let ret = {};
  Object.keys(obj).forEach( (key) => {
    let val = obj[key];
    let remove = false;
    if (val === undefined)
      val = null;
    else if ( typeof val === 'object' ) {
      if (depth>100)
        throw 'undefinedPropsToNull exceeded depth of 100';
      val = conditionWithDepthCheck(val, depth++)
    } else if (typeof val === 'function') {
      remove = true;
    }
    if (!remove)
      ret[key] = val;
  });
  return ret;
}


export function undefinedPropsToNull(obj: Object): Object {
  return conditionWithDepthCheck(obj, 0);
}
