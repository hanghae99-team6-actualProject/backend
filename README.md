<div id="top"></div>
<br />

<a href="http://mingizuk.com/" target="_blank">![최종발표 ppt](https://user-images.githubusercontent.com/49370511/144515247-796bad51-8e96-47b6-aae8-bd89a9937d67.jpg)</a>
<br />

<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
  </a>

  <h2 align="center"><strong>밍기적</strong></h2>

  <p align="center">
    귀여운 몬스터와 함께 작지만 소중한 기적, 밍기적을 일으켜 일상에 활력을 불어넣으세요!
    <br />
     <br />
    <a href="http://mingizuk.com/" target="_blank"><strong>🙌  밍기적 하러 가기 🙌</strong></a>
    <br />
    <br />
</div>
<br />

# 👟 밍기적 백앤드

🐤 [Mingizuk 링크](http://mingizuk.com/)

🎥 [Youtube 링크](https://www.youtube.com/watch?v=y7q-AGfavoc)

📚 [Notion 링크](https://twilight-cardigan-0a3.notion.site/9cf811e7752d49b8a4be427d6dd16970)

🗂️ [FrontEnd Github 링크](https://github.com/hanghae99-team6-actualProject/frontend)

# '밍기적'을 소개합니다.

오랜 시간 좌식 생활을 하시거나 운동을 시작하지만 작심삼일로 끝나곤 하나요?

건강을 지키기 위해 꼭 거창한 운동을 할 필요는 없어요. 일상 속에서 여러분이 할 수 있는 운동을 꾸준히 한다면 하루하루 달라진 여러분을 발견할 수 있을 거에요.

귀여운 몬스터와 함께 작지만 소중한 기적, 밍기적을 일으켜 일상에 활력을 불어넣으세요!

# Features

- 운동 기록하고 루틴을  구성할 수 있습니다.
    - 동작과 루틴개념을 기반으로 운동을 기록할 수 있습니다.
        - 동작 : 실제 사용자가 실시하는 단일 운동
        - 루틴 : 액션의 조합
    - 프리셋으로 제공되는 기본 루틴 외, 직접 루틴을 구성할 수 있습니다.

- 귀여운 캐릭터가 운동을 함께합니다.
    - 유저가 운동을 통해 좀 더 건강해지는 것처럼 캐릭터도 진화합니다.

- 운동 모임을 개설하고 모임 참여자들과 채팅으로 소통할 수 있습니다.
    - 공지사항
    공지 기능을 통해 참여자들에게 주요한 정보를 명확하게 전달할 수 있습니다.
    - 채팅
    모임 참여자들과 실시간 채팅으로 소통할 수 있습니다.
    - 지도
    카카오 지도 API를 기반으로 상세한 모임 위치를 적용할 수 있습니다.
    
- JWT 방식으로 보안된 다양한 로그인 방식이 제공됩니다.
    - 소셜 로그인 (Google, KaKao)
    - 일반 로그인
    
- 운동 이력을 조회할 수 있습니다.
    - Habit Tracker History
      - 운동 습관 형성을 돕는 Habit Tracker는 한 달을 기준으로 일자 템플릿이 표시됩니다.
    루틴을 완수하면 템플릿 내 완수 일자에 마크가 적용됩니다.
    - Graph History
      - 운동 이력을 막대그래프로 시각화해서 쉽게 확인할 수 있는 Graph History 주 단위로 표시됩니다.
      완수한 동작 수 또는 루틴 수를 기준으로 각각 확인할 수 있습니다.

# Architecture
![백엔드 아키텍쳐](https://user-images.githubusercontent.com/42149645/144510755-e25f839f-9f2c-421f-846a-371b1245ab19.PNG)<br/>

# Database ERD
![projectDB](https://user-images.githubusercontent.com/54808299/144186220-7906f526-7d02-4f92-98fe-5b8517ae17f0.png)<br/>

# Backend Tech Stacks

|Name|Tech|
|---|---|
|Server|<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/> <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=Express&logoColor=white"/> <img src="https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=Socket.io&logoColor=white"/>|
|Language|<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"/>|
|Database|<img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/> <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=Redis&logoColor=white"/>|
|CI/CD|<img src="https://img.shields.io/badge/AWS CodePipeline-FF9900?style=flat-square"/> <img src="https://img.shields.io/badge/AWS CodeDeploy-FF9900?style=flat-square"/>|
|Container Orchestration|<img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white"/> <img src="https://img.shields.io/badge/AWS ECS-FF9900?style=flat-square"/> <img src="https://img.shields.io/badge/AWS CloudWatch-FF9900?style=flat-square"/>|
|Load Balancer|<img src="https://img.shields.io/badge/AWS ALB-FF9900?style=flat-square"/> <img src="https://img.shields.io/badge/Auto Scaling Group-FF9900?style=flat-square"/>|
|Test|<img src="https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=Jest&logoColor=white"/> <img src="https://img.shields.io/badge/Artillery-black?style=flat-square"/> |
|Storage|<img src="https://img.shields.io/badge/AWS S3-FF9900?style=flat-square"/> <img src="https://img.shields.io/badge/AWS ECR-FF9900?style=flat-square"/> <img src="https://img.shields.io/badge/AWS RDS-FF9900?style=flat-square"/> <img src="https://img.shields.io/badge/AWS ElastiCache-FF9900?style=flat-square"/>|

# Other Packages

|Package|Version|Description|
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
|node-cron|^3.0.0|스케줄러|
|passport|^0.5.0|소셜로그인|
|winston|^3.3.3|전체 서비스 로그 관리|

# Test
- Jest<br/>
- Artillery<br/>
    - 부하테스트를 통한 DB유형 선정<br/><br/>
        <img width="308" alt="스크린샷 2021-12-03 오전 5 46 29" src="https://user-images.githubusercontent.com/59440469/144500713-d0e2b321-8abf-4317-b5b0-917087c3f5bb.png"><br/><br/>
        - 기존 MySQL 사용시 채팅 데이터 부하 테스트 결과<br/><br/>
        <img width="290" alt="스크린샷 2021-12-03 오전 5 48 22" src="https://user-images.githubusercontent.com/59440469/144501209-9ae555aa-8c8d-4056-adaf-cd6587f296e9.png"><br/>
        <img width="590" alt="스크린샷 2021-12-03 오전 5 48 37" src="https://user-images.githubusercontent.com/59440469/144501306-8dcfcd5c-08d3-414d-b8ef-6f44b81ef086.png"><br/><br/>
        - Redis DB 사용시 채팅 데이터 부하 테스트 결과<br/><br/>
        <img width="282" alt="스크린샷 2021-12-03 오전 5 47 29" src="https://user-images.githubusercontent.com/59440469/144501427-b3624b91-4bf8-4f0b-9b35-015179ea3726.png"><br/>
        <img width="591" alt="스크린샷 2021-12-03 오전 5 47 49" src="https://user-images.githubusercontent.com/59440469/144501431-6217c1d5-afea-4fe6-99df-5677af9d0399.png"><br/><br/>
        - 결론: 테스트 결과, 기존 대비 약 1/4 가량의 Latancy가 측정되어 큰 감소치를 볼 수 있었고 이는 장기적인 측면에서 안정적인 DB를 구성할 수 있는 이유로 판단할 수 있습니다.<br/><br/>
- CloudWatch<br/>
    - AWS CloudWatch를 이용한 부하 경보 발생 테스트 결과<br/><br/>
![클라우드와치](https://user-images.githubusercontent.com/42149645/144510121-1b3b67b7-fe09-4a2a-b046-507092128d8d.PNG)<br/><br/>
![클라우드와치2](https://user-images.githubusercontent.com/42149645/144509487-a96a1542-5fe4-4e29-959e-b0ccabd2bdb9.PNG)<br/><br/>
    - 부하 경보를 발생할 수 있는 장치를 만들었으며 실제 테스트를 시도하여 경보를 발생시킨 후 autoscaling 실행 또한 확인하였습니다.<br/><br/>

# Improvements
- [Cron](https://github.com/hanghae99-team6-actualProject/Appendix-back/blob/main/Cron.md)  
- [CodePipeline](https://github.com/hanghae99-team6-actualProject/Appendix-back/blob/main/CodePipeline.md)    
- [RDS](https://github.com/hanghae99-team6-actualProject/Appendix-back/blob/main/RDS.md)  
- [ElastiCache](https://github.com/hanghae99-team6-actualProject/Appendix-back/blob/main/ElastiCache.md)    
- [ECS](https://github.com/hanghae99-team6-actualProject/Appendix-back/blob/main/ECS.md)    
- [Passport & JWT](https://github.com/hanghae99-team6-actualProject/Appendix-back/blob/main/Passport%26JWT.md)  
- [env 라우팅](https://github.com/hanghae99-team6-actualProject/Appendix-back/blob/main/env%20%EB%9D%BC%EC%9A%B0%ED%8C%85.md)     
- [Redis](https://github.com/hanghae99-team6-actualProject/Appendix-back/blob/main/Redis.md)  <br/>
- [Socket.Io](https://github.com/hanghae99-team6-actualProject/Appendix-back/blob/main/Socket.Io.md)  <br/>

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
