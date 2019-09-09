#!/bin/bash
set -ev

mkdir -p dist

#Build landing
cp -r landing/* dist
(cd dist && pandoc -t html -f gfm --css "pandoc.css" -s ../README.md -o index.html --metadata pagetitle="Headjack" --fail-if-warnings)

if [ $1 == "production" ]; then
	# Build provider bundle
	cd provider
	npm install
	webpack
	cd ..

	# Build login page
	cd login
	yarn install
	CI=false yarn build
	mv build ../dist/login
	cd ..
fi
