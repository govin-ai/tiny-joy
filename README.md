# 趣味小屋

中文静态内容网站：12 条原创笑话、12 条带来源的知识、关键词搜索、分类、浏览器收藏、随机选择器、随机整数和文字统计。

## 本地运行

需要 Python 3；在此目录执行 `python3 -m http.server 4173 --directory dist`，访问 http://127.0.0.1:4173 。不需要安装依赖。不要直接双击 index.html，ES Modules 需要 HTTP 服务。

## 验证

Node.js 22 环境下执行 `npm test`，使用 Node 内置测试运行器，无额外依赖。

故障验证服务器：`python3 tests/qa_server.py`，访问 `http://127.0.0.1:4174/?fault=write`；可用 fault 为 read、write、corrupt、future、copy。它仅在本地 HTTP 响应中注入故障模拟，生产 dist 不含这些脚本。测试端口与真实预览端口隔离。

## 使用与数据

点击爱心收藏或取消，复制按钮复制正文。收藏仅保存在当前浏览器、当前网站源中；本地预览与上线地址的收藏互不相通。存储不可用时回退到当前会话并明确提示。工具输入不主动传出浏览器。

随机选择器自动去除重复项，随机数包含两端，文字按 Unicode 码点统计，不等于视觉字形数量。详细口径见界面。知识来源与核对日期见 SOURCES.md。

## 规范与交付

按 Spec Kit 的 constitution → specify/clarify → plan → tasks/analyze → implement/converge 阶段推进。用户已于 2026-10-17 确认开始制作。项目规范位于 `.specify/memory/constitution.md` 及 `specs/001-fun-house/`；本次为按流程生成并维护文档，未安装或执行 Spec Kit CLI。

视觉：暖白底色、鼠尾草绿、浅杏色卡片，自绘 SVG 小屋；无外部字体与图片依赖。

## 单文件版本

同级 fun-house.html 为本次生成的便携版本，包含全部样式、内容与逻辑，可下载后直接用浏览器打开。它由 dist 的源文件拼接生成，修改源码后需重新生成。浏览器对 file URL 的本地收藏与剪贴板限制各不相同，失败时页面会提示。
