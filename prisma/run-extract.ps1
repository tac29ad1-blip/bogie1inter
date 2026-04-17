$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
$env:DATABASE_URL = "postgresql://postgres:neTjPazdRuwhsfQJYgYXTSyeWjeBzAvq@monorail.proxy.rlwy.net:14205/railway"
Set-Location "C:\ClaudeCode\Bogie1inter\bogie1inter"
node -e "require('ts-node').register({compilerOptions:{module:'CommonJS'}}); require('./prisma/extract-specs.ts')"
