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
  let returncode = proxy.register( 'localhost' + folder, destination );
  process.send({ type: 'registration_done', responderIdentifier, folder, success: returncode ? true : false });
}

function removeRegistration( responderIdentifier, folder, destination ) {
  let returncode = proxy.unregister( 'localhost' + folder, destination );
  process.send( { type: 'unregistration_done', responderIdentifier, folder, success: returncode ? true : false });
}

// start the redbird proxy
var proxy = require( 'redbird' )( {
  port: 80,
} );

// standard blank site
proxy.register( 'localhost', 'http://localhost:3000' );

process.send('processReady');
