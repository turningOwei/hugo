# Hugo JSON Parser - Google Cloud Storage Deployment Script
# Run this script after completing the initial GCP setup

$ErrorActionPreference = "Stop"

# Configuration - UPDATE THESE VALUES
$BUCKET_NAME = "your-unique-bucket-name"  # Replace with your bucket name
$PROJECT_ID = "your-project-id"           # Replace with your GCP project ID

# Add Hugo to PATH
$env:Path += ";$HOME\go\bin"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Hugo to Google Cloud Storage Deploy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if gcloud is installed
Write-Host "Step 1: Checking Google Cloud SDK..." -ForegroundColor Yellow
try {
    $gcloudVersion = gcloud --version 2>&1
    Write-Host "✓ Google Cloud SDK is installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Google Cloud SDK not found!" -ForegroundColor Red
    Write-Host "Please install from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Step 2: Check authentication
Write-Host ""
Write-Host "Step 2: Checking authentication..." -ForegroundColor Yellow
try {
    $account = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>&1
    if ($account) {
        Write-Host "✓ Authenticated as: $account" -ForegroundColor Green
    } else {
        Write-Host "✗ Not authenticated. Run: gcloud auth login" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Authentication check failed" -ForegroundColor Red
    exit 1
}

# Step 3: Set project
Write-Host ""
Write-Host "Step 3: Setting GCP project..." -ForegroundColor Yellow
try {
    gcloud config set project $PROJECT_ID | Out-Null
    Write-Host "✓ Project set to: $PROJECT_ID" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to set project" -ForegroundColor Red
    exit 1
}

# Step 4: Build Hugo site
Write-Host ""
Write-Host "Step 4: Building Hugo site..." -ForegroundColor Yellow
try {
    hugo --minify --gc
    Write-Host "✓ Hugo site built successfully" -ForegroundColor Green
    Write-Host "  Output directory: public/" -ForegroundColor Gray
} catch {
    Write-Host "✗ Hugo build failed" -ForegroundColor Red
    exit 1
}

# Step 5: Create bucket (if doesn't exist)
Write-Host ""
Write-Host "Step 5: Checking bucket..." -ForegroundColor Yellow
try {
    $bucketExists = gsutil ls -b "gs://$BUCKET_NAME" 2>&1
    if ($bucketExists -match "BucketNotFoundException") {
        Write-Host "Creating bucket: $BUCKET_NAME..." -ForegroundColor Yellow
        gsutil mb -l US-EAST1 "gs://$BUCKET_NAME"
        Write-Host "✓ Bucket created" -ForegroundColor Green
    } else {
        Write-Host "✓ Bucket already exists: $BUCKET_NAME" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Bucket check failed" -ForegroundColor Red
    exit 1
}

# Step 6: Configure website hosting
Write-Host ""
Write-Host "Step 6: Configuring website hosting..." -ForegroundColor Yellow
try {
    gsutil web set -m index.html -e 404.html "gs://$BUCKET_NAME"
    Write-Host "✓ Website hosting configured" -ForegroundColor Green
} catch {
    Write-Host "⚠ Website hosting configuration failed (may already be set)" -ForegroundColor Yellow
}

# Step 7: Deploy files
Write-Host ""
Write-Host "Step 7: Uploading files to Google Cloud Storage..." -ForegroundColor Yellow
try {
    gsutil -m rsync -r -d public\ "gs://$BUCKET_NAME"
    Write-Host "✓ Files uploaded successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Upload failed" -ForegroundColor Red
    exit 1
}

# Step 8: Set public permissions
Write-Host ""
Write-Host "Step 8: Setting public read permissions..." -ForegroundColor Yellow
try {
    gsutil -m acl set -R -a public-read "gs://$BUCKET_NAME"
    Write-Host "✓ Public permissions set" -ForegroundColor Green
} catch {
    Write-Host "✗ Permission setting failed" -ForegroundColor Red
    exit 1
}

# Step 9: Display deployment info
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your website is now live at:" -ForegroundColor Green
Write-Host "http://$BUCKET_NAME.storage.googleapis.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Visit the URL above to verify your site" -ForegroundColor White
Write-Host "  2. Set up a custom domain (optional)" -ForegroundColor White
Write-Host "  3. Enable Cloud CDN for better performance" -ForegroundColor White
Write-Host "  4. Set up HTTPS with Google-managed SSL" -ForegroundColor White
Write-Host ""
Write-Host "To redeploy, simply run this script again!" -ForegroundColor Green
Write-Host ""
