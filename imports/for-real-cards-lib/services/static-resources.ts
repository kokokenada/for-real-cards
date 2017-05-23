
export class StaticResources {
  static instance:StaticResources;
  constructor(private baseUrl:() => string) {
    StaticResources.instance = this;
  }
  getURL(pathFromTop: string): string {
    return this.baseUrl() + pathFromTop;
  }

}