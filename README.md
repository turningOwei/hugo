# Hugo JSON Parser - Static Website

A fast, modern static website built with Hugo that parses and displays JSON data with interactive features.

![Hugo](https://img.shields.io/badge/Hugo-v0.160.1-ff4088?style=flat-square&logo=hugo)
![Go](https://img.shields.io/badge/Go-1.25+-00ADD8?style=flat-square&logo=go)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

## 🚀 Features

- **JSON Data Parsing** - Automatically parses JSON files from the `/data` directory
- **Multiple Display Formats** - Card view, table view, and raw JSON display
- **Interactive Search** - Real-time search and filtering
- **Department Filtering** - Filter data by categories
- **Statistics Dashboard** - Automatic data aggregation and statistics
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Live Reload** - Instant preview during development
- **Fast Build** - Deploys in seconds with Hugo

## 📋 Prerequisites

- **Hugo** v0.160.1 or later
- **Go** 1.25.0 or later (for building Hugo)
- **Git** (optional, for version control)

## 🛠️ Installation

### 1. Install Hugo

**Using Go (Recommended):**
```powershell
$env:GOPROXY="https://goproxy.cn,direct"
$env:CGO_ENABLED="0"
go install github.com/gohugoio/hugo@latest
```

**Using Scoop:**
```powershell
scoop install hugo
```

**Using Chocolatey:**
```powershell
choco install hugo-extended
```

### 2. Clone or Download This Project

```powershell
cd f:\vscodeWorkspace\hugo
```

## 🎯 Local Development

### Start Development Server

```powershell
# Add Hugo to PATH (if needed)
$env:Path += ";$HOME\go\bin"

# Start the server
hugo server --buildDrafts
```

The site will be available at: **http://localhost:1313**

### Build for Production

```powershell
hugo --minify --gc
```

The built site will be in the `public/` directory.

## 📁 Project Structure

```
hugo/
├── content/              # Content files
│   └── json-data.md     # JSON data page
├── data/                # JSON data files
│   └── employees.json   # Sample employee data
├── layouts/             # Hugo templates
│   ├── _default/
│   │   ├── baseof.html  # Base template
│   │   ├── list.html    # List page template
│   │   └── single.html  # Single page template
│   └── index.html       # Homepage template
├── static/              # Static assets
│   ├── css/
│   │   └── style.css    # Stylesheet
│   └── js/
│       └── main.js      # JavaScript
├── hugo.toml            # Hugo configuration
├── deploy.ps1           # Deployment script
└── build.bat            # Build script
```

## 🎨 Customization

### Adding Your Own JSON Data

1. Create a JSON file in the `/data` directory:
```json
// data/products.json
[
  {
    "id": 1,
    "name": "Product 1",
    "price": 29.99,
    "category": "Electronics"
  }
]
```

2. Access it in templates:
```go
{{ range .Site.Data.products }}
  <div>{{ .name }} - ${{ .price }}</div>
{{ end }}
```

### Modifying Templates

Edit files in the `layouts/` directory to change the structure and appearance.

### Styling

Edit `static/css/style.css` to customize colors, fonts, and layout.

## 🌐 Deployment

### Deploy to GitHub Pages (Recommended - FREE!) ⭐

**GitHub Actions 自动部署（已配置好）**

```powershell
# 1. 初始化并推送仓库
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main

# 2. 在 GitHub 仓库 Settings → Pages 启用 GitHub Actions
# 3. 完成！自动部署到 https://YOUR_USERNAME.github.io/YOUR_REPO/
```

✅ **已自动配置**: `.github/workflows/deploy.yml` 工作流文件
✅ **完全免费**: 无限带宽，自动 HTTPS
✅ **自动部署**: 每次推送自动构建和部署

**手动部署脚本**:
```powershell
# 编辑 deploy-to-github-pages.ps1 填入您的用户名和仓库名
.\deploy-to-github-pages.ps1
```

### Deploy to Google Cloud Storage

**使用自动化脚本**:
```powershell
# 1. 安装 Google Cloud SDK
# 2. 登录: gcloud auth login
# 3. 编辑 deploy.ps1 填入桶名称和项目 ID
# 4. 运行:
.\deploy.ps1
```

**手动部署**:
```powershell
# 构建
hugo --minify --gc

# 上传到 GCS
gsutil -m rsync -r -d public\ gs://YOUR_BUCKET_NAME
gsutil -m acl set -R -a public-read gs://YOUR_BUCKET_NAME
```

### Deploy to Other Platforms

- **Netlify**: `netlify deploy --prod`
- **Vercel**: `vercel --prod`
- **AWS S3**: `aws s3 sync public/ s3://your-bucket/`

详细部署指南请查看:
- [GitHub Pages 部署](https://gohugo.io/hosting-and-deployment/hosting-on-github/)
- [Google Cloud Storage 部署](DEPLOYMENT_GUIDE.md)

## 📊 Sample Data

The project includes sample employee data in `data/employees.json`:

```json
[
  {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com",
    "age": 28,
    "department": "技术部",
    "skills": ["Go", "Python", "JavaScript"]
  }
]
```

## 🔧 Hugo Configuration

Edit `hugo.toml`:

```toml
baseURL = 'https://your-domain.com/'
languageCode = 'en-us'
title = 'Your Site Title'
```

## 📝 Scripts

### build.bat
Builds the production site:
```powershell
.\build.bat
```

### deploy.ps1
Automated deployment to Google Cloud Storage:
```powershell
.\deploy.ps1
```

## 🎯 Pages

1. **Homepage** (`/`) - Card view with search and filters
2. **JSON Data** (`/json-data/`) - Table view and raw JSON display

## 🔍 Features Detail

### Search Functionality
- Real-time search as you type
- Searches across all fields
- Case-insensitive matching

### Department Filter
- Click to filter by department
- Visual active state
- Reset to show all

### Statistics
- Total count
- Category distribution
- Auto-calculated from JSON data

## 🐛 Troubleshooting

### Hugo not found
```powershell
$env:Path += ";$HOME\go\bin"
```

### Port already in use
```powershell
hugo server --port 1314
```

### Changes not showing
- Hard refresh browser (Ctrl+F5)
- Restart Hugo server

## 📚 Documentation

- [Hugo Official Docs](https://gohugo.io/documentation/)
- [Google Cloud Storage Hosting](https://cloud.google.com/storage/docs/hosting-static-website)
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Detailed deployment guide
- [QUICK_START.md](QUICK_START.md) - Quick start guide

## 💰 Hosting Costs

**Google Cloud Storage** (Estimated):
- Storage: $0.02/GB/month
- Bandwidth: $0.12/GB
- **Typical small site**: <$1/month

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - feel free to use this project for any purpose.

## 🙏 Acknowledgments

- [Hugo](https://gohugo.io/) - The world's fastest static site generator
- [Google Cloud Platform](https://cloud.google.com/) - Cloud hosting platform

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Hugo and Go**
