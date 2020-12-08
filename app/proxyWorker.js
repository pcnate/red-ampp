#!/usr/bin/env node
require( 'dotenv' ).config();
const bindToPort = process.env.port || 80
const hostName = 'localhost:'+bindToPort

// listen for new messages
process.on('message', async message => {

  if( typeof message === 'object' ) {

    if( typeof message.type !== 'undefined' && message.type === 'register' ) {
      let folder = message.folder;
      let destination = message.destination;
      let responderIdentifier = message.responderIdentifier;
      addRegistration( responderIdentifier, folder, destination );
      return;
    }
    if( typeof message.type !== 'undefined' && message.type === 'unregister' ) {
      let folder = message.folder;
      let destination = message.destination;
      let responderIdentifier = message.responderIdentifier;
      removeRegistration( responderIdentifier, folder, destination );
      return;
    }
    log('it is an object', JSON.stringify( message ) );
    return;
  }
  log('it is not an object');
});

// basic logging back to the parent
function log( ...message ) {
  process.send({ output: message.join(' ') });
}

function addRegistration( responderIdentifier, folder, destination ) {
  let returncode = proxy.register( hostName + folder, destination );
  process.send({ type: 'registration_done', responderIdentifier, folder, success: returncode ? true : false });
}

function removeRegistration( responderIdentifier, folder, destination ) {
  let returncode = proxy.unregister( hostName + folder, destination );
  process.send( { type: 'unregistration_done', responderIdentifier, folder, success: returncode ? true : false });
}

// start the redbird proxy
var proxy = require( 'redbird' )( {
  port: bindToPort,
  resolvers: [
    function( host, url ) {
      process.send({ type: 'countRequest', host, url });
      return proxy._defaultResolver( host, url );
    }
  ]
} );

process.send({ type: 'processReady', PID: process.pid });
