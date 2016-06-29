#!/bin/sh

echo "Starting the postgresql service..."
sudo service postgresql start

# Kill any currently-running instance of the server
killall -q node
# ... then launch new instance of the server
npm run watch
