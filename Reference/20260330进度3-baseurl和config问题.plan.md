总体思路





以仓库根目录的 config.yaml 作为“唯一配置源”。



为了安全：前端只能拿到去敏后的配置（例如移除 database），部署时把 public 子集同步到 frontend/public/config.yaml，前端运行时 fetch('/config.yaml') 并解析 YAML。



对象存储/图片等资源在数据层存 assetUuid（不关心对象存储 ObjectName）。



硬控制方案：对象存储桶使用“私有”，前端不直接拼接对象存储访问地址；由后端鉴权生成短时 signed URL 返回给前端。



axios 的 api.baseUrl 改成依赖 runtime config，而不是 REACT_APP_API_URL 写死默认值。

数据流（前端运行时）

flowchart LR
  A[浏览器] -->|fetch('/config.yaml')| B[Config YAML]
  B --> C[前端 js-yaml 解析]
  C --> D[runtimeConfig store]
  D --> E[assets解析策略]
  E -->|signedUrl| G[GET/POST /api/assets/sign(kind,assetUuid)]
  G --> H[signedUrl]
  H --> I[img.src / avatar.src]
  D --> G[axios 请求前注入 api.baseUrl]
  G --> H[后端 API]

配置文件结构（建议）





仓库根目录：/config.yaml





api.baseUrl



assets.strategy（publicPrefix | signedUrl）



assets.publicBaseUrl（仅当 publicPrefix/开发渲染需要时使用）



assets.sign.mode（real | mock；对象存储未搭好时建议先用 mock，确保前端流程与 API-side 权限行为可跑通）



objectStorage（endpoint/bucket 等，仅后端使用）



community.url（如果你也希望把页面里的外部链接统一化）



database.url（只后端用，复制到 public 时会剔除）



前端可访问的：frontend/public/config.yaml





只包含 api / assets / community 等 public 字段（database 与对象存储私有桶敏感字段剔除）

代码落点（按模块）





前端运行时加载配置





新增：frontend/src/config/runtimeConfig.ts





类型 RuntimeConfig



loadRuntimeConfig()：fetch + js-yaml parse



getRuntimeConfig()：读取 store（加载前用安全 fallback）



新增：frontend/src/components/ConfigGate.tsx





在 App 内部先加载配置，加载完成后才渲染 Router



修改：frontend/src/App.tsx





用 ConfigGate 包裹路由与页面



统一拼接资源 URL





新增/更新：frontend/src/utils/assetUrl.ts（以及 useSignedAssetUrl.ts 可选）





入口函数例如 getAssetUrl(kind, assetUuid)：返回 string | undefined



若 assets.strategy=publicPrefix：由 assetUuid 映射到 ${assets.publicBaseUrl}/...placeholder...（仅用于开发/未接入阶段）



若 assets.strategy=signedUrl：assetUuid -> 从缓存取 signedUrl；缓存缺失则调用 GET/POST /api/assets/sign(kind,assetUuid) 获取 signedUrl



修改：frontend/src/components/ui/UserAvatar.tsx





src 传入 assetUuid 时自动 resolve（或通过 hook 获取 signedUrl 后再渲染 img）



修改：





frontend/src/components/articles/ArticleCard.tsx：article.coverImage/avatar 走 {kind,assetUuid} -> signedUrl/或 publicPrefix 映射



frontend/src/components/home/ArticleTimeline.tsx：同上



frontend/src/components/home/BannerCarousel.tsx：banner.image 走 {kind,assetUuid} -> signedUrl/或 publicPrefix 映射



替换 mock 数据里的硬编码 URL 为 assetUuid





修改数据文件：





frontend/src/data/articles.json



frontend/src/data/banners.json



frontend/src/data/notices.json



转换方式（保持当前界面仍能显示的关键点）：





把现有 https://via.placeholder.com/... URL 先“替换为可追踪的 assetUuid”，并在 assets/sign 的开发 seed/mock 映射到这些 placeholder 图片



保持一套稳定映射，这样在 MinIO 接入初期也能联调 UI 渲染与私密资源拒绝逻辑。



替换 mock service 里生成的头像 URL





修改：





frontend/src/services/authService.ts（login/register/getCurrentUser 返回的 avatar）



frontend/src/services/articleService.ts（createArticle 里 author.avatar）



把 avatar 从完整 URL 改成 assetUuid（例如 asset_uuid_user_avatar_mock_1）



让 axios baseURL 使用 runtime config





修改：frontend/src/services/baseService.ts





现在：process.env.REACT_APP_API_URL || 'http://localhost:3001/api'



改为：在请求拦截器里每次注入 config.baseURL = getRuntimeConfig().api.baseUrl



这样 config.yaml 换环境时不需要重建。



同步/生成 frontend/public/config.yaml（去敏）





新增：frontend/scripts/sync-config.js





读取 ../../config.yaml



取出 public 子集（丢弃 database 等敏感字段）



写入 frontend/public/config.yaml



修改：frontend/package.json





加上 prestart、prebuild：执行 node scripts/sync-config.js

关键风险与处理





安全：如果把 database.url 直接放进 frontend/public/config.yaml 会泄露给浏览器，所以必须剔除（本计划已按“剔除，仅后端使用”实现）。



硬控制一致性：在 assets.sign.mode=mock 时可以“模拟”私密资源不可访问的 API 行为，但无法保证对象存储层面真的不可直接访问；最终仍需要私有桶 + 后端鉴权 + signedUrl（或后端代理转发）。



网络与性能：signedUrl 可能带来额外请求；建议做批量签名与缓存（本计划已加入 frontend-asset-sign-caching）。

你可以接受/不接受的范围





本计划主要覆盖“图片/头像/banners 的 assetUuid -> signedUrl/prefix 映射”和 axios api.baseUrl；外链（如 hub.captraw.com）也可以一并改成从 config.yaml 取（如果你希望“所有链接统一 base url”更彻底）。

