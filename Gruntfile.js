/*
 * grunt-traceur
 * https://github.com/aaron/grunt
 *
 * Copyright (c) 2013 Aaron Frost
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Configuration to be run (and then tested).
    traceur: {
      options: {
        experimental: true,
        modules: 'commonjs',
        sourceMaps: true,
        arrayComprehension: true,
        generatorComprehension: true,
        moduleNaming: {
          stripPrefix: "test/tmp",
          addPrefix: "test/fixtures"
        },
        copyRuntime: "test/tmp"
        // traceur options here
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/fixtures',
          src: ['*.js'],
          dest: 'test/tmp'
        }]
      }
    },
    nodeunit: {
      tests: ['test/*_test.js']
    },
    clean: {
      build: ["test/tmp"]
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['clean:build', 'traceur', 'nodeunit', 'clean:build']);

  //Same as default, but doesn't clean at the end, so that you can see the output.
  grunt.registerTask('test', ['clean:build', 'traceur', 'nodeunit']);

};
