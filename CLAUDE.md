# AI 通用助手竞品分析 — 开发规范

## 项目概述
四款 AI 通用助手（ChatGPT、Claude、豆包、Kimi）的竞品分析静态网页。
面向 AI PM 岗位面试展示，阅读体验优先。

## 技术栈
- 纯 HTML + CSS + JS，零依赖，零构建步骤
- 部署目标：阿里云 OSS 香港节点 + 自定义域名
- 内容来源：`project/` 目录下的 Notion 导出 Markdown

## 目录结构
```
suc/
├── index.html             # 封面/首页
├── pages/
│   ├── selection.html     # 1. 入选逻辑
│   ├── overview.html      # 2. 产品概况
│   ├── model.html         # 3. 模型层（能力对比）
│   ├── application.html   # 4. 应用层（能力对比）
│   └── thoughts.html      # 5. 思考
├── css/
│   ├── tokens.css         # 设计令牌（颜色、字体、间距等 CSS 变量）
│   ├── base.css           # 重置 + 中文排版基础
│   ├── components.css     # 可复用组件（表格、引用块、卡片等）
│   ├── layout.css         # 页面布局 + 导航 + 响应式
│   └── animations.css     # 动画效果
├── js/
│   ├── nav.js             # 导航逻辑（高亮、折叠、移动端菜单）
│   └── scroll-animate.js  # 滚动触发动画
├── assets/
│   └── images/            # 图片资源
└── project/               # Notion 原始导出（只读，不修改）
```

## HTML 模板
每个页面必须遵循以下结构：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题 — AI 通用助手分析</title>
  <link rel="stylesheet" href="../css/tokens.css">
  <link rel="stylesheet" href="../css/base.css">
  <link rel="stylesheet" href="../css/components.css">
  <link rel="stylesheet" href="../css/layout.css">
  <link rel="stylesheet" href="../css/animations.css">
</head>
<body>

  <!-- 手绘风 SVG 滤镜（必须放在 body 顶部） -->
  <svg class="sketch-defs" aria-hidden="true">
    <defs>
      <filter id="sketch">
        <feTurbulence type="turbulence" baseFrequency="0.018" numOctaves="3" seed="5" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
  </svg>

  <!-- 移动端汉堡菜单（手绘风） -->
  <button class="nav-toggle" aria-label="打开导航">
    <span class="nav-toggle-icon"></span>
  </button>
  <div class="nav-overlay"></div>

  <nav class="site-nav" id="siteNav">
    <!-- 由 nav.js 动态填充 -->
  </nav>

  <main class="content">
    <article class="article">
      <!-- 页面内容 -->

      <!-- 页面跳转按钮（放在 article 末尾） -->
      <nav class="page-nav">
        <a class="page-nav-link" href="上一页链接">
          <span class="page-nav-label">上一页</span>
          <span class="page-nav-title">上一页名称</span>
        </a>
        <a class="page-nav-link page-nav-link--next" href="下一页链接">
          <span class="page-nav-label">下一页</span>
          <span class="page-nav-title">下一页名称</span>
        </a>
      </nav>
    </article>
  </main>

  <script src="../js/nav.js"></script>
  <script src="../js/scroll-animate.js"></script>
