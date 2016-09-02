/// <reference path="globals/alanning:roles/index.d.ts" />
/// <reference path="globals/es6-shim/index.d.ts" />
/// <reference path="globals/loglevel/index.d.ts" />
/// <reference path="globals/meteor-roles/index.d.ts" />
/// <reference path="globals/meteor/index.d.ts" />
/// <reference path="globals/simple-schema/simple-schema.d.ts" />
/// <reference path="globals/underscore/index.d.ts" />
/// <reference path="modules/es6-promise/index.d.ts" />

declare module "*.html" {
  const template: string;
  export default template;
}