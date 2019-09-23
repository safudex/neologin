#!/bin/bash
set -ev

mkdir -p dist

# Build landing
if [ $1 == "production" ]; then
	cp -r landing/* dist
fi

# Build testbed
if [ $1 == "production" ]; then
	cp -r testbed dist/testbed
fi

# Build login page
cd login
yarn install
if [ $1 == "dev" ]; then
	PORT=3001 yarn start &
fi
if [ $1 == "production" ]; then
	sed -i 's/http:\/\/localhost:3002/https:\/\/neologin.io/g' src/config.js
	CI=false yarn build
	mv build ../dist/login
fi
cd ..

# Build widget
cd widget
npm install
if [ $1 == "dev" ]; then
	PORT=3002 npm start &
fi
if [ $1 == "production" ]; then
	sed -i 's/http:\/\/localhost:3001/https:\/\/neologin.io/g' src/config.js
	CI=false npm run build
	mv build ../dist/widget
fi
cd ..

# Build wallet
cd wallet
npm install
if [ $1 == "dev" ]; then
	PORT=3002 npm start &
fi
if [ $1 == "production" ]; then
	CI=false npm run build
	mv build ../dist/wallet
fi
cd ..

if [ $1 == "production" ]; then
	# Build provider bundle
	cd provider
	sed -i 's/http:\/\/localhost:3002\//https:\/\/neologin.io\/widget\//g' index.js
	npm install
	webpack
	cd ..

	# Build API docs
	cd dapi-docs
	yarn install
	yarn dist
	mv build ../dist/api
	cd ..
fi
