#!/bin/bash
sudo chmod -R 777 /home/ubuntu/app
# delete all servers and start the server as a daemon
cd /home/ubuntu/app
npm install

pm2 start npm -- run start
