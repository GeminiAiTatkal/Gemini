@echo off
echo Cleaning Temp Files...
del /q /f /s %TEMP%\*
del /q /f /s C:\Windows\Temp\*

echo Flushing DNS...
ipconfig /flushdns

echo Restarting Explorer...
taskkill /f /im explorer.exe
start explorer.exe

echo Done!
pause
