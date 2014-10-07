/*
 * grunt-traceur
 * https://github.com/aaronfrost/grunt-traceur
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
        sourceMaps: true
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
    mkdir: {
      test: {
        options: {
          create: ['test/tmp']
        }
      }
    },
    clean: ['test/tmp'],
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['mkdir', 'traceur', 'nodeunit', 'clean']);

};
