module.exports = function( grunt ) {

  grunt.initConfig({

    jshint: {
      files: [ "*.js" ]
    }

  });

  grunt.loadNpmTasks("grunt-contrib-jshint");

  grunt.registerTask("test", ["jshint"] );
};