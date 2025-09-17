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
  rd /s /q src\apis\notification
  abp generate-proxy -t ng --api-name notification --entry-point src/apis/notification
  abp generate-proxy -t ng --api-name notification --entry-point src/apis/notification --module easyAbpPrivateMessaging
  abp generate-proxy -t ng --api-name notification --entry-point src/apis/notification --module easyAbpNotificationService
)

REM targetDir
set "targetDir=src\apis\notification\src"

REM
for /r "%targetDir%" %%f in (*service.ts) do (
  echo modify: %%f

  REM replace 'apiname=default' with 'apiname=Ticket'
  powershell -Command "(Get-Content -Path '%%f') -replace \"apiName = 'Default'\", \"apiName = 'notification'\" | Set-Content -Path '%%f'"
  powershell -Command "(Get-Content -Path '%%f') -replace \"apiName = 'EasyAbpPrivateMessaging'\", \"apiName = 'notification'\" | Set-Content -Path '%%f'"
  powershell -Command "(Get-Content -Path '%%f') -replace \"apiName = 'EasyAbpNotificationService'\", \"apiName = 'notification'\" | Set-Content -Path '%%f'"
)
for /r "%targetDir%" %%f in (*models.ts) do (
  echo modify: %%f

  REM replace 'apiname=default' with 'apiname=corporate'
  powershell -Command "(Get-Content -Path '%%f') -replace \"import type { Tkey } from '../models';\", \"\" | Set-Content -Path '%%f'"

)
echo check files
for /r "%targetDir%" %%f in (*service.ts) do (
  echo modify: %%f

  REM replace 'apiname=default' with 'apiname=Ticket'
  powershell -Command "(Get-Content -Path '%%f') -replace \"apiName = 'Default'\", \"apiName = 'notification'\" | Set-Content -Path '%%f'"
   powershell -Command "(Get-Content -Path '%%f') -replace \"apiName = 'EasyAbpPrivateMessaging'\", \"apiName = 'notification'\" | Set-Content -Path '%%f'"
  powershell -Command "(Get-Content -Path '%%f') -replace \"apiName = 'EasyAbpNotificationService'\", \"apiName = 'notification'\" | Set-Content -Path '%%f'"
)
for /r "%targetDir%" %%f in (*models.ts) do (
  echo modify: %%f

  REM replace 'apiname=default' with 'apiname=corporate'
  powershell -Command "(Get-Content -Path '%%f') -replace \"import type { Tkey } from '../models';\", \"\" | Set-Content -Path '%%f'"

)
echo done
endlocal

