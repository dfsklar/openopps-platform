#!/bin/sh

git pull
npm run build

# Kill any currently-running instance of the server
killall node
# ... then launch new instance of the server
node app.js
