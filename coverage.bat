@echo off
setlocal enabledelayedexpansion

rem check dotnet-coverage 
set "coverageInstalled=false"
for /f "tokens=*" %%a in ('dotnet tool list --global') do (
    set "line=%%a"
    if "!line:dotnet-coverage=!" neq "!line!" (
        set "coverageInstalled=true"
    )
)

if "%coverageInstalled%"=="false" (
    echo dotnet-coverage  installing...
    dotnet tool install --global dotnet-coverage
)

rem check dotnet-reportgenerator-globaltool 
set "reportGeneratorInstalled=false"
for /f "tokens=*" %%a in ('dotnet tool list --global') do (
    set "line=%%a"
    if "!line:dotnet-reportgenerator-globaltool=!" neq "!line!" (
        set "reportGeneratorInstalled=true"
    )
)

if "%reportGeneratorInstalled%"=="false" (
    echo dotnet-reportgenerator-globaltool installing...
    dotnet tool install --global dotnet-reportgenerator-globaltool
)


echo collection test data...
dotnet-coverage collect "dotnet test   .\test\Molex.UFE.EntityFrameworkCore.Tests  --filter FullyQualifiedName~EntityFrameworkCore.Applications" -f xml -o  c:\temp\coverage.xml

echo Generating report...
reportgenerator -reports:c:\temp\coverage.xml -targetdir:c:\temp\coveragereport -reporttypes:Html

echo Coverage report has been generated, path is: coveragereport\index.html

endlocal
pause


