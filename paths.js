const path = require('path');

// get the users folder on whichever platform
const userFolder = process.env.APPDATA || path.join( process.env.HOME, ( process.platform == 'darwin' ? 'Library/Preferences' : '.config') );

const appFolder = 'red-ampp';

const configFolder = path.join( userFolder, appFolder );

module.exports = {
  userFolder,
  appFolder,
  configFolder,
}