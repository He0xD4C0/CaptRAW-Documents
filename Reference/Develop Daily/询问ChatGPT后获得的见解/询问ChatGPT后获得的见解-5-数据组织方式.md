## 5. 数据组织方式

建议目录结构如下：

```text
content/
  articles/
    hello-world.md
    another-post.md
  notices/
    maintenance.md
  users/
    he0xd4c0.md
  banners/
    banner-01.md

public/
  images/
  avatars/

src/
  components/
  pages/
  lib/
  styles/
```

### 索引文件

再维护一个索引层，例如：

```json
{
  "articles": [
    {
      "slug": "hello-world",
      "title": "Hello World",
      "date": "2026-03-30",
      "tags": ["公告", "测试"],
      "cover": "/images/cover.jpg"
    }
  ]
}
```

这样目录页和搜索页不需要全量读 Markdown，速度会好很多。

---
