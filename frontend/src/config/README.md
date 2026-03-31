# 配置模块目录说明

此目录包含 CaptRAW Documents 前端应用的配置管理相关代码。

## 文件说明

### `runtimeConfig.ts` - 运行时配置
从全局 `window` 对象获取运行时配置，并提供类型安全的访问接口。

**主要功能：**
- 从 `window.runtimeConfig` 读取配置
- 提供类型安全的配置访问
- 处理配置缺失的默认值
- 验证配置有效性

**核心接口：**
```typescript
interface RuntimeConfig {
  api: {
    baseUrl: string;
  };
  assets: {
    strategy: 'signedUrl' | 'publicUrl';
    publicBaseUrl: string;
    sign: {
      mode: 'real' | 'mock';
      expiresSeconds: number;
    };
  };
}
```

**使用示例：**
```typescript
import runtimeConfig from './config/runtimeConfig';

// 获取 API 基础 URL
const apiBaseUrl = runtimeConfig.api.baseUrl;

// 获取资产配置
const assetConfig = runtimeConfig.assets;
```

### `urls.ts` - URL 配置
定义应用中的所有 API 端点 URL。

**主要功能：**
- 集中管理所有 API 端点
- 支持路径参数和查询参数
- 提供 URL 构建工具函数

**核心函数：**
- `apiUrl(path, params?)` - 构建完整的 API URL
- `assetSignUrl(kind, uuid)` - 构建资产签名 URL
- `articleUrl(id)` - 构建文章详情 URL

**使用示例：**
```typescript
import { apiUrl, assetSignUrl } from './config/urls';

// 构建 API URL
const articlesUrl = apiUrl('/articles');
const articleDetailUrl = apiUrl('/articles/{id}', { id: 123 });

// 构建资产签名 URL
const avatarSignUrl = assetSignUrl('user', 'user_menu_avatar');
```

## 配置管理架构

### 配置来源
1. **构建时配置**：通过环境变量注入
2. **运行时配置**：通过 `window.runtimeConfig` 提供
3. **硬编码默认值**：作为最后的后备方案

### 配置优先级
1. 运行时配置（最高优先级）
2. 环境变量配置
3. 硬编码默认值（最低优先级）

## 配置验证

### 运行时配置验证
```typescript
function validateRuntimeConfig(config: any): RuntimeConfig {
  // 验证必需字段
  if (!config?.api?.baseUrl) {
    throw new Error('缺少必需的 API 配置');
  }
  
  // 验证资产配置
  if (!['signedUrl', 'publicUrl'].includes(config.assets?.strategy)) {
    throw new Error('无效的资产策略');
  }
  
  return config as RuntimeConfig;
}
```

### 类型安全访问
```typescript
// 使用可选链和空值合并
const baseUrl = runtimeConfig.api?.baseUrl ?? 'http://localhost:3001/api';
const mode = runtimeConfig.assets?.sign?.mode ?? 'mock';
```

## 配置同步机制

### 前端配置同步
前端构建时，根目录的 `config.yaml` 会被同步到 `public/config.yaml`：

```bash
# 同步脚本执行
node scripts/sync-config.js
```

### 配置加载流程
1. 前端应用启动
2. 加载 `public/config.yaml`
3. 解析 YAML 为 JavaScript 对象
4. 挂载到 `window.runtimeConfig`
5. 通过 `runtimeConfig.ts` 提供类型安全访问

## 环境特定配置

### 开发环境配置
```yaml
api:
  baseUrl: "http://localhost:3001/api"
assets:
  strategy: "signedUrl"
  sign:
    mode: "mock"  # 开发模式使用占位图
```

### 生产环境配置
```yaml
api:
  baseUrl: "https://api.captraw.com/api"
assets:
  strategy: "signedUrl"
  sign:
    mode: "real"  # 生产模式使用真实签名
    expiresSeconds: 300
```

## 安全考虑

### 敏感信息处理
- 敏感配置（如密钥）只存在于后端
- 前端只接收非敏感的运行配置
- 使用 HTTPS 传输配置数据

### 配置泄露防护
- 不在客户端代码中硬编码敏感信息
- 使用环境变量或安全的配置服务
- 定期轮换访问密钥

## 扩展指南

### 添加新配置项
1. 更新 `RuntimeConfig` 类型定义
2. 在 `runtimeConfig.ts` 中添加访问逻辑
3. 更新配置文件模板
4. 添加配置验证逻辑

### 配置项示例
```typescript
// 1. 扩展类型定义
interface RuntimeConfig {
  // ... 现有配置
  features: {
    enableComments: boolean;
    enableSharing: boolean;
    maxUploadSize: number;
  };
}

// 2. 添加访问函数
export function getFeatureConfig() {
  return runtimeConfig.features ?? {
    enableComments: true,
    enableSharing: true,
    maxUploadSize: 10 * 1024 * 1024 // 10MB
  };
}
```

## 最佳实践

### 1. 配置设计
- 使用嵌套对象组织相关配置
- 为每个配置项提供文档说明
- 设置合理的默认值

### 2. 错误处理
- 优雅处理配置缺失
- 提供有意义的错误信息
- 记录配置加载问题

### 3. 性能优化
- 避免在渲染中频繁读取配置
- 缓存配置访问结果
- 懒加载非关键配置

### 4. 测试策略
- 测试各种配置场景
- 模拟配置缺失情况
- 验证配置类型安全

## 调试技巧

### 查看当前配置
```javascript
// 在浏览器控制台中
console.log(window.runtimeConfig);
```

### 验证配置加载
```typescript
import runtimeConfig from './config/runtimeConfig';

console.log('API Base URL:', runtimeConfig.api.baseUrl);
console.log('Asset Mode:', runtimeConfig.assets.sign.mode);
```

### 配置问题排查
1. 检查 `public/config.yaml` 是否存在
2. 验证 YAML 格式是否正确
3. 确认配置同步脚本已执行
4. 检查浏览器控制台错误

## 与后端配置同步

### 共享配置模式
```yaml
# 根目录 config.yaml（完整配置）
api:
  baseUrl: "http://localhost:3001/api"

# 前端 public/config.yaml（安全子集）
api:
  baseUrl: "http://localhost:3001/api"
assets:
  strategy: "signedUrl"
```

### 配置分离原则
- **前端配置**：UI 相关、非敏感配置
- **后端配置**：服务端逻辑、敏感信息
- **共享配置**：前后端都需要的基础配置

## 未来扩展

### 配置热重载
```typescript
// 监听配置变化
window.addEventListener('config-update', (event) => {
  const newConfig = event.detail;
  // 更新运行时配置
});
```

### 多环境管理
```typescript
// 根据环境加载不同配置
const env = process.env.NODE_ENV || 'development';
const config = await loadConfig(`config.${env}.yaml`);
```

### 配置版本控制
```typescript
// 验证配置版本兼容性
if (config.version !== EXPECTED_CONFIG_VERSION) {
  console.warn('配置版本不匹配，可能需要迁移');
}
```