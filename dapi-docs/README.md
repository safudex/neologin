**This is a fork of <https://github.com/corollari/o3-dapi/tree/master/packages/neo/docs/source>**, which is itself a fork of the now disappeared (or just that I haven't been able to find on github) git repo of the o3 documentation website.

# O3 dAPI NEO Plugin Documents Generator

This is the sub-repo to generate to interface documentation website for the O3 dAPI NEO plugin.

## Getting started
If you would like to update and run the a local copy of the documents website:

Install build dependencies. This documentation site uses slate, and thus will install Ruby dependencies on your computer.
```
yarn install
```

If you encounter an error during installation regarding permissions and a bundler, run the following, and then `yarn install` once again.
```
sudo gem install -n /usr/local/bin bundler
```

Once installed, simply run the following to start the development server:
```
yarn start
```

Once the server is started, you can access it from your browser at:
```
http://localhost:4567
```

Any updates you make to the source files should reflect in auto updates to the hosted site.

## Building for deploymet
If you are looking to deploy your updated version of the documentation, run the following build command:
```
yarn dist
```

This will build all the required static files into the `./build` folder.
