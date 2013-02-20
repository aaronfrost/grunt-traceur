# grunt-traceur

> A grunt plugin for Google's Traceur-Compile, a lib to compile ES6 JavaScript into ES3 JavaScript. 

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
      custom: {
        files:{
          'build/': ['js/**/*.js'] // dest : [source files]
        }
      },
    }
})
```
Once the files have ben transpiled into ES3, you can minify or concat them. 

SourceMaps will be available in a future version. 

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