</body>
</html>
```
index.html 的 CSS/JS 路径不带 `../` 前缀（在根目录）。

### 页面作用域
应用层及其子页面（application.html、app-*.html、multimodal.html）的 `<body>` 加 `class="app-section"`，用于限定仅对应用层生效的样式（如首列固定宽度 150px）。

## CSS 规范

### 命名约定
- 布局容器：`.site-nav`, `.content`, `.article`
- 组件：`.comp-` 前缀，如 `.comp-table`, `.comp-quote`, `.comp-card`
- 动画：`.anim-` 前缀，如 `.anim-fade-in`, `.anim-bar-grow`
- 状态：`.is-` 前缀，如 `.is-active`, `.is-visible`
- 工具类：`.u-` 前缀，如 `.u-text-center`

### 颜色和视觉参数
所有值必须引用 `tokens.css` 中的 CSS 变量，禁止硬编码。

### 间距变量
`--space-*` 只有以下档位：1,2,3,4,5,6,8,10,12,16,20,24。不存在 7,9,11,13,14,15 等值，使用不存在的变量会静默失败（值为空，样式不生效）。

### 中文排版
- 正文字号：17px
- 行高：1.8-2.0（中文需要更大行高）
- 段间距：用 margin-bottom，不用空行
- 粗体标题和紧随的正文不要分成两个 `<p>`，用 `<br>` 接在同一个 `<p>` 内，避免段间空行
- 字体栈见 tokens.css

## 组件约定

### 对比表格 `.comp-table`
研究风格式：标题行下方粗线(2px #1A1A18) + 细行线(1px #EEEDEA)，无顶线无底线无外框无底色。
- 表头：16px、bold、`var(--color-text)`，无 uppercase，无 sticky
- 首列：15px、weight 650、`var(--color-bg)` 背景
- 其他单元格：15px、weight 550、`#3a3a36`
- 首列不加 `<strong>`：CSS 已通过 `td:first-child` 设置字重 650，`<strong>` 会覆盖为 700 与表头撞车
- 并排表格用 `.comp-table-pair` > `.comp-table-col` 布局
- 首列无需特殊强调时加 `.comp-table--plain-first`：重置首列为普通列格式（weight 550、color #3a3a36、无 sticky、无背景）
- **rowspan 双 bug**：表格使用 `rowspan` 时会触发两个问题，都需要处理：
  1. **首列样式错位**：续行的 `td:first-child` 实际不在首列，但会命中首列 CSS（加粗、背景）。修复：给这些单元格加 `class="cell-plain"`
  2. **hover 只亮一行**：`tr:hover` 无法跨行高亮。修复：给同组 `<tr>` 加 `data-row-group="xxx"`，页面底部加 JS 监听 mouseenter/mouseleave 切换 `.is-row-hover`
- **补充产品行 `.row-supplementary`**：Codex 等非独立产品在表格中用淡底色（`#f0efeb`）区分，hover 时加深到 `var(--color-bg-tertiary)`。仅在应用层/多模态页面生效（`body.app-section` 作用域）。用法：`<tr class="row-supplementary">`
- **row-supplementary + rowspan 组合**：当补充产品行同时使用 `rowspan` 时，hover 需要额外处理——CSS 已通过 `.row-supplementary.is-row-hover` 选择器覆盖，同时用 `td.cell-plain` 选择器让续行的首格（实际不在首列）也参与 hover 高亮。首列（产品名）仍通过 `:not(:first-child)` 排除。

### 注释块 `.comp-note`
表格下方的补充说明，左侧 2px `var(--color-border)` 边线。
- 仅用于不带 `*` 的"注："类说明
- 带 `*` 的注释必须做成 hover tooltip（见下方）

### Hover 注释 `.bench-tooltip-trigger`
带 `*` 的注释一律做成 hover tooltip，不用 `comp-note` 附注形式。
- 写法：`<span class="bench-tooltip-trigger">文字*<span class="bench-tooltip">注释内容</span></span>`
- 删除对应的 `comp-note` 块
- 如果 tooltip 默认向下弹出会被遮挡，加 `bench-tooltip--left` 让气泡出现在左侧（固定宽度 280px，自动换行）

### 分析结论 `.comp-quote`
- 无左边线，保留背景色（`var(--color-quote-bg)`），统一圆角
- 字体参数和正文一致：`p` weight 400、`strong` weight 700
- 底部间距 `var(--space-16)`，与下方内容拉开距离
- 多段落必须用 `<div>` 包裹：组件用了 `display: flex`，直接放多个 `<p>` 会横排。写法：`<div class="comp-quote"><div><p>…</p><p>…</p></div></div>`

