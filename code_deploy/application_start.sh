
#!/bin/bash

# delete all servers and start the server as a daemon
pm2 delete all

cd /home/ubuntu/app
pm2 start npm -- run start
