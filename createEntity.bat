@echo off
echo  %CD%.
echo 1. modeling
echo 2. entity
set /p choice=please choose an option (1 or 2): 
if %choice%==1 goto modeling
if %choice%==2 goto entity
:modeling
set /p userInput=please input entity name: 
%CD%\ufetool.exe generate nameObject %userInput% -d %CD% --skip-ui
:entity
set /p userInput=please input entity name: 
%CD%\ufetool.exe generate crud %userInput% -d %CD% --skip-ui
pause