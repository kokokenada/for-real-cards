/**
 * Created by kenono on 2016-05-31.
 */
/// Definitions for the collectionFS smart package
///
/// https://atmosphere.meteor.com/package/collectionFS
/// https://github.com/CollectionFS/Meteor-CollectionFS

/// <reference path='meteor.d.ts'/>
/// <reference path='node.d.ts'/>

//Copied from node.d.ts since node.d.ts was giving me compile errors for overloading some signatures
interface IBuffer extends NodeBuffer {
  new (str: string, encoding?: string): NodeBuffer;
  new (size: number): NodeBuffer;
  new (array: any[]): NodeBuffer;
  prototype: NodeBuffer;
  isBuffer(obj: any): boolean;
  byteLength(string: string, encoding?: string): number;
  concat    (list: NodeBuffer[], totalLength?: number): NodeBuffer;
}

//Code below this point is for the devel branch that should be compatible with Meteor 0.8.x
declare module FS {
  export var Collection: CollectionStatic;
  interface CollectionStatic {
    new<T>(name: string, options?: CollectionOptions): CollectionInstance<T>;
  }
  interface CollectionInstance<T> {
    ObjectID(hexString?: any): Object;
    find(selector?: any, options?): Mongo.Cursor<T>;
    findOne(selector?, options?):T;
    insert(doc:T, callback?:Function):string | FS.FileInstance;
    update(selector: any, modifier: any, options?: {multi?: boolean; upsert?: boolean;}, callback?:Function): number;
    upsert(selector: any, modifier: any, options?: {multi?: boolean;}, callback?:Function): {numberAffected?: number; insertedId?: string;}
    remove(selector: any, callback?:Function);
    allow(options:Mongo.AllowDenyOptions): boolean;
    deny(options:Mongo.AllowDenyOptions): boolean;
    // fileHandlers(handlers: CollectionFS.FileHandlers): void;
    // filter(options: CollectionFS.FilterOptions): void;
    fileIsAllowed(options: any): boolean;
    events(events): void;
    dispatch(...args: string[]): void;

    // Client API
    storeFile(file: File, metadata?: {}): string;
    storeFiles(files: File[], metadata: {}, callback?: (file: File, fileID: string) => void): {}[];
    // retrieveBlob(fileId: string, callback: (fileItem: CollectionFS.FileItem) => void);
    acceptDrops(templateName: string, selector: string, metadata?: {}, callback?: (file: File, fileID: string) => void): void;

    // Server API
    // storeBuffer(fileName: string, buffer: IBuffer, options: CollectionFS.StoreBufferOptions): string;
    retrieveBuffer(fileId: string): IBuffer;
  }

  interface CollectionOptions {
    stores?: Store.StoreInstance[];
    filter?: {
      maxSize?: number; //in bytes
      allow?: {
        contentTypes?: string[];
        extensions?: string[];
      };
      deny?: {
        contentTypes?: string[];
        extensions?: string[];
      };
      onInvalid?: (message) => void;
    }
    // autopublish:boolean;
    // maxFileHandlers: number;
  }

  export var File: FileStatic;
  interface FileStatic {
    new(file?: File): FileInstance;
  }
  interface FileInstance {
    _id?: string;
    collectionName?: string; // this property not stored in DB
    collection?: CollectionInstance<any>, // this property not stored in DB
    createdByTransform?: boolean; // this property not stored in DB
    data?: any; // maybe UInt8Array??  this property not stored in DB
    original?: {
      name?: string;
      size?: number;
      type?: string;
      updatedAt?: Date;
    },
    copies?: {
      storeName?: {
        key?: string;
        name?: string;
        size?: number;
        type?: string;
        createdAt?: Date,
        updatedAt?: Date
      }
    },
    uploadedAt?: Date;
    anyUserDefinedProp?: any;
    metadata?: { [id: string]: string }
    _getInfo?: (name: string) => {
      key: string;
    }
    name?: (nameOrStore?: string | {store: string}, storeOption?: {store: string}) => void | string;
    extension?: (extOrStore?: string | {store: string}, storeOption?: {store: string}) => void | string;
    size?: (sizeOrStore?: number | {store: string}, storeOption?: {store: string, save?: boolean}) => void | number;
    formattedSize?: (sizeOrStore?: number | {store: string}, storeOption?: {store: string}) => void | number;
    type?: (typeOrStore?: string | {store: string}, storeOption?: {store: string}) => void | string;
    updatedAt?: (dateOrStore?: Date | {store: string}, storeOption?: {store: string}) => void | Date;
    createReadStream?: (string) => any;
    createWriteStream?: (string) => any;
    update?: (modifier: {$set: {[path: string]: string}}) => void;
    attachData?: (readStreamOrURL, optionsOrCallback: {type: 'text/plain'} | Function) => void;
  }

  export module Store {
    export interface StoreInstance {}
    export interface StoreInstanceOptions {
      fileKeyMaker?: (fileObj: FileInstance) => string;
      beforeWrite?: (fileObj: FileInstance) => void;
      transformRead?: (fileObj: FileInstance, readStream, writeStream) => void;
      transformWrite?: (fileObj: FileInstance, readStream, writeStream) => void;
      maxTries?: number;
    }

    export var FileSystem: FileSystemStatic;
    export interface FileSystemStatic extends StoreInstance {
      new(name: string, options?: FileSystemOptions): FileSystemInstance;
    }
    export interface FileSystemInstance {
    }
    interface FileSystemOptions extends StoreInstanceOptions {
      path?: string;
    }

    export var S3: S3Static;
    export interface S3Static extends StoreInstance {
      new(name: string, options?: S3Options): S3Instance;
    }
    export interface S3Instance {
    }
    interface S3Options extends StoreInstanceOptions{
      accessKeyId: string;
      secretAccessKey: string;
      bucket: string;
      region?: string;
      ACL?: string;
      folder?: string;
    }

    export var GridFS: GridFSStatic;
    export interface GridFSStatic extends StoreInstance {
      new(name: string, options?: GridFSOptions): GridFSInstance;
    }
    export interface GridFSInstance {
    }
    interface GridFSOptions extends StoreInstanceOptions{
      mongoUrl: string;
      mongoOptions?: {};
      chunkSize?: number;
    }

    export var Dropbox: DropboxStatic;
    export interface DropboxStatic extends StoreInstance {
      new(name: string, options?: DropboxOptions): DropboxInstance;
    }
    export interface DropboxInstance {
    }
    interface DropboxOptions extends StoreInstanceOptions{
      key: string;
      secret: string;
      token: string;
      folder?: string;
    }
  }

  export module HTTP {
    export function setBaseUrl(url: string): void;
    export function setHeadersForGet(headers: string[][]): void;
  }

  export module Utility {
    export function eachFile(event: Meteor.Event, callback: (file) => void);
  }

}