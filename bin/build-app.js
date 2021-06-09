const path = require('path');
const fs = require('fs-extra');
var utils = require('./utils');
const exec = require('pkg').exec;

function buildApp( file, node = 'node10', platform = 'win', architecture = 'x64', compiledExe ) {
  if ( platform === 'win' ) {
    compiledExe = compiledExe + '.exe';
  }
  const shellCommand = 'pkg server.js --target ' + node + '-' + platform + '-' + architecture + ' --output ' + path.join( 'output', compiledExe );
  utils.info( shellCommand );
  return new Promise( async resolve => {
    await exec([
      file,
      '--target', [ node, platform, architecture ].join('-'),
      '--output', path.join( 'output', compiledExe )
    ]);
    resolve();
  })
}

( async () => {

  utils.header( 'copy web app' );
  await utils.copyFolder( path.join( 'dist' ), path.join( 'output', 'dist' ) );

  utils.header( 'building executables' );
  await buildApp( 'server.js',          'node10', 'win', 'x64', 'RedAmpp'     );
  await buildApp( 'tray.js',            'node10', 'win', 'x64', 'RedAmppTray' );
  await buildApp( 'app/proxyWorker.js', 'node10', 'win', 'x64', 'proxyWorker' );

  // utils.header( 'copy deasync module' );
  // fs.ensureDirSync( path.join( 'output' ) );
  // fs.ensureDirSync( path.join( 'output', 'node_modules', 'deasync', 'build' ) );
  await utils.copyFile( path.join( 'node_modules', 'deasync', 'bin', 'win32-x64-node-10', 'deasync.node' ), path.join( 'output', 'deasync.node' ) );

})();
