/**
 * System configuration for Angular 2 apps
 * Adjust as necessary for your application needs.
 */
(function(global) {

  // map tells the System loader where to look for things
  var map = {
      'app':                        'app', // 'dist',
      '@angular':                   'node_modules/@angular',
      'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
      'rxjs':                       'node_modules/rxjs',
      'lodash':                     'node_modules/lodash',
      'brace':                      'node_modules/brace',
      'w3c-blob':                   'node_modules/w3c-blob',
      'buffer':                     'node_modules/buffer-shims'
  };

  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
      'app':                        { main: 'main.js',  defaultExtension: 'js' },
      'rxjs':                       { defaultExtension: 'js' },
      'angular2-in-memory-web-api': { defaultExtension: 'js' },
      'lodash':                     { main: 'index.js', defaultExtension: 'js' },
      'brace':                      { main: 'index.js', defaultExtension: 'js' },
      'w3c-blob':                   { main: 'index.js', defaultExtension: 'js' },
      'buffer':                     { main: 'index.js', defaultExtension: 'js' }
  };

  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'router-deprecated',
    'upgrade'
  ];

  // Add package entries for angular packages
  ngPackageNames.forEach(function(pkgName) {

    // Bundled (~40 requests):
    packages['@angular/'+pkgName] = { main: pkgName + '.umd.js', defaultExtension: 'js' };

    // Individual files (~300 requests):
    //packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
  });

  var config = {
    map: map,
    packages: packages
  };

  System.config(config);

})(this);
