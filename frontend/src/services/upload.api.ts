import { apiHelper } from '@/src/libs/helper';

// Types for file upload
export interface PresignedUrlRequest {
  fileName: string;
  fileType: 'IMAGE' | 'VIDEO';
  resourceType: 'JEWELLERY' | 'DIAMOND' | 'USER' | 'OTHER';
}

export interface PresignedUrlResponse {
  preSignedUrl: string;
  fileUrl: string;
  fileName: string;
}

export interface FileUploadResponse {
  fileUrl: string;
  fileName: string;
  message?: string;
}

// File upload API service
export const uploadAPI = {
  // Get presigned URL for file upload
  getPresignedUrl: async (data: PresignedUrlRequest): Promise<PresignedUrlResponse> => {
    try {
      const response = await apiHelper.get<PresignedUrlResponse>('/upload/presinged-url', {
        params: data
      });
      
      // Validate the response
      if (!response.preSignedUrl) {
        throw new Error('Invalid presigned URL response: missing required fields');
      }

      return response;
    } catch (error) {
      console.error('Error getting presigned URL:', error);
      throw new Error(`Failed to get presigned URL: ${error}`);
    }
  },

  // Upload file to S3 using presigned URL
  uploadFileToS3: async (presignedUrl: string, file: File): Promise<void> => {
    try {
      // Validate presigned URL
      if (!presignedUrl || presignedUrl === 'undefined') {
        throw new Error('Invalid presigned URL provided');
      }

      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      
      if (!response.ok) {
        throw new Error(`S3 upload failed with status ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error(`Failed to upload file to S3: ${error}`);
    }
  },

  // Complete file upload flow - get presigned URL and upload file
  uploadFile: async (file: File, resourceType: 'JEWELLERY' | 'DIAMOND' | 'USER' | 'OTHER'): Promise<FileUploadResponse> => {
    try {
      // Determine file type based on MIME type
      const fileType: 'IMAGE' | 'VIDEO' = file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO';
      
      // Get presigned URL
      const presignedData: any = await uploadAPI.getPresignedUrl({
        fileName: file.name,
        fileType,
        resourceType,
      });

      // Upload file to S3
      await uploadAPI.uploadFileToS3(presignedData.preSignedUrl, file);

      return {
        fileUrl: presignedData.outPutUrl,
        fileName: presignedData.fileName,
        message: 'File uploaded successfully',
      };
    } catch (error) {
      throw new Error(`File upload failed: ${error}`);
    }
  },

  // Delete file from S3
  deleteFile: async (fileName: string): Promise<{ message: string }> => {
    return apiHelper.delete<{ message: string }>('/upload/delete-file', {
      params: { fileName }
    });
  },
};

