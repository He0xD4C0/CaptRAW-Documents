import { ArticleService } from './articleService';
import { NoticeService } from './noticeService';
import { BannerService } from './bannerService';
import { TagService } from './tagService';
import { AuthService } from './authService';
import { FileService } from './fileService';

// 导出所有服务实例
export const articleService = new ArticleService();
export const noticeService = new NoticeService();
export const bannerService = new BannerService();
export const tagService = new TagService();
export const authService = new AuthService();
export const fileService = new FileService();

// 主API服务（向后兼容）
class ApiService {
  // 文章相关API
  getArticles = articleService.getArticles.bind(articleService);
  getArticle = articleService.getArticle.bind(articleService);
  createArticle = articleService.createArticle.bind(articleService);
  updateArticle = articleService.updateArticle.bind(articleService);
  deleteArticle = articleService.deleteArticle.bind(articleService);

  // 公告相关API
  getNotices = noticeService.getNotices.bind(noticeService);

  // 横幅相关API
  getBanners = bannerService.getBanners.bind(bannerService);

  // 标签相关API
  getTags = tagService.getTags.bind(tagService);

  // 用户认证相关API
  login = authService.login.bind(authService);
  register = authService.register.bind(authService);
  logout = authService.logout.bind(authService);
  getCurrentUser = authService.getCurrentUser.bind(authService);

  // 文件上传API
  uploadImage = fileService.uploadImage.bind(fileService);
}

// 创建实例并导出
const apiService = new ApiService();

// 导出默认实例（保持向后兼容）
export default apiService;

// 导出类型
export type { AuthResponse } from './authService';
export type { UploadResponse } from './fileService';