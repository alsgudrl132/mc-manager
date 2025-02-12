# MC Manager

![스크린샷 2025-02-03 오전 11 31 57](https://github.com/user-attachments/assets/59b3dba1-8a84-4595-831e-af55775048df)
![스크린샷 2025-02-04 오후 5 48 29](https://github.com/user-attachments/assets/6dfc0cd2-e63d-4a30-8bd5-92a58b6e1688)
![스크린샷 2025-02-04 오후 5 48 40](https://github.com/user-attachments/assets/ea0e3741-3b29-4048-bbf5-d1b5e0426846)
![스크린샷 2025-02-04 오후 5 48 54](https://github.com/user-attachments/assets/35799551-15a2-4363-a7bf-d4314b99121c)


마인크래프트 서버 관리를 위한 대시보드 프로젝트입니다. 서버 상태, 플레이어 정보, 채팅 로그 등을 실시간으로 모니터링할 수 있습니다.

## Overview

서버 관리자가 웹 브라우저를 통해 마인크래프트 서버를 모니터링하고 관리할 수 있는 대시보드 시스템입니다. 실시간 서버 상태, 플레이어 정보, 채팅 로그 등을 확인할 수 있습니다.

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Lucide Icons

### Backend
- Spring Boot
- Java

### Minecraft Plugin
- Spigot API
- Java

## Features

### 유저 관리
- 플레이어 킥/밴/언밴
- 플레이어 권한 수정 (OP 권한 부여/제거)
- 플레이어 인벤토리 확인 및 수정
- 플레이어 게임모드 변경
- 플레이어 위치 확인/텔레포트
- 화이트리스트 관리

### 채팅/커뮤니케이션
- 전체 공지사항 전송
- 특정 플레이어에게 귓속말
- 채팅 로그 검색/필터링
- 채팅 뮤트 기능

### 서버 관리
- 서버 시작/중지/재시작
- 서버 백업 생성/복구

### 모니터링 & 로깅
- 상세 플레이어 통계 (플레이 시간, 사망 횟수 등)
- 서버 리소스 사용량 그래프
- 명령어 사용 로그
- 접속 기록 조회

### 게임 기능
- 아이템 지급
- 경험치/레벨 수정
- 날씨/시간 변경
- 월드 스폰 포인트 설정
- 서버 난이도 조절

### 커스텀 기능
- 자동 공지사항 설정
- 접속 환영 메시지 커스터마이즈
- 스케줄된 서버 재시작

## Platform
- macOS
- Minecraft Server 1.21.4
