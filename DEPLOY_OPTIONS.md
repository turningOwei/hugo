# 部署方案选择指南

## GitHub Pages（推荐）

### 优势
- 完全免费
- 自动 HTTPS
- GitHub Actions 自动部署
- 全球 CDN
- 无限带宽

### 快速部署
```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

访问: https://YOUR_USERNAME.github.io/YOUR_REPO/

---

## Google Cloud Storage

### 优势
- 更大的存储空间
- 企业级服务
- 更精细的控制

### 快速部署
```powershell
.\deploy.ps1
```

访问: http://YOUR_BUCKET.storage.googleapis.com

---

## 建议

对于 JSON 解析网站，推荐 GitHub Pages！
- 已自动配置 GitHub Actions
- 推送代码即可自动部署
- 完全免费且简单
