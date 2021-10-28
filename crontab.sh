#!/bin/bash

echo 'start remove deleted user info...';

curl -H "Content-Type: application/json" -X DELETE -d '
  {"sql":"delete from `Users` where  `deletedAt` is not null;"}
  ' http://localhost:8080/api/timer/userTimer

echo 'success!';