## 1. 总体架构

### 内容层

每篇内容都用 Markdown 文件存放，额外用 frontmatter 描述结构信息。

```md
---
title: "文章标题"
slug: "article-title"
date: "2026-03-30"
author: "He0xD4C0"
tags: ["AI", "摄影", "日志"]
cover: "/images/cover.jpg"
summary: "文章摘要"
type: "article"
---
# 一级标题
正文内容...
```

公告、文章、横幅、个人主页卡片，都可以统一成“带元数据的 Markdown / JSON 内容条目”。

### 展示层

前端只负责：

* 读取内容索引
* 按路由渲染
* 解析 Markdown
* 生成目录、摘要、时间线、标签
* 处理主题切换、下拉菜单、横幅轮播、懒加载

---
