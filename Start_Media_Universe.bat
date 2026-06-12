@echo off
echo Starting Media Universe Server...
call npm install --production
start http://localhost:5173
node server-dist/index.js
pause
