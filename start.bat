@echo off
title ForensicVault 2026 — SIH26150 Code Sentinels
color 0B
chcp 65001 >nul
cls

echo ===============================================================================
echo   ______                               _      _    _             _ _   
echo  ^|  ____^|                             (_)    ^| ^|  ^| ^|           ^| ^| ^|  
echo  ^| ^|__ ___  _ __ ___ _ __  ___ _  ___  _ _ __^| ^|  ^| ^| __ _ _   _^| ^| ^|_ 
echo  ^|  __/ _ \^| '__/ _ \ '_ \/ __^| ^|/ __^|^| ^| '__^| ^|  ^| ^|/ _` ^| ^| ^| ^| ^| __^|
echo  ^| ^| ^| (_) ^| ^| ^|  __/ ^| ^| \__ \ ^| (__ ^| ^| ^|   \ \_/ / (_^| ^| ^|_^| ^| ^| ^|_ 
echo  ^|_^|  \___/^|_^|  \___^|_^| ^|_^|___/_^|\___^|_^|_^|_^|    \___/ \__,_^|\__,_^|_^|\__^|
echo ===============================================================================
echo   SMART INDIA HACKATHON 2026 ^| PROBLEM STATEMENT: SIH26150
echo   ORGANIZATION: MINISTRY OF HOME AFFAIRS / CYBER FORENSICS
echo   TEAM: CODE SENTINELS [ID: 192057]
echo ===============================================================================
echo.

:: Navigate to script root directory
cd /d "%~dp0"

echo [1/4] Checking Python environment...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in your system PATH!
    echo Please install Python 3.10+ and enable "Add Python to PATH".
    echo Download: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do echo       Detected %%i - OK.
echo.

echo [2/4] Verifying required forensic dependencies...
python -c "import flask, reportlab, werkzeug, PIL" >nul 2>&1
if errorlevel 1 (
    echo       Some dependencies are missing. Installing required packages...
    python -m pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies automatically.
        echo Please run: pip install -r requirements.txt
        pause
        exit /b 1
    )
    echo       Dependencies installed successfully - OK.
) else (
    echo       All dependencies [Flask, ReportLab, Pillow, Werkzeug] verified - OK.
)
echo.

echo [3/4] Checking Forensic Database and Evidence Store...
if not exist "forensic_tool.db" (
    echo       Database not found. Initialising forensic database with mock evidence...
    python backend\seed_data.py
    echo       Database seeded successfully - OK.
) else (
    echo       forensic_tool.db verified - OK.
)
echo.

echo [4/4] Launching ForensicVault 2026 Engine...
echo.
echo   =============================================================
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        echo   Local  (This PC) : http://127.0.0.1:5000/
        echo   Network (LAN/WiFi): http://%%b:5000/
        goto :found
    )
)
:found
echo   Theme Support: Cyber Dark and Forensic Lab Light Mode
echo   Legal Standard: Section 63 BSA 2023 Digital Certificate
echo   =============================================================
echo.
echo All devices on the same WiFi can open the Network URL!
echo Launching your default web browser in 2 seconds...
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://127.0.0.1:5000/"

echo Server running. Press Ctrl+C in this window to stop.
echo.
python app.py

pause