### 手绘风标签 `.comp-sketch-label`
用于表格/图表标题（h3/h4），手绘风底板 + 白色文字。
- 浅暖灰底板（#5C5955），`::after` + `filter: url(#sketch)` 实现手绘风
- 不规则圆角 `14px 8px 16px 10px`，微旋转 `rotate(-0.5deg)`
- `margin-top: var(--space-20)`（80px），与上方内容拉开距离
- `h2 + .comp-sketch-label` 间距特殊处理为 `var(--space-4)`（16px）
- **复合标题**：当一个维度下有多个子话题，且每个子话题都有独立表格时，不单独设一个 h3 作为父级，而是把父子关系压进同一个 h3 手绘风标签里，用 `→` 连接（如"本地数据 → 本地文件"）。每个子话题各占一个 h3，层级扁平，不引入 h4。适用场景：一个大维度拆成 2-3 个并列子话题，每个子话题内容量足以独立成节，但又不值得用 h2 抬高层级。

### 页面跳转按钮 `.page-nav`
每个页面底部的上一页/下一页导航，使用手绘风。
- **位置**：`<article>` 末尾，`margin-top: 80px` + `padding-top: 40px`，上方有分隔线，左右两端对齐
- **结构**：`<nav class="page-nav">` 内含两个 `<a class="page-nav-link">`，右侧加 `page-nav-link--next`
- **底板**：黑色 #1C1C1A，通过 `::after` + `filter: url(#sketch)` 实现手绘风
- **圆角**：左按钮 `16px 10px 18px 8px`，右按钮 `10px 18px 8px 16px`
- **旋转**：左 `rotate(-0.5deg)`，右 `rotate(0.5deg)`，hover 回正 + 上浮 + 阴影
- **文字**：全白色加粗，"上一页/下一页" 12px，页面名称 16px
- **只有下一页时**：加 `.page-nav--end` 右对齐（首页用法）

### 汉堡菜单按钮 `.nav-toggle`
移动端（≤1024px）显示的导航展开按钮，使用手绘风。
- 白色底板，`::after` + `filter: url(#sketch)` 实现手绘背景
- 不规则圆角 `16px 10px 18px 8px`，轻微旋转 `rotate(-0.7deg)`
- hover 回正上浮 + 阴影
- 三条横线（`.nav-toggle-icon` 的 `::before` / `::after`）不受滤镜影响

### 章节标题
- h1：页面标题，每页仅一个
- h2：大节标题
- h3：小节标题
- h4：表格/图表标题

## 导航系统
- 左侧固定导航栏（280px），显示全部章节结构，递归树形渲染（lv1~lv4）
- 当前页面高亮
- 页内二级标题锚点跳转
- "能力对比"为非链接标签（`<span>`），其余为 `<a>` 链接
- "定时任务"和"多模态生成"归入应用层子级"补充维度"下（lv3 → lv4）
- 移动端（≤1024px）：汉堡菜单展开侧栏（手绘风按钮）

## 图片说明
`assets/images/` 中的图片目前是效果图/占位图。
后续可能改为代码实现（SVG/CSS/JS 动画），不要在页面结构中对图片路径做硬依赖。
用语义化的容器包裹：
```html
<figure class="comp-figure" id="iceberg-diagram">
  <!-- 当前可放 <img>，后续可替换为 SVG/代码实现 -->
</figure>
```

## 动画规范
- 动画服务于内容表达，不是装饰
- 首选 CSS 动画 + Intersection Observer 触发
- 如需复杂时间线动画，可引入 GSAP
- 所有动画必须尊重 `prefers-reduced-motion`
- 关键可视化动画的容器用 `.anim-scene` 标记

## 品牌色参考
不要品牌色

## 视觉风格（双轨制）

本项目采用两套互补的视觉风格：

