/*
 * grunt-traceur
 * https://github.com/aaron/grunt
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

    // Allow traceur.js to use importScript.
    global.importScript = importScript;
    importScript('/lib/traceur.js');
    


    this.files.forEach(function(group){
      var reporter = new traceur.util.ErrorReporter(),
          project = new traceur.semantics.symbols.Project(),
          SourceMapGenerator = traceur.outputgeneration.SourceMapGenerator;

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
      
      results.keys().forEach(function(file){
        var options = {
          encoding: 'utf8'
        },
        tree, source, filename, outputfile,
        traceurOptions = {

        };

        tree = results.get(file);
        filename = file.name;
        source = traceur.outputgeneration.TreeWriter.write(tree, false);
        outputfile = group.dest+file.name;
        grunt.file.write(outputfile, source, options);
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
