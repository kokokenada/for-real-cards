
export interface IUploaderService {
  uploadFile(currentFile, collectionName: string): void;
  uploadImageFromCamera(collectionName: string, options?: any) : void;
}
