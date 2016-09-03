declare var SimpleSchema: SimpleSchemaStatic;
declare module 'meteor/mongo' {
  module Mongo {
    var Collection: CollectionStatic;
    interface Collection < T > {
      attachSchema(SimpleSchema);
    }
  }
}
interface SimpleSchemaDefinition {
  [attribute: string]: {[props: string]: any}
}

interface SimpleSchemaStatic {
  new(definition: SimpleSchemaDefinition): SimpleSchema;
  extendOptions(options: {[options: string]: any}): void;
  RegEx: any;
}

interface SimpleSchema {

}