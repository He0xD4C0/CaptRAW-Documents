import { BaseService, simulateDelay } from './baseService';
import { ApiResponse } from '../types';

export interface UploadResponse {
  url: string;
}

export class FileService extends BaseService {
  async uploadImage(file: File): Promise<ApiResponse<UploadResponse>> {
    await simulateDelay();
    
    // 模拟图片上传
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(this.successResponse({
          url: reader.result as string,
        }, '图片上传成功'));
      };
      reader.readAsDataURL(file);
    });
  }
}

// 导出默认实例
export const fileService = new FileService();
