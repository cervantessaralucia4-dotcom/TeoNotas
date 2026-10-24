@echo off
title TeoNotas - Cuaderno de Reuniones y Asambleas
echo =======================================================
echo          TeoNotas - Servidor de Aplicacion
echo =======================================================
echo.
echo Iniciando servidor en http://localhost:3000 ...
echo Presiona Ctrl+C para detener el servidor.
echo.
start http://localhost:3000
node server.js
pause
