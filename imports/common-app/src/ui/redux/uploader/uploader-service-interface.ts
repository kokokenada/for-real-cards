
export interface IUploaderService {
  uploadFile(currentFile, collection): void;
  uploadImageFromCamera(collection, options?: any) : void;
}
