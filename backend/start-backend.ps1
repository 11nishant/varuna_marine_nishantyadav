$env:DATABASE_URL="postgresql://postgres:nishant@localhost:5432/fueleu"
Write-Host "Starting Backend Server on http://localhost:3001" -ForegroundColor Green
Write-Host "Database: $env:DATABASE_URL" -ForegroundColor Cyan
npm run dev

