@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  LAB/OFICIO - Laboratorio personal de diseno

echo  Abriendo la biblioteca en tu navegador...
where node >nul 2>&1
if not errorlevel 1 goto run_node
where py >nul 2>&1
if not errorlevel 1 goto run_py
where python >nul 2>&1
if not errorlevel 1 goto run_python
echo.
echo No se encontro Node.js ni Python.
echo Podes abrir index.html directamente, pero el progreso entre paginas
 echo puede no compartirse en algunos navegadores.
pause
exit /b 1
:run_node
start "" "http://127.0.0.1:8765/index.html"
node servidor.js
pause
exit /b
:run_py
start "" "http://127.0.0.1:8765/index.html"
py -3 -m http.server 8765 --bind 127.0.0.1
pause
exit /b
:run_python
start "" "http://127.0.0.1:8765/index.html"
python -m http.server 8765 --bind 127.0.0.1
pause
