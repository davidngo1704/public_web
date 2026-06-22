$ErrorActionPreference = "Stop"

$env:NODE_OPTIONS = "--openssl-legacy-provider"
$env:CI = "true"

Write-Host "=== Build React app ===" -ForegroundColor Cyan
npm run build

Write-Host "=== Deploy to Firebase Hosting ===" -ForegroundColor Cyan
firebase deploy --only hosting

Write-Host ""
Write-Host "Website public:" -ForegroundColor Green
Write-Host "  https://thanhdai1704.web.app/"
Write-Host "  https://thanhdai1704.firebaseapp.com/"
