@echo off
setlocal enabledelayedexpansion
set PATH=%PATH%;%USERPROFILE%\.dotnet\tools

REM 检查是否传入 --skip-proxy 参数
set "skipProxy=false"
for %%i in (%*) do (
  if "%%i"=="--skip-proxy" (
    set "skipProxy=true"
  )
)

REM 如果未传入 --skip-proxy 参数，则执行 abp generate-proxy
if "%skipProxy%"=="false" (
  rd /s /q src\apis\general
  abp generate-proxy -t ng --api-name general --entry-point src/apis\general
)

REM targetDir
set "targetDir=src\apis\general\src"

REM

for /r "%targetDir%" %%f in (*models.ts) do (
  echo modify: %%f
  powershell -Command "(Get-Content -Path '%%f') -replace \"import type { Tkey } from '../models';\", \"\" | Set-Content -Path '%%f'"

)
echo check files


for /r "%targetDir%" %%f in (*models.ts) do (
  echo modify: %%f
  powershell -Command "(Get-Content -Path '%%f') -replace \"import type { Tkey } from '../models';\", \"\" | Set-Content -Path '%%f'"

)
echo done
endlocal

