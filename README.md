# Kuang的博客

基于 React 19 + TypeScript + Vite + Tailwind CSS 构建的高品质个人技术博客，具备完整的归档侧边栏、代码高亮、全文搜索、暗色模式与全响应式布局。

## 本地运行

项目推荐使用 [Bun](https://bun.sh/)（亦可使用 Node.js / npm）：

```bash
# 安装依赖
bun install
# 或者使用 npm install

# 启动本地开发服务
bun run dev
# 或者使用 npm run dev
```

在浏览器中打开 `http://localhost:3000` 即可实时预览。

---

## 部署到 GitHub Pages

项目已配置 GitHub Actions 自动化工作流（位于 `.github/workflows/deploy.yml`），无需手动打包上传，每次提交推送到 GitHub 后将自动触发构建并部署。

### 部署操作指引：

1. **新建 GitHub 仓库**：
   - 登录 GitHub，创建一个新仓库，仓库名设为 `rippykuang.github.io`。
   - 仓库公开性选择 **Public**（公开）。

2. **推送代码至 GitHub**：
   在项目根目录下打开终端，执行以下命令：
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for github pages"
   git branch -M main
   git remote add origin https://github.com/rippykuang/rippykuang.github.io.git
   git push -u origin main
   ```

3. **配置 GitHub Pages 发布源**：
   - 打开 GitHub 上的 `rippykuang.github.io` 仓库页面，点击右上角的 **Settings**。
   - 在左侧菜单中找到并点击 **Pages**。
   - 在 **Build and deployment** 下的 **Source** 下拉框中，选择 **GitHub Actions**。

4. **查看发布效果**：
   - 切换到仓库的 **Actions** 标签页，可查看部署工作流的运行状态。
   - 构建完成后，访问 `https://rippykuang.github.io/` 即可浏览你的个人技术博客！
