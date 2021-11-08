#!/bin/bash
sudo chmod -R 777 /home/ubuntu/mingijuk
# delete all servers and start the server as a daemon
cd /home/ubuntu/mingijuk
sudo npm install -g pm2
sudo pm2_home=/home/ubuntu/.pm2 pm2 kill
sudo pm2_home=/home/ubuntu/.pm2 pm2 start npm -- start
sudo pm2_home=/home/ubuntu/.pm2 pm2 save
