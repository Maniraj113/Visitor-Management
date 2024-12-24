@echo off
setlocal enabledelayedexpansion

:: Get current timestamp for commit message
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set TIMESTAMP=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%

:: Check if custom message provided
if "%~1"=="" (
    set "COMMIT_MSG=Auto-commit: Updates as of %TIMESTAMP%"
) else (
    set "COMMIT_MSG=%~1"
)

echo.
echo Git Automation Script
echo ====================
echo.

:: Navigate to project root
cd ..

:: Add all changes
echo Adding changes...
git add .

:: Commit changes
echo.
echo Committing with message: "%COMMIT_MSG%"
git commit -m "%COMMIT_MSG%"

:: Push to remote
echo.
echo Pushing to remote repository...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Successfully pushed changes to GitHub
) else (
    echo.
    echo ❌ Error pushing changes to GitHub
    echo Please resolve any conflicts and try again
)

endlocal 