@echo off
chcp 65001 > nul
setlocal

echo ========================================================
echo   Coffee Roasting Log System - 실행 스크립트
echo ========================================================
echo.

:: 1. 라이브러리(node_modules) 확인 및 설치
:: Node.js가 설치되어 있다는 가정하에 바로 npm 명령을 실행합니다.
if not exist "node_modules" (
    echo [알림] 라이브러리가 없어 설치를 시작합니다... (npm install)
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [오류] npm install 실패! 
        echo Node.js가 올바르게 설치되어 있는지 확인해주세요.
        echo 오류 내용을 확인하고 아무 키나 누르시면 종료됩니다.
        pause
        exit /b
    )
    echo [완료] 라이브러리 설치가 끝났습니다.
) else (
    echo [확인] 필요한 라이브러리가 이미 준비되어 있습니다.
)
echo.

:: 2. 서버 실행 및 웹사이트 열기
echo [알림] 서버를 시작합니다...
echo.
echo * 잠시 후 브라우저가 자동으로 열립니다. (http://localhost:5173)
echo * 이 검은색 창을 닫으면 서버가 종료됩니다.
echo.

:: 브라우저를 3초 뒤에 엽니다
timeout /t 3 /nobreak > nul
start http://localhost:5173

:: 개발 서버 실행
call npm run dev

:: 서버가 비정상 종료되거나 Ctrl+C로 껐을 때 메시지 표시
echo.
echo [알림] 서버가 종료되었습니다.
pause
