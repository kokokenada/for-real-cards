
export interface ICollection {
  name: string;
  reference: any;
}

export interface ICollections {
  [prop:string]: ICollection
}

export const uploaderCollections:ICollections = {};

