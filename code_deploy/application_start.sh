#!/bin/bash
sudo chmod -R 777 /home/ubuntu/app
# delete all servers and start the server as a daemon
cd /home/ubuntu/app
npm install
npm audit fix
pm2 start npm -- start
