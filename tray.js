// import { NotifyIcon, Icon, Menu } from "not-the-systray";
const spawn = require( 'child_process' ).spawn;
let path = require('path')
let opn = require('opn')
let { NotifyIcon, Icon, Menu } = require('not-the-systray')

const favIcon        = path.join(...[ __dirname, 'src', 'favicon.ico' ])
const favIconIdle    = path.join(...[ __dirname, 'src', 'faviconIdle.ico' ])
const favIconRunning = path.join(...[ __dirname, 'src', 'faviconRunning.ico' ])

proxyRunning = false
proxyProcess = null

// Creates an empty (blank) icon in the notification area
// that does nothing.
// Unfortunately the Windows terminology I'm exposing here is
// pretty confusing, they have "Notification icons" that have
// icons and can show notifications that also have icons.
const emptyIcon = new NotifyIcon();
emptyIcon.remove(); // Remove it!

// Creates and adds an initialized icon, with a select callback.
const appIcon = new NotifyIcon( {
  icon: Icon.load( favIconIdle, Icon.small ), // Notify icons should use 
  tooltip: "Red-Ampp",
  onSelect( { target, rightButton, mouseX, mouseY } ) {
    // `this` is `target` is `appIcon`.
    // `rightButton` is which mouse button it was selected with,
    // `mouseX and `mouseX` are the screen co-ordinates of the click.
    // If selected with the keyboard, these values will be simulated.

    if ( rightButton ) {
      handleMenu( mouseX, mouseY );
    } else {
      if( proxyRunning ) {
        openSettings()
      }
    }
  },
} );

// Notifications should use the size `Icon.large`.
// Icons can be loaded ahead of time to catch errors earlier,
// and save a bit of time and memory.
const notificationIcon = Icon.load( favIcon, Icon.large );
// You can also use some built-in icons, for example:
const errorIcon = Icon.load( Icon.ids.error, Icon.large );

const toggleId = 1;
const openUrlId = 2;
const ExitId = 3;

const menu = new Menu( [
  { id: toggleId, text: "Start", checked: proxyRunning },
  { id: openUrlId, text: "Open Settings" },
  { separator: true },
  { id: ExitId, text: "Exit" }
] );

/**
 * 
 * @param {string} title title of the notification
 * @param {string} text text to show on the notification
 * @param {Icon} icon optional icon to display
 */
function showNotification( title, text, icon = notificationIcon ) {
  if ( icon !== notificationIcon ) {
    icon = Icon.load( icon, Icon.large )
  }
  appIcon.update( { notification: { icon, title, text }, } );
}

/**
 * tell the system to open the settings page with the default browser
 */
function openSettings() {
  var url = 'http://localhost/red-ampp/';
  opn( url )
}

/**
 * start the server
 */
async function startServer() {
  if ( !proxyRunning ) {

    if ( process.pkg ) {
      proxyProcess = await spawn( 'RedAmpp.exe', {
        windowsHide: true,
        stdio: [ 'ignore', 'ignore', 'inherit', 'ipc' ],
      } );
    } else {
      proxyProcess = await spawn( 'node', [ path.join( __dirname, 'server.js' ) ], {
        windowsHide: true,
        stdio: [ 'ignore', 'ignore', 'inherit', 'ipc' ],
      } );
    }

    if( proxyProcess ) {
      showNotification( 'Red-Ampp', 'Proxy started', favIconRunning )
    }

    if ( typeof proxyProcess.stderr !== 'undefined' && proxyProcess.stderr !== null ) {
      proxyProcess.stderr.on( 'data', ( error ) => {
        console.error( 'spawn error', error.toString() );
      });
    }

    if ( typeof proxyProcess.stdout !== 'undefined' && proxyProcess.stdout !== null ) {
      proxyProcess.stdout.on('data', data => {})
    }

    // watch for messages
    proxyProcess.on( 'message', message => {
      // console.log( 'unknown message', message );
    })

    // watch for process end
    proxyProcess.on( 'close', code => {
      proxyRunning = false
      showNotification( 'Red-Ampp', 'Proxy stopped', favIconIdle )
      proxyProcess = null
      menu.update( toggleId, { checked: proxyRunning } )
      appIcon.update({ icon: Icon.load( favIconIdle, Icon.small ) })
    } );

    proxyRunning = true
    menu.update( toggleId, { checked: proxyRunning })
    appIcon.update({ icon: Icon.load( favIconRunning, Icon.small ) })
  }
}

/**
 * stop the server
 */
function stopServer() {
  try {
    proxyProcess.kill()
  } catch( error ) {
    proxyRunning = false
    menu.update( toggleId, { checked: proxyRunning })
    appIcon.update({ icon: Icon.load( favIconIdle, Icon.small ) })
  }
}

/**
 * 
 * @param {number} mouseX coordinate
 * @param {number} mouseY coordinate
 */
function handleMenu( mouseX, mouseY ) {
  const id = menu.showSync( mouseX, mouseY );
  switch ( id ) {
    case null:
      // user cancelled selection.
      break;
    case toggleId: {
      if ( proxyRunning ) {
        stopServer();
      } else {
        startServer();
      }
      menu.update( toggleId, { checked: proxyRunning } );
      break;
    }
    case openUrlId:
      if( !proxyRunning ) {
        break;
      }
      openSettings();
      break;
    case ExitId:
      // Ids work in submenus too.
      console.log( "Exiting" );
      stopServer()
      appIcon.remove()
      process.exit()
      break;
  }
}

// launch the server
startServer()
