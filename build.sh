#!/bin/bash
set -ev

mkdir -p dist

#Build landing
cp -r landing/* dist
(cd dist && pandoc -t html -f gfm --css "pandoc.css" -s ../README.md -o index.html -V header-includes:"<link rel='shortcut icon' href='favicon.png' />" --metadata pagetitle="Headjack" --fail-if-warnings)

# Build widget & login
mkdir -p dist/login
cp login/index.html dist/login
mkdir -p dist/widget
cp widget/index.html dist/widget
npm run build

