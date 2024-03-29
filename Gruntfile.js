module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      files: ["Gruntfile.js", "src/**/*.js", "test/**/*.js"],
      options: {
        globals: {
          jQuery: true,
        },
      },
    },
    bump: {
      options: {
        files: ["helpers/app-version.json", "package.json"],
        updateConfigs: [],
        commit: true,
        commitMessage: "Release v%VERSION%",
        commitFiles: ["helpers/app-version.json", "package.json"],
        createTag: true,
        tagName: "v%VERSION%",
        tagMessage: "Version %VERSION%",
        push: true,
        pushTo: "origin",
        gitDescribeOptions: "--tags --always --abbrev=1 --dirty=-d",
        globalReplace: false,
        prereleaseName: false,
        metadata: "",
        regExp: false,
      },
    },
    // watch: {
    //   files: ["<%= jshint.files %>"],
    //   tasks: ["jshint"],
    // },
  });
  grunt.loadNpmTasks("grunt-bump");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  // grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask("default", ["jshint"]);
};
