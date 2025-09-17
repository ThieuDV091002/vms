echo off
echo  %CD%.
echo 1. add migration
echo 2. update database
set /p choice=please choose an option (1 or 2): 
if %choice%==1 goto migration
if %choice%==2 goto update-database
:migration
set /p userInput=please input migration name: 
%USERPROFILE%\.dotnet\tools\dotnet-ef.exe migrations add "%userInput%" --project .\src\Molex.UFE.EntityFrameworkCore --startup-project .\src\Molex.UFE.EntityFrameworkCore --verbose --context UFEDbContext
exit
:update-database
set /p userInput=please input connection string(enter use default): 
if "%userInput%"=="" (
    echo update database use default connection
    %USERPROFILE%\.dotnet\tools\dotnet-ef.exe database update --project .\src\Molex.UFE.EntityFrameworkCore --startup-project .\src\Molex.UFE.EntityFrameworkCore --verbose --context UFEDbContext
) else (
    echo update database use specified connection
    %USERPROFILE%\.dotnet\tools\dotnet-ef.exe database update --project .\src\Molex.UFE.EntityFrameworkCore --startup-project .\src\Molex.UFE.EntityFrameworkCore --connection "%userInput%" --verbose --context UFEDbContext
)
exit
pause