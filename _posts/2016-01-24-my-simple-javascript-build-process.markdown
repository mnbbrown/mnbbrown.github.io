---
layout: post
title: My simple JavaScript/React build process
draft: true
---


... and by simple I mean I only use 1000 npm packages and 200 steps instead of 10^10 and 300 steps. :P On a more serious note recently I've been developing a lot of prototypes in ReactJS and as such have spent hours scouring the web.

With a combination of gulp and webpack the process below supports the following:

- a simple base index.html,
- `gulp-scss` to build SCSS stylescripts,
- `webpack` to build React source,
- browsersync for 'live reload' during development,
- webpack dev and hot middleware for hot reloading of React components during development,
- deploying to CDN such as AWS CloudFront or Azure CDN profiles,
- environment specific build processes,
- hashed filenames(vendor-xyzabc.js) for cache busting

One thing this process doesn't support is 'isomorphic' JavaScript. Let's get started by installing our dependencies:

```bash
npm install --save-dev gulp \
  gulp-util \
  gulp-rev \
  gulp-rev-replace \
  gulp-sass \
  webpack \
  webpack-hot-middleware \
  webpack-dev-middleware \
  yargs \
  del \
  browser-sync
```

Next up is the webpack config file: `webpack.config.js`


```javascript

module.exports = function webpackConfig(APP_ENV, NODE_ENV, VERSION, API_SERVER, IDP_SERVER, CDN, vendors) {
  const production = NODE_ENV === 'production';
  const config = {
    entry: (() => {
      const entry = {};
      entry.vendors = vendors;
      entry.app = [path.join(__dirname, 'src', 'index.js')];
      entry.app = !production ? entry.app.concat(['webpack-hot-middleware/client']) : entry.app;
      return entry;
    })(),
    resolve: {
      extensions: ['', '.js', '.jsx'],
      root: path.join(__dirname, 'src'),
      modulesDirectories: ['node_modules'],
    },
    output: {
      path: path.join(__dirname, '__build__'),
      filename: '[name].js',
      publicPath: CDN || '',
    },
    stats: {
      colors: true,
      reasons: !production,
    },
    debug: !production,
    devtool: !production ? 'eval-cheap-module-source-map' : false,
    module: {
      loaders: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets: ['stage-0', 'es2015', 'react'],
          },
        },
        {
          test: /\.json$/,
          loader: 'json',
        },
      ],
    },
    plugins: (() => {
      const p = [];


      if (production) {
        p.push(new webpack.optimize.OccurenceOrderPlugin());
        p.push(new webpack.optimize.UglifyJsPlugin({
          compressor: {
            warnings: false,
            screw_ie8: true,
          },
        }));
        p.push(new webpack.optimize.DedupePlugin());
      }

      if (!production) {
        p.push(new webpack.HotModuleReplacementPlugin());
        p.push(new webpack.NoErrorsPlugin());
      }

      p.push(new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'));
      p.push(new webpack.ProvidePlugin({
        'Promise': 'exports?global.Promise!es6-promise',
        'fetch': 'exports?self.fetch!whatwg-fetch',
      }));
      p.push(new webpack.DefinePlugin({
        API_SERVER: JSON.stringify(API_SERVER),
        NODE_ENV: JSON.stringify(NODE_ENV),
        APP_ENV: JSON.stringify(APP_ENV),
        IDP_SERVER: JSON.stringify(IDP_SERVER),
        VERSION: JSON.stringify(VERSION),
      }));
      return p;
    })(),
  };
  return config;
};


```


```javascript

const gulp = require('gulp');
const del = require('del');
const gutil = require('gulp-util');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const argv = require('yargs').argv;
const sass = require('gulp-sass');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const browserSync = require('browser-sync');

```


```javascript
const environment = (!!argv.env ? argv.env : process.env.NODE_ENV || 'development');
const production = environment === 'production';

const appEnvironments = {
  staging: {
    CDN: '//eydigitalsmartcatch.blob.core.windows.net/staging',
    API_SERVER: '//staging.api.smartcatch.eydigital.io',
    IDP_SERVER: 'https://idp.eydigital.io',
  },
  production: {
    CDN: '//eydigitalsmartcatch.blob.core.windows.net/production',
    API_SERVER: '//api.smartcatch.eydigital.io',
    IDP_SERVER: 'https://idp.eydigital.io',
  },
  development: {
    CDN: '',
    API_SERVER: 'http://localhost:8080',
    IDP_SERVER: 'https://idp.eydigital.io',
  },
};
```
