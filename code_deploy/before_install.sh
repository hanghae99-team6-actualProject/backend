#!/bin/bash

# EC2 서버에 node와 nvm 설치하기
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node

# EC2 서버 작업 폴더 확인
DIR="/home/ubuntu/mingijuk"

if [ -d "$DIR" ]; then
  echo folder exists
else 
  mkdir ${DIR}
fi

sudo rm -rf /home/ubuntu/mingijuk/node_modules
# 한국 시간(KST) 으로 Timezone 변경
sudo rm -rf /etc/localtime
sudo ln -s /usr/share/zoneinfo/Asia/Seoul /etc/localtime
