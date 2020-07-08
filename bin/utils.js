const os = require('os');
var fs = require('fs');
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
function copyFile( source, destination ) {
  info( 'cp', source, destination );
  return new Promise( async resolve => {
    await fs.createReadStream( source ).pipe( fs.createWriteStream( destination ) );
    resolve();
  })
}

module.exports = {
  copyFile,
  log,
  info,
  error,
  header
}