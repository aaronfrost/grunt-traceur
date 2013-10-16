/*
 * grunt-traceur
 * https://github.com/aaronfrost/grunt
 *
 * Copyright (c) 2013 Aaron Frost
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  var fs = require('fs'), 
      path = require('path');

  grunt.registerMultiTask('traceur', 'Transpile ES6 JavaScript to ES3 JavaScript', function() {
    var traceur = require('traceur');

    var options = this.options({
      sourceMaps: false
    });

    // Pass along any defined options to traceur
    traceur.options.setFromObject(options);

    this.files.forEach(function(group){
      var reporter = new traceur.util.ErrorReporter(),
          project = new traceur.semantics.symbols.Project();

      console.log(group.dest, group.src);
      group.src.forEach(function(filename){

        var data = grunt.file.read(filename).toString('utf8'); 
        var sourceFile = new traceur.syntax.SourceFile(filename, data);
        project.addFile(sourceFile);

      });

      console.log('Compiling... '+group.dest);


      var results = traceur.codegeneration.Compiler.compile(reporter, project, false);
      if (reporter.hadError()) {
        console.log('Compilation failed - '+group.dest);
        return false;
      }

      console.log('Compilation successful - '+group.dest+'\nWriting... '+group.dest);

      //console.log(results);
      
      results.keys().forEach(function (file) {
        var traceurOptions = {};

        if (options.sourceMaps) {
          traceurOptions.sourceMapGenerator = new traceur.outputgeneration.SourceMapGenerator({
            file: file.name
          });
        }

        var tree = results.get(file);
        var source = traceur.outputgeneration.TreeWriter.write(tree, traceurOptions);
        var outputfile = group.dest + file.name;
        grunt.file.write(outputfile, source);

        if (traceurOptions.sourceMap) {
          grunt.file.write(outputfile + '.map', traceurOptions.sourceMap);
        }

        console.log(outputfile + ' successful.'); 
      });

      console.log('Writing successful - '+group);
    });

    function importScript(filename) {
      filename = path.join(__dirname , filename);
      var data = fs.readFileSync(filename);
      if (!data) {
        throw new Error('Failed to import ' + filename);
      }
      data = data.toString('utf8');
      eval.call(global, data);
    }

  });

};
