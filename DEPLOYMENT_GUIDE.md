# Deploying Hugo JSON Parser Site to Google Cloud Storage

## 📋 Prerequisites

1. Google Cloud Platform account
2. Google Cloud SDK installed
3. Billing enabled on your GCP project

## 🚀 Deployment Steps

### Step 1: Install Google Cloud SDK

Download and install from: https://cloud.google.com/sdk/docs/install

Or using PowerShell (Windows):
```powershell
# Download the installer
Invoke-WebRequest -Uri "https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe" -OutFile "GoogleCloudSDKInstaller.exe"

# Run the installer
.\GoogleCloudSDKInstaller.exe
```

### Step 2: Initialize and Authenticate

```powershell
# Login to Google Cloud
gcloud auth login

# Set your project (replace YOUR_PROJECT_ID with your actual project ID)
gcloud config set project YOUR_PROJECT_ID

# Install the gsutil component
gcloud components install gsutil
```

### Step 3: Create a Cloud Storage Bucket

```powershell
# Create a bucket (bucket names must be globally unique)
gsutil mb -l US gs://YOUR_BUCKET_NAME

# Or for multi-regional (better for websites)
gsutil mb -l US-EAST1 gs://YOUR_BUCKET_NAME

# Enable website hosting
gsutil web set -m index.html -e 404.html gs://YOUR_BUCKET_NAME
```

### Step 4: Build Your Hugo Site

```powershell
# Build the production version
hugo --minify --gc

# This creates a 'public' directory with all static files
```

### Step 5: Deploy to Google Cloud Storage

```powershell
# Upload all files to the bucket
gsutil -m rsync -r -d public\ gs://YOUR_BUCKET_NAME

# Set public read permissions
gsutil -m acl set -R -a public-read gs://YOUR_BUCKET_NAME
```

### Step 6: Access Your Website

Your website will be available at:
```
http://YOUR_BUCKET_NAME.storage.googleapis.com
```

## 🌐 Custom Domain Setup (Optional)

### Step 1: Add Custom Domain in GCP Console

1. Go to Cloud Storage → Your Bucket → Website Configuration
2. Add your custom domain
3. Verify domain ownership in Google Search Console

### Step 2: Add DNS Records

Add a CNAME record in your DNS provider:
```
Type: CNAME
Name: www (or @)
Value: c.storage.googleapis.com
TTL: 3600
```

## 🔄 Automated Deployment Script

Create a deploy.ps1 file:

```powershell
# deploy.ps1
$env:Path += ";$HOME\go\bin"

# Build the site
Write-Host "Building Hugo site..." -ForegroundColor Green
hugo --minify --gc

# Deploy to GCS
Write-Host "Deploying to Google Cloud Storage..." -ForegroundColor Green
gsutil -m rsync -r -d public\ gs://YOUR_BUCKET_NAME

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Visit: http://YOUR_BUCKET_NAME.storage.googleapis.com" -ForegroundColor Cyan
```

Run it:
```powershell
.\deploy.ps1
```

## 💰 Cost Estimation

Google Cloud Storage hosting is very affordable:
- Storage: $0.020 per GB per month
- Egress (US): $0.12 per GB
- Operations: $0.05 per 10,000 requests

For a small static site, expect to pay **less than $1 per month**.

## 📊 CDN Setup (Optional but Recommended)

For better performance, add Cloud CDN:

```powershell
# Create a load balancer with CDN
gcloud compute url-maps create YOUR_SITE_URL_MAP \
    --default-service YOUR_BACKEND_BUCKET

gcloud compute target-http-proxies create YOUR_PROXY \
    --url-map YOUR_SITE_URL_MAP

gcloud compute forwarding-rules create YOUR_FORWARDING_RULE \
    --global \
    --target-http-proxy YOUR_PROXY \
    --ports 80
```

## 🔒 HTTPS Setup (Free with Google)

1. Go to Google Cloud Console
2. Navigate to Load Balancing
3. Create HTTPS load balancer
4. Google will provision a free SSL certificate
5. Point your domain to the load balancer IP

## 📝 CI/CD with GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GCS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.160.1'
      
      - name: Build
        run: hugo --minify --gc
      
      - name: Deploy to GCS
        uses: GoogleCloudPlatform/github-actions/setup-gcloud@master
        with:
          version: 'latest'
      
      - name: Authenticate
        run: |
          echo "${{ secrets.GCP_SA_KEY }}" > key.json
          gcloud auth activate-service-account --key-file=key.json
      
      - name: Upload
        run: gsutil -m rsync -r -d public/ gs://YOUR_BUCKET_NAME
```

## ✅ Post-Deployment Checklist

- [ ] Site is accessible at the bucket URL
- [ ] All pages load correctly
- [ ] CSS and JS files are loading
- [ ] JSON data is displaying properly
- [ ] Search and filter features work
- [ ] Mobile responsive design works
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled (if applicable)
- [ ] Cache headers set correctly

## 🔧 Troubleshooting

### Issue: 403 Forbidden
```powershell
# Fix permissions
gsutil -m acl set -R -a public-read gs://YOUR_BUCKET_NAME
```

### Issue: Files not updating
```powershell
# Force re-upload with cache busting
gsutil -m rsync -r -d -x ".*\\.map$" public\ gs://YOUR_BUCKET_NAME
```

### Issue: Custom domain not working
- Verify DNS CNAME record is correct
- Check domain verification in GCP Console
- Wait for DNS propagation (can take up to 48 hours)

## 🎯 Quick Deploy Commands

```powershell
# One-command deployment (after initial setup)
hugo --minify --gc; gsutil -m rsync -r -d public\ gs://YOUR_BUCKET_NAME
```

## 📚 Resources

- [Google Cloud Storage Hosting Guide](https://cloud.google.com/storage/docs/hosting-static-website)
- [Hugo Deployment Documentation](https://gohugo.io/hosting-and-deployment/)
- [Google Cloud CDN](https://cloud.google.com/cdn)

---

**Note**: Replace `YOUR_BUCKET_NAME` and `YOUR_PROJECT_ID` with your actual values throughout this guide.
