# Quick Start Guide - Deploy to Google Cloud

## 🚀 Fast Track Deployment (5 Minutes)

### Prerequisites
- Google Cloud Platform account
- Google Cloud SDK installed

### Step-by-Step Instructions

#### 1️⃣ Install Google Cloud SDK (if not installed)
```powershell
# Download and install
Invoke-WebRequest -Uri "https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe" -OutFile "$env:TEMP\gcloud-installer.exe"
Start-Process "$env:TEMP\gcloud-installer.exe" -Wait
```

#### 2️⃣ Login to Google Cloud
```powershell
gcloud auth login
```

#### 3️⃣ Create a Project (or use existing)
```powershell
# Create new project
gcloud projects create YOUR_PROJECT_ID --name="Hugo JSON Site"

# Or list existing projects
gcloud projects list
```

#### 4️⃣ Enable Billing
Go to: https://console.cloud.google.com/billing

#### 5️⃣ Deploy Your Site

**Option A: Use the automated script**
```powershell
# Edit deploy.ps1 and update these values:
# $BUCKET_NAME = "your-unique-bucket-name"
# $PROJECT_ID = "your-project-id"

.\deploy.ps1
```

**Option B: Manual commands**
```powershell
# Set project
gcloud config set project YOUR_PROJECT_ID

# Build site
$env:Path += ";$HOME\go\bin"
hugo --minify --gc

# Create bucket
gsutil mb -l US-EAST1 gs://YOUR_BUCKET_NAME

# Configure website
gsutil web set -m index.html -e 404.html gs://YOUR_BUCKET_NAME

# Upload files
gsutil -m rsync -r -d public\ gs://YOUR_BUCKET_NAME

# Set permissions
gsutil -m acl set -R -a public-read gs://YOUR_BUCKET_NAME
```

#### 6️⃣ Access Your Site
```
http://YOUR_BUCKET_NAME.storage.googleapis.com
```

---

## 📋 Pre-Deployment Checklist

- [ ] Google Cloud account created
- [ ] Google Cloud SDK installed
- [ ] Logged in with `gcloud auth login`
- [ ] Project created and billing enabled
- [ ] Bucket name chosen (must be globally unique)
- [ ] Site tested locally with `hugo server`

---

## 💡 Bucket Naming Tips

Bucket names must be:
- Globally unique
- 3-63 characters
- Lowercase letters, numbers, hyphens
- Start with a letter

**Good examples:**
- `hugo-json-site-2026`
- `my-employee-data-site`
- `json-parser-demo`

---

## 🔧 Common Issues & Solutions

### Issue: "Bucket already exists"
**Solution**: Bucket names are globally unique. Try a different name.

### Issue: "Permission denied"
**Solution**: 
```powershell
gsutil -m acl set -R -a public-read gs://YOUR_BUCKET_NAME
```

### Issue: "Site not loading"
**Solution**: 
- Check that index.html exists in the bucket
- Verify website hosting is configured
- Wait 1-2 minutes for propagation

---

## 🌐 Custom Domain Setup

### 1. Verify Domain Ownership
Go to: https://search.google.com/search-console

### 2. Add CNAME Record
In your DNS provider (GoDaddy, Cloudflare, etc.):
```
Type: CNAME
Name: www
Value: c.storage.googleapis.com
TTL: 3600
```

### 3. Map Domain to Bucket
```powershell
gsutil web set -m index.html -e 404.html gs://YOUR_BUCKET_NAME
```

Then in GCP Console:
- Cloud Storage → Your Bucket
- Website Configuration → Add Custom Domain

---

## 💰 Cost Calculator

**Estimated monthly costs for small site:**
- Storage (100MB): $0.002
- Bandwidth (1GB): $0.12
- Operations (10,000): $0.005
- **Total: ~$0.13/month** 🎉

---

## 🔄 Update Your Site

Every time you make changes:
```powershell
# Rebuild and deploy
hugo --minify --gc
gsutil -m rsync -r -d public\ gs://YOUR_BUCKET_NAME
```

Or just run:
```powershell
.\deploy.ps1
```

---

## 📊 Monitor Your Site

### View bucket contents
```powershell
gsutil ls gs://YOUR_BUCKET_NAME
```

### Check storage usage
```powershell
gsutil du -sh gs://YOUR_BUCKET_NAME
```

### View access logs
Enable logging in GCP Console → Cloud Storage → Settings

---

## 🎯 Next Steps After Deployment

1. ✅ **Test your site** - Visit the bucket URL
2. ✅ **Set up custom domain** - For professional appearance
3. ✅ **Enable HTTPS** - Free SSL certificate via Google
4. ✅ **Add Cloud CDN** - For faster global delivery
5. ✅ **Set up monitoring** - Track usage and costs
6. ✅ **Configure backups** - Version your bucket

---

## 📚 Useful Commands

```powershell
# List all buckets
gsutil ls

# View bucket website config
gsutil web get gs://YOUR_BUCKET_NAME

# Delete bucket (be careful!)
gsutil rm -r gs://YOUR_BUCKET_NAME

# Check file permissions
gsutil acl get gs://YOUR_BUCKET_NAME/index.html
```

---

## 🆘 Need Help?

- [Google Cloud Storage Docs](https://cloud.google.com/storage/docs)
- [Hugo Deployment Guide](https://gohugo.io/hosting-and-deployment/)
- [GCP Console](https://console.cloud.google.com)

---

**Remember**: Replace `YOUR_BUCKET_NAME` and `YOUR_PROJECT_ID` with your actual values!
