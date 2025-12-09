@echo off
chcp 65001 > nul
setlocal

echo ========================================================
echo  Coffee Roasting Log System - 시작 스크립트
echo ========================================================
echo.

:: 1. Node.js 설치 확인
echo [1/3] Node.js 설치 확인 중...
node -v > nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Node.js가 설치되어 있지 않습니다.
    echo [!] 자동으로 설치를 시도합니다. (Winget 사용)
    echo.
    winget install OpenJS.NodeJS.LTS
    
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Node.js 자동 설치에 실패했습니다.
        echo 아래 사이트에서 직접 설치해주세요.
        echo https://nodejs.org/ (LTS 버전 권장)
        echo.
        echo 설치 후 이 파일을 다시 실행해주세요.
        pause
        exit /b
    )
    
    echo.
    echo [!] 설치가 완료되었습니다. 변경 사항 적용을 위해 스크립트를 재시작합니다.
    pause
    exit /b
)
echo [OK] Node.js가 설치되어 있습니다.
echo.

:: 2. 의존성 라이브러리 설치 확인
echo [2/3] 필요한 라이브러리 확인 중...
if not exist "node_modules" (
    echo [!] 라이브러리가 없습니다. 인터넷 연결을 확인하고 설치를 시작합니다...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] 라이브러리 설치 실패. 인터넷 연결을 확인해주세요.
        pause
        exit /b
    )
    echo [OK] 설치 완료.
) else (
    echo [OK] 이미 설치되어 있습니다. (건너뜀)
)
echo.

:: 3. 웹 애플리케이션 실행
echo [3/3] 프로그램을 실행합니다...
echo.
echo 잠시 후 인터넷 브라우저가 자동으로 열립니다.
echo 프로그램을 종료하려면 이 창을 닫아주세요.
echo.

:: 5초 후 브라우저 열기 (서버가 켜질 시간을 기다림)
timeout /t 5 > nul
start http://localhost:5173

:: 서버 시작
npm run dev
