#!/bin/bash
set -ev

mkdir -p dist

#Build landing
cp -r landing/* dist
(cd dist && pandoc -t html -f gfm --css "pandoc.css" -s ../README.md -o index.html -V header-includes:"<link rel='shortcut icon' href='favicon.png' />" --metadata pagetitle="Headjack" --fail-if-warnings)

# Build widget, login & example
mkdir -p dist/login
cp login/index.html dist/login

mkdir -p dist/widget
cp widget/index.html dist/widget

mkdir -p dist/example
cp example/index.html dist/example
echo "//DON'T MODIFY THIS FILE!1! IT'S AUTOMATICALLY BUILT FROM provider/index.js" > example/headjack.js
cat provider/index.js >> example/headjack.js
sed -i 's/https:\/\/headjack.to/../' example/headjack.js 

if [ $1 == "production" ]; then
	sed -i "s/mode: 'development'/mode: 'production'/" webpack.config.js
	sed -i "/devtool: '/d" webpack.config.js
fi
npm run build
