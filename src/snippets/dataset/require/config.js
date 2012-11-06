require.config({

  // Initialize the application with the main application file.
  deps: [ "main"],

  paths: {
    // JavaScript folders.
    libs: "../assets/js/libs",

    // Libraries.
    lodash: "../assets/js/libs/lodash",
    moment: "../assets/js/libs/moment",
    
    miso: "../assets/js/libs/miso.dataset"
  },

  shim: {

    miso : {
      deps : ["lodash", "moment"],
      exports: "Miso"
    }
  }
});