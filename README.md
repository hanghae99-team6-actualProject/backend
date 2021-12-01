# 👟 밍기적 백앤드

[FrontEnd Github](https://github.com/hanghae99-team6-actualProject/frontend) 좌측 링크를 클릭하시면 프론트앤드 깃허브를 확인할 수 있습니다.

# '밍기적'을 소개합니다.

오랜 시간 좌식 생활을 하시거나 운동을 시작하지만 작심삼일로 끝나곤 하나요?

건강을 지키기 위해 꼭 거창한 운동을 할 필요는 없어요. 일상 속에서 여러분이 할 수 있는 운동을 꾸준히 한다면 하루하루 달라진 여러분을 발견할 수 있을 거에요.

귀여운 몬스터와 함께 작지만 소중한 기적, 밍기적을 일으켜 일상에 활력을 불어넣으세요!

# Features

- 운동 기록하고 루틴을  구성할 수 있습니다.
    - 액션과 루틴개념을 기반으로 운동을 기록할 수 있습니다.
        - 액션 : 실제 사용자가 실시하는 단일 운동
        - 루틴 : 액션의 조합
    - 프리셋으로 제공되는 기본 루틴 외, 직접 루틴을 구성할 수 있습니다.

- 운동 모임을 개설하고 모임 참여자들과 채팅으로 소통할 수 있습니다.
    - 공지사항
    공지 기능을 통해 참여자들에게 주요한 정보를 명확하게 전달할 수 있습니다.
    - 채팅
    모임 참여자들과 실시간 채팅으로 소통할 수 있습니다.
    - 지도
    카카오 지도 API를 기반으로 상세한 모임 위치를 적용할 수 있습니다.
    
- 다양한 로그인 방식이 제공됩니다.
    - 소셜 로그인 (Google, KaKao)
    - 일반 로그인
    
- 운동 이력을 조회할 수 있습니다.
    - Habit Tracker History
    - 운동 습관 형성을 돕는 Habit Tracker는 한 달을 기준으로 일자 템플릿이 표시됩니다.
    루틴을 완수하면 템플릿 내 완수 일자에 마크가 적용됩니다.
    - Graph History
    - 운동 이력을 막대그래프로 시각화해서 쉽게 확인할 수 있는 Graph History 주 단위로 표시됩니다.
    완수한 액션 수 또는 루틴 수를 기준으로 각각 확인할 수 있습니다.

# Architecture

<img width="968" alt="architecture" src="https://user-images.githubusercontent.com/54808299/144190937-0b12b9f4-9376-4b89-970e-c563ef88a60a.png">

# Database ERD
![projectDB](https://user-images.githubusercontent.com/54808299/144186220-7906f526-7d02-4f92-98fe-5b8517ae17f0.png)

# Backend Tech Stacks

- Java Script
- Node.js (Express)
- MySQL (Sequelize)
- Redis
- Soket IO

# Other Packages

|package|version|description|
|--------|---------|-----------------|
|bcrypt|^5.0.1|bcrypt JWT 토큰 암호화|
|cors|^2.8.5|CORS 핸들링|
|dotenv|^10.0.0|환경변수 핸들링|
|helmet|^4.6.0|웹서비스 보안|
|hpp|^0.2.3|웹서비스 보안|
|http-errors |^1.8.0|http 에러 생성 후 응답 위해 활용|
|joi|^17.4.2|유저 회원가입 시 입력값 유효성 체크|
|jsonwebtoken|^8.5.1|로그인 시 JWT 발급|
|morgan|^1.10.0|HTTP 요청 로그 관리|
|node-cron|^3.0.0|회원 탈퇴한 유저 정보 스케줄 삭제|
|passport|^0.5.0|소셜로그인|
|winston|^3.3.3|전체 서비스 로그 관리|

# Members

- Frontend Developer
    - 석지선
    - 이경아
    - 윤진선
- Backend Developer
    - 김영우
    - 양주혁
    - 임성찬
- Designer
    - 김수빈
    - 김예진