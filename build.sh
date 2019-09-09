#!/bin/bash
set -ev

mkdir -p dist

#Build landing
cp -r landing/* dist
(cd dist && pandoc -t html -f gfm --css "pandoc.css" -s ../README.md -o index.html --metadata pagetitle="Headjack" --fail-if-warnings)

if [ $1 == "production" ]; then
	cd login
	npm install
	npm run build
	mv build ../dist/login
fi
