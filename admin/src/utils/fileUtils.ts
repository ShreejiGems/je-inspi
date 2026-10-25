export const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  VIDEO: ['video/mp4', 'video/mov', 'video/avi', 'video/webm'],
  PDF: ['application/pdf'],
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  // Check file type
  const isImage = FILE_TYPES.IMAGE.includes(file.type);
  const isVideo = FILE_TYPES.VIDEO.includes(file.type);
  const isPdf = FILE_TYPES.PDF.includes(file.type);

  if (!isImage && !isVideo && !isPdf) {
    return {
      isValid: false,
      error: 'Please select a valid image, video, or PDF file',
    };
  }

  return { isValid: true };
};

export const getFileType = (file: File): 'IMAGE' | 'VIDEO' | 'FILE' => {
  if (FILE_TYPES.VIDEO.includes(file.type)) return 'VIDEO';
  if (FILE_TYPES.PDF.includes(file.type)) return 'FILE';
  return 'IMAGE';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generateFileName = (originalName: string, imageType: string): string => {
  const extension = originalName.split('.').pop();
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${imageType.toLowerCase()}_${timestamp}_${randomSuffix}.${extension}`;
};

