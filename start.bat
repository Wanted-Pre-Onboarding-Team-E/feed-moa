@echo off

:: npm 모듈 설치
START /wait /b cmd /c npm install

:: 데이터베이스 테이블 생성
START /wait /b cmd /c npm run migration:run

:: Seed 데이터 삽입
START /wait /b cmd /c npm run seed:run

:: NestJS 앱 실행
npm run start:local