@echo off
echo ===================================================
echo           Starting StepUp.in Full Stack
echo ===================================================
echo Backend: http://127.0.0.1:8000
echo Frontend: http://127.0.0.1:5173
echo ===================================================

start "StepUp Django Backend" cmd /k "cd /d E:\Stepup\backend && python manage.py runserver 127.0.0.1:8000"
timeout /t 3 /nobreak >nul
start "StepUp React Frontend" cmd /k "cd /d E:\Stepup\frontend && npm run dev -- --host 127.0.0.1 --port 5173"

echo Servers started successfully!
pause
