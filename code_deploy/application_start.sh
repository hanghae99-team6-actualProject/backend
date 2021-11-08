#!/bin/bash
sudo chmod -R 777 /home/ubuntu/app
# delete all servers and start the server as a daemon
cd /home/ubuntu/app
sudo pm2_home=/home/ubuntu/.pm2 pm2 kill
sudo pm2_home=/home/ubuntu/.pm2 pm2 start npm -- start
sudo pm2_home=/home/ubuntu/.pm2 pm2 save
sudo pm2_home=/home/ubuntu/.pm2 pm2 update
