#!/bin/sh

echo "Starting the postgresql service..."
sudo service postgresql start

echo "Fetching latest version and forcing compilation..."
git pull
npm run build

# Kill any currently-running instance of the server
killall -q node
# ... then launch new instance of the server
node app.js
