@echo off
echo ========================================
echo Starting Hospital Management Backend
echo ========================================
echo.
echo Checking MySQL service...
sc query MySQL80 | find "RUNNING" >nul
if %errorlevel% == 0 (
    echo [OK] MySQL is running
) else (
    echo [WARNING] MySQL may not be running
    echo Attempting to start MySQL...
    net start MySQL80
)
echo.
echo Starting Spring Boot application...
echo Please wait, this may take a minute...
echo.
call mvnw.cmd spring-boot:run
