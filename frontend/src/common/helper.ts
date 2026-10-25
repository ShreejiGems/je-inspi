import { EB_Garamond } from "@/src/common/fonts";
import { message } from 'antd';
import { uploadAPI } from '@/src/services/upload.api';
import { utilityHelper } from '@/src/libs/helper';

export const garamond = EB_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export interface FileUploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  uploadType?: 'JEWELLERY' | 'DIAMOND' | 'USER' | 'OTHER'; 
  fieldName: string;
}

export const handleFileChange = async (
  info: any,
  form: any,
  setUploadingFile: (loading: boolean) => void,
  options: FileUploadOptions
) => {
  const file = info.file.originFileObj;
  if (file && form) {
    const maxSize = options.maxSize || 10 * 1024 * 1024;
    if (file.size > maxSize) {
      message.error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    const allowedTypes = options.allowedTypes || [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      message.error('Please upload a valid file type (JPG, PNG, PDF, DOC, DOCX)');
      return;
    }

    setUploadingFile(true);
    try {
      const uploadResult = await uploadAPI.uploadFile(file, options.uploadType || 'USER');
      form.setFieldsValue({ [options.fieldName]: uploadResult.fileUrl });
      message.success('File uploaded successfully!');
    } catch (error: any) {
      message.error(utilityHelper.formatErrorMessage(error));
      form.setFieldsValue({ [options.fieldName]: '' });
    } finally {
      setUploadingFile(false);
    }
  }
};
