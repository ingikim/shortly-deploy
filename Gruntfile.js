module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
     
      },
      dist: {
        src: ['public/client/*.js'],
        dest: 'public/dist/built.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      my_target: {
        files: {
          'public/dist/built.min.js': ['public/dist/built.js']
          // 'public/dist/app.min.js': ['app/**/*.js']
        }
      }
    },

    jshint: {
      files: [
        // Add filespec list here
        'public/client/*.js', 'app/**/*.js', 'lib/*.js', 'server-config.js', 'server.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
        // Add filespec list here
      target: {
        files: {
          'public/dist/style.min.css': ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: [
          'azure site scale mode standard shortly-IC',
          'git push azure master',
          'azure site browse',
          'azure site scale mode free shortly-IC'
          ].join('&&')
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    'mochaTest',
    'jshint',
    'concat',
    'uglify',
    'cssmin',
    'shell' 
  ]);

  // grunt.registerTask('deploy', function(n) {
  //   if(grunt.option('prod')) {
  //    'mochaTest',
  //    'jshint',
  //    'concat',
  //    'uglify',
  //    'cssmin',
  //    'prodShell' 
  //   } else {
  //     'mochaTest',
  //     'jshint',
  //     'concat',
  //     'uglify',
  //     'cssmin',
  //     'localShell'
  //   }
  // });

  // grunt.registerTask('deploy', [
  //     // add your production server task here
  //   if(grunt.option('prod')) {
  //     'mochaTest',
  //     'jshint',
  //     'concat',
  //     'uglify',
  //     'cssmin',
  //     'shell'
  //     // add your production server task here
  //   } else {
  //     'mochaTest',
  //     'jshint',
  //     'concat',
  //     'uglify',
  //     'cssmin'
  //   }
    
  // ]);


};
