#!/bin/bash
set -ev

mkdir -p dist

#Build landing
if [ $1 == "production" ]; then
	cp -r landing/* dist
fi

# Build login page
cd login
yarn install
if [ $1 == "dev" ]; then
	PORT=3001 yarn start &
fi
if [ $1 == "production" ]; then
	CI=false yarn build
	mv build ../dist/login
fi
cd ..

# Build test page
cd test/test
npm install
if [ $1 == "dev" ]; then
	PORT=3000 npm start &
fi
if [ $1 == "production" ]; then
	CI=false yarn build
	#mv build ../dist/login
fi
cd ..

# Build widget
cd widget/widget
npm install
if [ $1 == "dev" ]; then
	PORT=3002 npm start &
fi
if [ $1 == "production" ]; then
	CI=false yarn build
	#mv build ../dist/login
fi
cd ..

if [ $1 == "production" ]; then
	# Build provider bundle
	cd provider
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