### 机构研究风（正文页面）
用于所有正文内容页（selection / overview / model / application / thoughts）：
- **配色**：白底 #FFFFFF，浅灰 #F7F6F3，边线 #E5E3DE，正文 #4D4D49，标题 #1A1A18
- **强调色**：深红 #7C1D1D，仅用于公式高亮和文字选中色，不作主色调
- **字体**：标题 Noto Serif SC（宋体），正文 Noto Sans SC（黑体），数据 Source Serif 4
- **表格**：粗顶线(2px #1A1A18) + 细行线(1px #EEEDEA) + 底线，表头大写+字间距，无外框无底色
- **结论块**：上下细线框定，无背景色，粗体首句为核心论点
- **公式块**：浅底(#F7F6F3) + 上下线
- **内容区**：max-width 700px 居中，大量留白
- **参考文件**：demo-clean.html

### 手绘风（插图、动画可视化）
用于首页树状图、分析框架图、公式可视化等元素。

#### 核心技术：SVG feTurbulence 滤镜 + CSS 伪元素

**1. SVG 滤镜定义**（每个页面顶部放一份）
```html
<svg class="sketch-defs" aria-hidden="true">
  <defs>
    <filter id="sketch">
      <feTurbulence type="turbulence" baseFrequency="0.018" numOctaves="3" seed="5" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
</svg>
```

**2. 文字与背景必须分层**（最关键的一条）
- 背景/边框放在 `::after` 伪元素上，`filter: url(#sketch)` 只作用于 `::after`
- 文字在主元素上，通过 `isolation: isolate` + `z-index: -1` 保持清晰
- **禁止**把 `filter: url(#sketch)` 直接加在含文字的元素上（会导致文字变形）
```css
.node {
  position: relative;
  isolation: isolate;  /* 建立层叠上下文 */
}
.node::after {
  content: '';
  position: absolute;
  inset: 0;
  background: #5C5955;
  border: 2.8px solid rgba(0,0,0,0.08);
  border-radius: 16px 10px 18px 8px;
  filter: url(#sketch);  /* 滤镜只在这里 */
  z-index: -1;           /* 文字在上，背景在下 */
}
```

**3. 不规则圆角**
- 四角用不同数值，避免机械感：`border-radius: 16px 10px 18px 8px`
- 不同节点用不同组合变体：`10px 18px 8px 16px`、`8px 14px 16px 10px` 等

**4. 轻微旋转**
- 各节点加微小旋转：`transform: rotate(-0.7deg)` / `rotate(0.5deg)`
- 打破规整感，制造有机感

**5. 纯符号（=、×等）**
- 符号本身就该有手绘感，可直接在元素上加 `filter: url(#sketch)`

**6. 节点配色**
- 深浅暖灰填充（d0=#1C1C1A 到 d4=#B5B1A9），白色文字
- 连接线：2.8px 粗线

**注意：CC preview 不支持 `::after` + SVG filter，手绘风效果需在 Chrome 中验证。**

- **参考文件**：demo.html（已锁定，不可修改）、index.html 树状图

### 风格搭配原则
- 正文页面整体用研究风，嵌入的可视化图表用手绘风
- tokens.css 以研究风为主基调
- 深红 #7C1D1D 是两套风格共用的唯一强调色

## 跨会话开发须知
1. 每次新会话，先读本文件和 `css/tokens.css`
2. 新增组件样式写入 `components.css`，不要内联或新建 CSS 文件
3. `layout.css` 和 `components.css` 存在重复的 page-nav 样式，修改时两边都要同步
4. 完成一个页面后在本文件的「开发进度」节更新状态
6. project/ 下的 Markdown 措辞原样搬入 HTML，不润色不改写
7. 验证前端效果用 Chrome 浏览器，不用 CC preview（不支持 `::after` + SVG filter）
8. 颜色全部引用 tokens.css 变量，禁止硬编码（手绘风节点配色 #1C1C1A、#5C5955 等是唯一例外）
9. 每次做页面先讨论对齐细节，用户确认后才写代码
10. 不考虑移动端适配，只做桌面端

## 模型层页面结构须知

1. **子页面内容已填充**：`model-info.html`、`model-benchmark.html`、`model-arena.html`、`multimodal.html` 内容已完成。
2. **nav.js 已更新的链接映射**：三个模型层子页面指向独立 HTML（不再是 `model.html#anchor`），多模态生成指向 `multimodal.html`，index.html 树状图链接已同步。
3. **页面跳转链路已确定**：model.html 的"下一页"指向 model-info.html（不是 application.html），子页面 model-info → model-benchmark → model-arena 依次串联，model-arena 的"下一页"待定。
4. **手绘风跳转按钮组件可复用**：`.model-nav-btn` 样式（浅暖灰底 + 手绘风 + 竖向堆叠 + 右侧 → 箭头）已在 components.css 中，按钮上方有引导文字"点击下方卡片进入对应章节"（15px、`var(--color-text-secondary)`）。如果应用层页面也需要类似的子页面入口，可以复用，但 class 名带 `model-` 前缀，需要考虑是否重命名为更通用的名字。
5. **"能力对比 → 模型层"式标题的 SVG 箭头做法**：横线用填充矩形（而非 stroke 线条）才能和箭头尖部视觉重量匹配。如果应用层页面也用"能力对比 → 应用层"，可以复用 `.model-title` 和 `.model-title-arrow`，同样需要考虑重命名。
6. **h1 与正文的间距**：model.html 用 `.model-title` 的 `margin-bottom: 80px` 拉开距离，其他页面 h1 下方紧跟 h2（自带 `margin-top: 80px`）所以不需要。新页面如果 h1 后面直接跟 `<p>`，也需要类似处理。

## 开发进度
| 页面 | 状态 | 备注 |
|------|------|------|
| 骨架 & 规范 | 已完成 | tokens, base, components, layout, animations, nav, scroll-animate |
| index.html | 已完成 | 封面 + 树状图分析框架 |
| selection.html | 已完成 | 入选逻辑，含公式可视化（手绘风）、附录折叠、版本表格 |
| overview.html | 已完成 | 产品概况，含手绘风时间轴、并排订阅表格、结论块、核心用户群文字 |
| model.html | 已完成 | 入口页，含引言 + 榜单选取原则 + 三个手绘风跳转按钮 |
| model-info.html | 已完成 | 旗舰模型基本信息 |
| model-benchmark.html | 已完成 | 旗舰模型 benchmark 数据，含 15 张手绘风柱状图 + 分析结论 |
| model-arena.html | 已完成 | LM Arena，10 张排名表格 + 结论块 |
| multimodal.html | 已完成 | 多模态生成，含对比表 + comp-note（Kimi 说明）+ 三段结论块 |
| application.html | 已完成 | 入口页，含冰山图 + 行动边界图（手绘风 SVG）+ 跳转按钮 |
| app-memory.html | 已完成 | 记忆系统，含获取方式/记忆层级/透明度三组表格 + 结论块 |
| app-private-info.html | 已完成 | 用户私有信息，含用户级设置/项目级上下文与skill/本地文件/本地应用/云端应用五组表格 + 结论块 |
| app-realtime.html | 已完成 | 实时信息，含联网搜索/权威数据库/浏览器级访问三组表格 + rowspan 分组 hover |
| app-sandbox.html | 已完成 | 内部沙箱及其产物，含沙箱网络安全控制（rowspan 分组 hover）/文件类产物/云端浏览器三组表格 + 结论块 |
| app-external.html | 已完成 | 外部系统及其产物，含特定应用（本地/云端）+ 通用环境（文件夹/浏览器/用户电脑）五组表格 + 结论块，用户电脑表格含 rowspan + row-supplementary 组合 |
| app-scheduled.html | 已完成 | 定时任务，含定时任务对比表（豆包 tooltip）+ 合并结论块（两段） |
| thoughts.html | 已完成 | 思考，含阶梯图 + 周活对比条形图（手绘风）+ 脚注 |
| 动画可视化 | 未开始 | |
