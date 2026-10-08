@echo off
title Logic Gates Web Server
cd /d "%~dp0"
echo Starting Logic Gates server...
python server.py --open
pause
