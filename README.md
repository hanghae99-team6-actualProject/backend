<div id="top"></div>
<br />

<a href="http://mingizuk.com/" target="_blank">![스크린샷 2021-12-01 오전 2 50 04](https://user-images.githubusercontent.com/49370511/144100873-45697049-1869-47b0-b7e3-1a76402c8fe9.png)</a>
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

[FrontEnd Github](https://github.com/hanghae99-team6-actualProject/frontend) 좌측 링크를 통해 프론트앤드 깃허브를 확인할 수 있습니다.

[밍기적 Notion](https://twilight-cardigan-0a3.notion.site/9cf811e7752d49b8a4be427d6dd16970) 좌측 링크를 통해 밍기적 노션페이지를 확인할 수 있습니다.

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

- Node.js (Express)
- MySQL
- RDS
- Redis
- ElastiCache
- Soket IO
- CodeBuild
- CodeDeploy
- CodePipeline
- CloudWatch
- ECS
- ECR
- Docker

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
- Cron
<img width="386" alt="스크린샷 2021-12-03 오전 8 06 15" src="https://user-images.githubusercontent.com/54808299/144517227-b8b23019-4669-4ea5-8c26-425c25fe2eea.png">

  서비스 특성 상 유저 정보를 활용하는 요소가 많으므로 유저 삭제 시 함께 제거되는 데이터의 범위가 넓으므로 보수적으로 데이터를 처리할 필요성이 있다고 판단했습니다.
    
  User 테이블에 paranoid 속성을 적용하여 회원탈퇴 시 soft-delete 하고 node-cron을 활용하여 한 달이상 soft-delete된 유저를 hard-delete 하도록 스케줄링 처리하였습니다.
    
  이를 통해 일시적인 변심 또는 실수로 회원탈퇴한 경우 복구할 수 있는 안전장치를 마련할 수 있었습니다.

- CodePipeline  
![cicd](https://user-images.githubusercontent.com/42149645/144535881-a8c3ce1c-0d82-4efd-bf62-1d712a8abd22.PNG)  
ci/cd 도구로써 처음 사용했던 젠킨스의 메모리 문제로 단일 서버에서 서비스와 젠킨스가 함께 실행될 때 서버 과부하 발생하였으며 이 이후로 서버의 고가용성과 확장성에 대해서 많은 고민을 하게 되었습니다.   
1. 우선 Swap Memory를 사용하여 하드디스크의 디스크를 메모리로 사용할 수 있게 설정하였습니다. 하지만 이후 도커 적용시 작은 ec2 서버로 다수의 도커 이미지 실행시에도 버틸 수 있을지,  또한 하드디스크를 사용하므로 속도가 느려 사용자 경험 측면에서 좋지 않다고 판단하였습니다.
2. 젠킨스 전용 ec2 서버를 만들어 사용하였으나 젠킨스만 적용하기에는 서버의 남는 가용공간이 너무 크기 때문에 너무 낭비가 크다고 판단하였습니다.  
3. 이후 젠킨스를 과감히 버리고 Travis Ci와 Github Actions을 기용하려고 시도하였으나 각각 비용 문제와 서비스 퀄리티 문제로 중단하였습니다.  
4. 최종적으로 AWS의 CodePipeline의 사용을 결정하였으며 젠킨스만큼의 서비스를 제공하며, 이후의 아키텍쳐간 연결과 Cloud Watch를 통한 로그 확인의 사용을 기대하였고 훌륭히 역할을 해 주었습니다.  

- RDS, ElastiCache  
  젠킨스를 동일한 ec2 서버에 놓았을때의 과부하 경험으로 서버에 부하를 최소화하며 예산이 크게 나가지 않는 방향에서의 최대한의 오버엔지니어링으로 설계 방향을 잡았습니다.  
  따라서 젠킨스처럼 단일 ec2 서버에 mysql과 redis를 놓는 것이 맞는 것인가에 대한 고민 끝에 RDS 서버와 ElastiCache 서버에 올리고 사용하는 방향으로 결정하였습니다.  
  
- ECS  
  이전 경험을 통해 부하는 항상 최대치를 넘는 상황을 고려할 수 있도록 생각하였고 로드밸런싱과 오토스케일링을 통해 해결할 생각을 가졌습니다.   
  쿠버네티스나 도커스웜에 비해 필요하다면 EC2 서버를 추가하거나 단계조정 형식의 오토스케일링도 가능한 ECS가 매력적으로 느껴졌고 EC2의 모든 아키텍쳐가 AWS로 연결된 저희 상황에서는 VPC통신도 원할할 것으로 예상되며 이전 Cloud Watch 사용이 좋은 경험이었기 때문에 사용을 결심하였습니다.  
  
- JWT토큰   
  서버가 단일 서버일 때 과부화를 몇번 겪은 후 서버에 부담이 최소화되는 방식으로 구현 목표를 잡게 되었고 따라서 세션 방식의 로그인 대신 JWT 토큰 방식으로 로그인을 구현하였습니다.   
  최소한의 보안을 위해 AccessToken과 RefreshToken을 발행해 짧은 시간의 만료기간을 주고 모든 미들웨어에 자동로그인을 구현하여 사용자 편의성을 증대시켰습니다.  

- env 라우팅   
  .env의 환경변수가 늘어가고, 로컬 환경과 배포 환경에서 차이점이 커지면서 환경변수를 관리해주는 시스템의 필요성을 느꼈습니다.   
  현재 환경에 맞는 환경변수를 자동으로 세팅하도록 구현하였습니다. 

- Chat DataBase
  Chat를 저장하는 DB를 MySQL에서 Redis로 구성을 변경하였다. 그 이유로는 유저가 늘어나게 된다면 채팅 데이터의 저장도 같이 증가할 것이라는 예상이 있었고,
  그에따라 많은 처리와 단순한 구조의 데이터 저장에 특화된 데이터 베이스 사용을 고려하게 되었습니다.
  결국 아틀러리를 통한 부하 테스트를 진행하였고, Redis가 SQL에 비해 Latancy가 75% 감소하는 것을 확인하게 되었습니다. 따라서 보다 나은 성능을 보여주는 Redis로 DB를 변경하였습니다.

- Socket.Io

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
