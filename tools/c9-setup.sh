echo "Starting the postgresql service..."
sudo service postgresql start

echo "Creating the midas database..."
createdb midas
psql midas <<EOF
CREATE USER midas WITH PASSWORD 'midas';
GRANT ALL PRIVILEGES ON DATABASE midas to midas;
ALTER SCHEMA public OWNER TO midas;
EOF

echo "npm install -g node-gyp grunt-cli"
npm install -g node-gyp grunt-cli

echo "npm install"
npm install

echo "Symlinking to the globally-installed grunt..."
ln -s `which grunt` node_modules/.bin

echo "Doing initial schema deployment..."
sh tools/postgres/cleandb.sh

echo "Registering sample tasks and launching web server..."
npm run demo

