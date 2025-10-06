export interface FileUploadRequest {
  filename: string
  mime_type: string
  file_size: number
}

export interface UploadedFile {
  upload_url: string
  file_id: string
  upload_headers: {
    [key: string]: unknown
  }
}
