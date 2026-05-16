# 个人主页维护指南

> 本仓库基于 Jekyll + [al-folio](https://github.com/alshedivat/al-folio) 主题，部署在 GitHub Pages（站点：<https://hongtaoxuu.github.io>）。
> 本文档只聚焦“日常维护”，更全面的主题配置说明请看 `README.md` / `CUSTOMIZE.md` / `FAQ.md` / `INSTALL.md`。

---

## 1. 项目结构速览

| 路径 | 作用 |
| --- | --- |
| `_config.yml` | 全站总配置（名字、URL、导航、主题、Jekyll 插件、scholar 设置、Jekyll exclude 列表等）。**几乎所有“开关”都在这里。** |
| `_pages/` | 每个一级页面的入口 Markdown。当前启用的有 `about.md`（首页 `/`）、`publications.md`、`news.md`、`cv.md`、`blog.md`、`books.md`、`404.md`。`repositories.md` / `projects.md` / `profiles.md` / `teaching.md` 默认已在 `_config.yml` 的 `exclude` 中关闭。 |
| `_bibliography/papers.bib` | **论文数据库**，BibTeX 格式。`/publications/` 页面 和 about 首页的“selected papers” 都从这里生成。 |
| `_bibliography/backup.bib` | 论文备份/草稿，已在 `_config.yml` exclude 中关闭，不会构建。 |
| `_news/` | **news 条目**，一个 `.md` 文件 = 一条 news。`/news/` 页面与 about 首页公告条会自动列出。 |
| `_data/` | 结构化数据：`socials.yml`（社交图标）、`cv.yml`（CV 内容）、`coauthors.yml`、`venues.yml`、`repositories.yml`。 |
| `_includes/` | 公共片段（`header.liquid`、`footer.liquid`、`news.liquid`、`selected_papers.liquid`、`social.liquid` 等）。 |
| `_layouts/` | 页面模板（`about.liquid` 即首页骨架；`bib.liquid` 渲染论文条目；`cv.liquid`、`page.liquid`、`post.liquid` 等）。 |
| `_posts/` | 博客文章（如果启用 blog 才会显示在 `/blog/`）。当前主要是主题自带示例文章。 |
| `_projects/` `_books/` | 项目卡片 / 书架；当前 `_pages/projects.md` 已 exclude，不会显示，但文件仍保留可随时启用。 |
| `_sass/`、`assets/css/` | 样式表（SCSS 编译后即站点 CSS）。 |
| `_plugins/` | 自定义 Ruby 插件（论文 details、Google Scholar 引用数、Inspire HEP 等）。 |
| `_scripts/` | 站点构建期会引用的脚本片段。 |
| `assets/img/` | **所有图片**。头像、论文预览图（`publication_preview/`）、书封面（`book_covers/`）都在此。 |
| `assets/pdf/` | 论文 PDF 实体文件。BibTeX 中 `pdf={xxx.pdf}` 字段引用的就是这里。 |
| `assets/{audio,video,json,jupyter,plotly,html}` | 各种富媒体资源。 |
| `Gemfile` / `bin/deploy` / `Dockerfile` 等 | 本地预览 / 手动部署相关，**日常更新不用碰**。 |

> 发布方式：改完文件 `git push` 到 `main` 分支后，GitHub Pages 会自动构建上线，通常 1–2 分钟生效，不需要本地跑 Jekyll。

---

## 2. 常见更新操作

### 2.1 增加一篇论文

论文统一写在 `_bibliography/papers.bib`，按 `year` 倒序自动排列。

**步骤：**

1. **放 PDF**：把论文 PDF 放到 `assets/pdf/`，例如 `assets/pdf/MyPaper.pdf`。
2. **放预览图**：把缩略图放到 `assets/img/publication_preview/`，例如 `MyPaper_overview.jpg`（建议 4:3 左右，宽度 ≥ 600px）。
3. **在 `_bibliography/papers.bib` 顶部新增一个条目**，参考现有 `Skrull` / `chunkflow` / `xu2025largescaleneuralnetworkquantum` 三个模板。最常用字段如下：

   ```bibtex
   @article{citekey_unique_2026,
     abbr={NeurIPS},                  % 左侧彩色徽标显示的会议/期刊缩写
     title={Paper Title (Optional Notes)},
     author={Hongtao Xu and Co Author and ...},
     year={2026},
     booktitle={Full venue name},    % 或者 journal={...}
     series={NeurIPS'26},
     url={https://arxiv.org/abs/xxxx.xxxxx},
     selected={true},                % true 才会出现在 about 首页的 selected papers
     annotation={* co-first author}, % 可选：作者名旁的脚注
     abstract={...摘要...},
     pdf={MyPaper.pdf},              % 相对于 assets/pdf/
     preview={MyPaper_overview.jpg}, % 相对于 assets/img/publication_preview/
   }
   ```

   - `selected={true}` ⇒ about 首页 “selected publications” 会出现这条；不写或 `false` 仅在 `/publications/` 出现。
   - `abbr` 控制左侧那个彩色徽标颜色见 `_data/venues.yml`（缺省也能显示）。
   - 共同一作请加 `*`，并用 `annotation={* co-first author}` 给出说明。
   - 想让一个条目临时不展示，注释掉（`% ...`）或把它挪到 `_bibliography/backup.bib`。

4. 保存 → `git push` → 等 GitHub Pages 自动上线。

### 2.2 更新 news（首页右下角公告条 + `/news/` 页面）

每条 news 是 `_news/` 下的一个独立 `.md` 文件。文件名只用于排序/识别，**真正排序看 `date` 字段**。

**新增一条 inline 短公告（最常用）**：在 `_news/` 新建 `accept_4.md`：

```markdown
---
layout: post
date: 2026-05-16 10:00:00-0800
inline: true
related_posts: false
---

One Paper is accepted by XXX'26! See you in YYY 🇨🇳!
```

要点：

- `inline: true` ⇒ 标题栏直接显示这一行，无独立详情页。
- `date` 必须带时区（参考现有文件 `-0400`/`-0800`），否则排序可能出错。
- 首页只显示最近若干条，数量由 `_pages/about.md` 中：

  ```yaml
  announcements:
    enabled: true
    scrollable: true   # 超过 limit 会出现滚动条
    limit: 5           # 显示多少条；留空显示全部
  ```

  控制；`/news/` 页面始终列出全部。

**新增一条带正文的长公告**：把 `inline` 改为 `false`，加 `title:`，正文写在 frontmatter 下面，会生成独立详情页。模板可参考 `_news/announcement_without_inline_backup.md`（当前已在 `_config.yml` exclude，不参与构建，纯作为示例保留）。

**删除一条 news**：直接删掉对应 `.md` 文件即可。

### 2.3 更新照片

按用途分三种：

**(a) 首页头像（about 页右上角）**

1. 把新照片放到 `assets/img/`，例如 `assets/img/hongtao_2026.jpg`。
2. 修改 `_pages/about.md` 顶部 frontmatter：

   ```yaml
   profile:
     align: right
     image: hongtao_2026.jpg     # ← 改这里，文件名相对 assets/img/
     image_circular: false       # true 会裁成圆形
     more_info: >
       <p>PhD student</p>
       <p>Haidian, Beijing, China</p>
   ```

3. 推荐尺寸：竖图，短边 ≥ 600px；构建时会自动生成多种响应式版本（webp 等）。
4. 旧照片（如 `hongtao_life.JPG`）可保留也可删除。

**(b) 论文预览图**

放到 `assets/img/publication_preview/`，在 `papers.bib` 对应条目里写 `preview={文件名.jpg}` 即可（见 3.1）。

**(c) 站点 favicon**

`_config.yml` 中：

```yaml
icon: 🍑   # 直接用 emoji 当 favicon
# 或者改成 assets/img/ 下的文件名，例如 icon: favicon.png
```

**(d) 其他装饰图 / 项目卡封面**

- Markdown 正文里插图：建议用 `{% include figure.liquid path="assets/img/xx.jpg" class="img-fluid" %}`，会自动响应式 + 懒加载。

---

## 3. 启用/关闭一个页面

显示与否由 `_config.yml` 的 `exclude:` 列表控制。当前已**关闭**：`repositories.md`、`teaching.md`、`projects.md`、`profiles.md`、`announcement_without_inline_backup.md`、`backup.bib`。

要打开任一页面：在 `_config.yml` 的 `exclude:` 中删掉对应行，并确认页面 frontmatter 里 `nav: true`（出现在导航栏）和 `nav_order: N`（顺序）。

---

## 4. 维护中容易踩的小坑

- **论文不显示在首页**：检查是否漏写 `selected={true}`；同时确保 `_pages/about.md` 顶部 `selected_papers: true`。
- **`date` 写错格式**：news / posts 的 date 必须是 `YYYY-MM-DD HH:MM:SS±ZZZZ`，否则该条会被静默排到底/丢失。
- **BibTeX citekey 重复**：两个条目用同一个 key 会导致后者被静默吞掉；新增条目时务必换一个唯一 key。
- **批量草稿**：可临时把整条放进 `_bibliography/backup.bib`，那个文件被 exclude，不影响线上展示。
- **push 后没生效**：等 1–2 分钟；仍没出来可去 GitHub 仓库 → Actions 看构建是否失败。
