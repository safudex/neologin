#!/bin/bash
set -ev

mkdir -p dist

#Build landing
cp -r landing/* dist

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

	# Build login page
	cd login
	yarn install
	CI=false yarn build
	mv build ../dist/login
	cd ..
fi
