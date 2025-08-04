# 🎨 苹果风格PPT演示系统

一个完全符合苹果官方设计语言的现代化网页PPT系统，采用极简主义美学和流畅的交互体验。

## ✨ 核心特性

### 🎭 设计系统
- **苹果标准配色**: 使用官方色彩 `#f5f5f7` `#000` `#0071e3`
- **SF Pro字体系列**: 完整的字体层级和字间距规范
- **16:9黄金比例**: 严格遵循1280×720px标准尺寸
- **毛玻璃效果**: backdrop-filter实现的现代视觉效果
- **统一圆角系统**: 12px/8px/4px三级圆角规范

### 🚀 交互功能
- **多种翻页方式**: 
  - 键盘控制 (方向键、空格、Home/End)
  - 鼠标滚轮
  - 触摸滑动
  - 点击导航按钮
  - 页码指示器点击
- **智能禁用状态**: 首页/末页按钮自动禁用
- **流畅动画过渡**: 0.6s页面切换 + 元素入场动画
- **快捷键帮助**: 按 `?` 显示完整快捷键说明

### 📱 响应式设计
- **完美适配**: 桌面、平板、手机全设备支持
- **自适应布局**: 保持16:9比例的同时适配不同屏幕
- **触摸优化**: 移动端手势操作体验优化
- **性能优化**: 减少动画和过渡效果（遵循用户偏好）

## 🎯 页面类型

1. **标题页**: 渐变文字效果 + 毛玻璃标签
2. **功能展示**: 3列网格布局 + 悬停效果
3. **图片展示**: 85%最大宽度 + 阴影效果
4. **信息框展示**: 4px左边框 + 三种状态色
5. **数据统计**: 进度条动画 + 数字展示
6. **总结页**: 要点列表 + CTA按钮

## 🛠️ 技术架构

### 前端技术栈
```
HTML5 + CSS3 + Vanilla JavaScript
Inter字体 (SF Pro替代方案)
CSS Grid + Flexbox 布局
CSS动画 + 过渡效果
```

### 浏览器支持
- Chrome 88+
- Safari 14+
- Firefox 88+
- Edge 88+

## 🚀 快速开始

### 本地运行
```bash
# 克隆项目
git clone <repository-url>

# 进入目录
cd apple-style-ppt

# 使用任意HTTP服务器运行
python -m http.server 8000
# 或
npx serve .
# 或
live-server
```

### 直接使用
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- PPT内容 -->
    <script src="script.js"></script>
</body>
</html>
```

## ⌨️ 快捷键说明

| 按键 | 功能 |
|------|------|
| `←` `↑` | 上一页 |
| `→` `↓` `空格` | 下一页 |
| `Home` | 第一页 |
| `End` | 最后一页 |
| `Esc` | 退出全屏 |
| `?` | 显示帮助 |

## 🎨 设计规范

### 配色系统
```css
/* 主色调 */
--bg-primary: #f5f5f7;    /* 苹果标准浅灰 */
--bg-container: #000;      /* 纯黑色容器 */
--text-primary: #fff;      /* 主要文字 */
--text-secondary: #ccc;    /* 次要文字 */
--accent-blue: #0071e3;    /* 苹果蓝 */

/* 功能色 */
--info-blue: #0071e3;      /* 信息提示 */
--warning-orange: #FF9500; /* 警告提示 */
--success-green: #34C759;  /* 成功提示 */
```

### 字体层级
```css
/* 标题页主标题 */
font-size: 56px; font-weight: 700; letter-spacing: -0.03em;

/* 内容页标题 */
font-size: 36px; font-weight: 700; letter-spacing: -0.02em;

/* 副标题 */
font-size: 28px; font-weight: 600;

/* 正文 */
font-size: 18px; font-weight: 300; line-height: 1.5;
```

### 间距系统
```css
/* 页面内边距 */
padding: 40px 60px;

/* 元素间距 */
gap: 20px; /* 大间距 */
gap: 12px; /* 中间距 */
gap: 8px;  /* 小间距 */

/* 圆角系统 */
border-radius: 12px; /* 容器 */
border-radius: 8px;  /* 元素 */
border-radius: 4px;  /* 小元素 */
```

## 🔧 API接口

### PPT实例方法
```javascript
// 获取PPT实例
const ppt = window.applePPT;

// 页面控制
ppt.nextSlide();          // 下一页
ppt.prevSlide();          // 上一页
ppt.goToSlide(3);         // 跳转到第3页

// 状态查询
ppt.getCurrentSlideInfo(); // 获取当前页面信息

// 自动播放
ppt.startAutoPlay(5000);   // 开始自动播放(5秒间隔)
ppt.stopAutoPlay();        // 停止自动播放

// 通知系统
ppt.showNotification('消息内容', 'success');

// 全屏控制
ppt.toggleFullscreen();    // 切换全屏
ppt.exitFullscreen();      // 退出全屏
```

### 事件监听
```javascript
// 监听页面切换事件
document.addEventListener('slideChange', (e) => {
    console.log('当前页面:', e.detail.currentSlide);
    console.log('总页数:', e.detail.totalSlides);
});
```

## 📦 文件结构

```
apple-style-ppt/
├── index.html          # 主页面文件
├── styles.css          # 样式文件
├── script.js           # 交互脚本
└── README.md           # 说明文档
```

## 🎯 设计检查清单

- ✅ 苹果标准色彩系统
- ✅ SF Pro字体系列 (Inter替代)
- ✅ 统一圆角规范 (12px/8px/4px)
- ✅ 毛玻璃效果 (backdrop-filter)
- ✅ 16:9标准比例
- ✅ 信息框4px左边框一致性
- ✅ 同类元素80%最大宽度一致性
- ✅ 流畅动画过渡 (0.2s-0.6s)
- ✅ 多种翻页控制方式
- ✅ 响应式设计适配
- ✅ 可访问性支持
- ✅ 键盘导航支持

## 🔮 未来规划

- [ ] 主题自定义系统
- [ ] 动态添加/删除幻灯片
- [ ] 导出PDF功能
- [ ] 演讲者备注功能
- [ ] 实时协作编辑
- [ ] 云端同步存储

## 📄 许可证

MIT License - 自由使用和修改

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

---

**享受苹果风格的极简美学体验！** 🍎✨