_published the 0.5.0 release to npmjs.org_
# grunt-traceur

[![Build Status](https://travis-ci.org/aaronfrost/grunt-traceur.svg?branch=master)](https://travis-ci.org/aaronfrost/grunt-traceur)

> A grunt plugin for Google's Traceur-Compile, a lib to compile ES6 JavaScript into ES5 JavaScript.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-traceur --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-traceur');
```

## The "traceur" task

### Overview
In your project's Gruntfile, add a section named `traceur` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  traceur: {
    options: {
      // traceur options here
      experimental: true,
      // module naming options,
      moduleNaming: {
        stripPrefix: "src/es6",
        addPrefix: "com/mycompany/project"
      },
      copyRuntime: 'src/es5'
    },
    custom: {
      files: [{
        expand: true,
        cwd: 'src/es6',
        src: ['*.js'],
        dest: 'src/es5'
      }]
    },
  },
})
```
Once the files have been transpiled into ES5, you can minify or concat them.

### Options

Any specified option will be passed through directly to traceur, thus you can specify any option that traceur supports.

Some common options:

* `experimental` - Turn on all experimental features
* `blockBinding` - Turn on support for `let` and `const`
* `copyRuntime` - Copies the traceur_runtime.js to the location which you specify here
* `moduleNames` - Generate named module (default: true)
* `moduleNaming.stripPrefix` - Strip the specified prefix from generated module names
* `moduleNaming.addPrefix` - Add the specified prefix to the generated module names (applied AFTER the `moduleNaming.stripPrefix` option)

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
