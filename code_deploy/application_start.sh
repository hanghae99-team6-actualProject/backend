#!/bin/bash
sudo chmod -R 777 /home/ubuntu/mingijuk
# delete all servers and start the server as a daemon
cd /home/ubuntu/mingijuk
pm2 kill
pm2 start npm -- start
pm2 save
