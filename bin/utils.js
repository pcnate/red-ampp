const os = require('os');
const path = require('path');
var fs = require('fs-extra');
var cli = require("cli-color");

const log   = ( ...a ) => console.log( a.join(' ') );
const info  = ( ...a ) => console.log( cli.cyan( a.join(' ') ) );
const error = ( ...a ) => console.log( cli.yellow( a.join(' ') ) );
const header = ( ...a ) => log( [ os.EOL, '#'.repeat( 40 ), os.EOL, os.EOL, '  ' + a.join(' '), os.EOL ].join( '' ) );

/**
 * copy a file
 *
 * @param {string} source file
 * @param {string} destination file
 */
function copyFile( source, destination, silent=false ) {
  if( !silent )
    info( 'cp', source, destination );
  return new Promise( async resolve => {
    await fs.createReadStream( source ).pipe( fs.createWriteStream( destination ) );
    resolve();
  })
}

/**
 * copy a folder
 *
 * @param {string} source folder
 * @param {string} destination folder
 */
function copyFolder( source, destination ) {
  info( 'cp', source, destination );
  return new Promise( async resolve => {

    await fs.ensureDirSync( destination );
    dirs = fs.readdirSync( source )

    for( dir of dirs ) {
      await copyFile( path.join( source, dir ), path.join( destination, dir ), true )
    }

    // await fs.createReadStream( source ).pipe( fs.createWriteStream( destination ) );
    resolve();
  })
}

module.exports = {
  copyFile,
  copyFolder,
  log,
  info,
  error,
  header
}