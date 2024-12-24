@echo off
setlocal enabledelayedexpansion

:: Set default values
set "ACTION=%~1"
set "BRANCH=%~2"
set "MESSAGE=%~3"

:: Get timestamp
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set TIMESTAMP=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%

:: Show help if no arguments
if "%~1"=="" (
    echo Usage:
    echo   git_manage.bat push [branch] [message]
    echo   git_manage.bat create-branch [branch-name]
    echo   git_manage.bat merge [source-branch] [target-branch]
    exit /b 1
)

:: Navigate to project root
cd ..

:: Handle different actions
if "%ACTION%"=="push" (
    :: Default branch to main if not specified
    if "%BRANCH%"=="" set "BRANCH=main"
    
    :: Default commit message if not provided
    if "%MESSAGE%"=="" (
        set "MESSAGE=Auto-commit: Updates as of %TIMESTAMP%"
    )

    echo Pushing to %BRANCH%...
    git add .
    git commit -m "%MESSAGE%"
    git push origin %BRANCH%

) else if "%ACTION%"=="create-branch" (
    if "%BRANCH%"=="" (
        echo Branch name required
        exit /b 1
    )
    
    echo Creating new branch: %BRANCH%
    git checkout -b %BRANCH%
    git push -u origin %BRANCH%

) else if "%ACTION%"=="merge" (
    if "%BRANCH%"=="" (
        echo Source branch required
        exit /b 1
    )
    if "%MESSAGE%"=="" (
        echo Target branch required
        exit /b 1
    )

    echo Merging %BRANCH% into %MESSAGE%...
    git checkout %MESSAGE%
    git merge %BRANCH%
    git push origin %MESSAGE%
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Operation completed successfully
) else (
    echo.
    echo ❌ Operation failed
    echo Please check the error messages above
)

endlocal 