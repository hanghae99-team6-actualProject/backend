#!/bin/bash

# EC2 서버에 node와 nvm 설치하기
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node

# 밍기적 폴더 권한 추가
sudo chmod -R 777 /home/ubuntu/mingijuk
cd /home/ubuntu/mingijuk

# npm과 node 설치
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)


# node_modules 설치
npm install
echo "npm installed"

#PM2 설치
npm install -g pm2
echo "pm2 installed"

# node 어플리케이션 background에서 실행시키기 (by doing so, the server won't be terminated due to inactivates)
# node app.js 만 입력시 foreground로 실행이 됌
# node dist/app.js > app.out.log 2> app.err.log < /dev/null & 
pm2 start NODE_ENV=production node server.js
pm2 save
