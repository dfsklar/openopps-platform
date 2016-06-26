#!/bin/sh

# Kill any currently-running instance of the server
killall node
# ... then launch new instance of the server
npm run watch
