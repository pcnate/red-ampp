const fork = require( 'child_process' ).fork;

var proxyProcess = null;
var responderRegistry = [];
var currentIdentifier = 0;
var routes = [];

/**
 * add a responder to the responderRegistry
 *
 * @param {string} type type of action
 * @param {string} folder folder that was acted upon
 * @param {function} success callback upon success
 * @param {function} error callback upon error
 */
function addResponder( type, folder, success, error ) {
  currentIdentifier++;

  let responder = {
    success,
    error,
    identifier: currentIdentifier
  }
  responderRegistry.push( responder );
  return responder.identifier;
}

/**
 * search for a mactching responder to the message
 * 
 * @param {object} message message from the child process
 */
function findResponder( message ) {

  let identifier = message.responderIdentifier;
  let success = message.success;

  matches = responderRegistry.filter( m => m.identifier === identifier );
  if( matches.length > 0 ) {

    matches = matches[0];
    
    if( success ) {
      if ( typeof matches.success === 'function' ) {
        matches.success();
        responderRegistry = responderRegistry.filter( m => m.identifier !== identifier );
      }
    }
    
    if( !success ) {
      if ( typeof matches.error === 'function' ) {
        matches.error();
        responderRegistry = responderRegistry.filter( m => m.identifier !== identifier );
      }
    }

  }

}

/**
 * fork the proxy.js process and restart it if it crashes
 */
function launchProxy() {
  return new Promise( async ( resolve, reject ) => {
    proxyProcess = await fork( './proxyWorker.js', { silent: true });

    proxyProcess.stdout.on('data', data => {})

    // watch for messages
    proxyProcess.on( 'message', message => {
      if( message === 'processReady' ) {
        resolve();
        return;
      }
      
      if( typeof message === 'object' ) {

        if( message.output ) {
          console.log( 'worker msg', message.output );
        }

        if( typeof message.type !== 'undefined' && message.type === 'registration_done' ) {
          findResponder( message );
        }
        if( typeof message.type !== 'undefined' && message.type === 'unregistration_done' ) {
          findResponder( message );
        }

        return;
      }

      console.log( 'unknown message', message );

    });
  
    // watch for process end
    proxyProcess.on( 'close', code => {
      console.error( 'proxy process terminated with code', code, '\n', 'restarting in a moment' );
      setTimeout( () => {
        launchProxy();
      }, 1000 );
    } );

  });
}

function checkProxy() {
  return new Promise( async ( resolve, reject ) => {
    if ( !proxyProcess ) {
      await launchProxy();
    }
    resolve();
  });
}

/**
 * register a path to folder to proxy to a destination
 *  - intentionally disallow other domains here
 *
 * @param {string} folder url folder that should be forwarded
 * @param {string} destination full path of the destination
 */
async function register( folder, destination, editable = true ) {
  return new Promise( async ( resolve, reject ) => {
    await checkProxy();

    let success = function() {
      addRoute( folder, destination, editable );
      resolve();
    }
    let error = function() {
      reject();
    }

    let responderIdentifier = addResponder( 'register', folder, success, error );

    let message = {
      type: 'register',
      responderIdentifier,
      folder,
      destination
    }
    
    proxyProcess.send( message );

  });
}

/**
 * unregister a path
 *   - should not allow self project unbinding
 * 
 * @param {string} folder proxied folder to unregister
 */
async function unregister( folder, destination ) {
  return new Promise( async ( resolve, reject ) => {
    await checkProxy();

    let success = function() {
      removeRoute( folder, destination );
      resolve();
    }
    let error = function() {
      reject();
    }
    
    let responderIdentifier = addResponder( 'unregister', folder, success, error );

    let message = {
      type: 'unregister',
      responderIdentifier,
      folder,
      destination
    }

    proxyProcess.send( message );
  });
}

function addRoute( folder, destination, editable = true ) {
  let route = {
    path: folder,
    destination,
    editable
  }

  routes.push( route );
}

function removeRoute( folder, destination ) {
  routes = routes.filter( m => !( m.path === folder && m.destination === destination ) );
}

function getRoutes() {
  return routes;
}

module.exports = {
  start: launchProxy,
  register,
  unregister,
  getRoutes,
}