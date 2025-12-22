import { FileUploadRequest, UploadedFile } from '../models/file.model'
import { BaseApiService } from './base.api'

class FilesApi extends BaseApiService {
  constructor() {
    super('/files')
  }

  /**
   * Upload URL for style generation
   *
   * @param data FileUploadRequest
   * @returns UploadedFile
   */
  async uploadUrl(data: FileUploadRequest) {
    return this.post<UploadedFile>(data, '/style-gen/upload-url')
  }

  /**
   * Upload URL for posts
   *
   * @param data FileUploadRequest
   * @returns UploadedFile
   */
  async uploadPostUrl(data: FileUploadRequest) {
    return this.post<UploadedFile>(data, '/posts/upload-url')
  }
}

export const filesApi = new FilesApi()
