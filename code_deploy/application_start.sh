#!/bin/bash
sudo chmod -R 777 /home/ubuntu/mingijuk
# delete all servers and start the server as a daemon
cd /home/ubuntu/mingijuk
pkill -9 pm2
pm2 start npm -- start
pm2 save
