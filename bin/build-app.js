const path = require('path');
const fs = require('fs-extra');
var utils = require('./utils');
const exec = require('pkg').exec;

function buildApp( node = 'node10', platform = 'win', architecture = 'x64' ) {
  let compiledExe = 'RedAmpp';
  if ( platform === 'win' ) {
    compiledExe = compiledExe + '.exe';
  }
  fs.ensureDirSync( path.join( 'dist', architecture ) );
  const shellCommand = 'pkg server.js --target ' + node + '-' + platform + '-' + architecture + ' --output ' + path.join( 'dist', architecture, compiledExe );
  utils.info( shellCommand );
  return new Promise( async resolve => {
    await exec([
      'server.js',
      '--target', [ node, platform, architecture ].join('-'),
      '--output', path.join( 'dist', architecture, compiledExe )
    ]);
    resolve();
  })
}

( async () => {

  utils.header( 'building executables' );
  await buildApp( 'node10', 'win', 'x64' );

})();
