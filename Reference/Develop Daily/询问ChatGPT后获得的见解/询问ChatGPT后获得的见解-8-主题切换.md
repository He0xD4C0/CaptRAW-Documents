## 8. 主题切换

建议使用 CSS 变量实现深浅主题：

```css
:root {
  --bg: #ffffff;
  --text: #111111;
  --card: #f4f4f4;
}

[data-theme="dark"] {
  --bg: #0f0f10;
  --text: #f4f4f4;
  --card: #1b1b1d;
}
```

切换时只改 `data-theme`，不要手动改一堆 class。

---
