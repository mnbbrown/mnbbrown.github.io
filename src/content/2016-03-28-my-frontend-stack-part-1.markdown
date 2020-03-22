---
layout: post
title: My Frontend Stack - Part 1
published: false
---

JavaScript is a scary beast. Add React, webpack, gulp, babel, ES2015 and bunch of other hyped up tools in the mix and you have a monster. This post hopes to tame this monster into something new (and old) front developers can use to get up to speed with what is hip these days.

First, and introduction to these tools. The rest of the post will then stick them all together into something more manageable.

### React
Created by Facebook, React is really just a fancy way of writing templates.

### Webpack
Webpack is a JavaScript module builder - it turns a bunch of different files with `require('xyz')` or `import x from 'y'` into something a browser can run. In essence it just means you can write JavaScript in a bunch of different files.

### Gulp
Just a build tool like make, grunt, ant, etc except everything is a stream.

### ES2016 and Bable
ES2016 is a new iteration of JavaScript that is not yet fully supported by Browsers - it introduced a bunch of new features such as classes (`class Hotrod extends Car`). Bable is a transpiler that turns ES2015 JavaScript into ES5 (the version of JS browsers understand).

I write JS web applications in ES2016 using React. I then build this using a combination of Babel, gulp and webpack.

## Show me the money...

Lets get started. First we must install some global dependencies.

```bash
$ sudo npm install -g gulp
```
