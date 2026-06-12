@echo off
echo Starting Media Universe Server...
call npm install --omit=dev --no-fund --no-audit --loglevel=error
start http://localhost:5173
node server-dist/index.js
pause
