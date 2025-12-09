@echo off
chcp 65001 > nul
setlocal

echo ========================================================
echo   Coffee Roasting Log System - 원클릭 실행 도구
echo ========================================================
echo.

:: 1. Node.js 설치 확인
echo [1/3] Node.js 설치 확인 중...
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo [오류] Node.js가 설치되어 있지 않습니다.
    echo 아래 사이트에서 Node.js(LTS 버전 권장)를 먼저 설치해주세요.
    echo https://nodejs.org/
    echo.
    echo 설치 후 이 파일을 다시 실행해주세요.
    pause
    exit /b
)
echo [확인완료] Node.js가 설치되어 있습니다.
echo.

:: 2. 라이브러리(node_modules) 확인 및 설치
echo [2/3] 필요한 라이브러리 확인 중...
if not exist "node_modules" (
    echo  - 라이브러리가 없어 설치를 시작합니다. (시간이 조금 걸릴 수 있습니다)
    call npm install
    if %errorlevel% neq 0 (
        echo [오류] 라이브러리 설치 중 문제가 발생했습니다.
        pause
        exit /b
    )
    echo  - 라이브러리 설치 완료!
) else (
    echo [확인완료] 이미 필요한 라이브러리가 준비되어 있습니다.
)
echo.

:: 3. 서버 실행 및 웹사이트 열기
echo [3/3] 서버를 시작하고 웹사이트를 엽니다...
echo.
echo * 브라우저가 자동으로 열립니다. (http://localhost:5173)
echo * 종료하려면 이 창을 닫거나 Ctrl+C를 누르세요.
echo.

:: 브라우저를 3초 뒤에 엽니다 (서버 구동 시간 확보)
timeout /t 3 /nobreak > nul
start http://localhost:5173

:: 개발 서버 실행
call npm run dev
