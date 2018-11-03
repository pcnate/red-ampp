require('dotenv').config();

const proxy = require('./proxy');
const app = require('express')();
const http = require('http').Server( app );
const storage = require('node-persist');

// app use stuff here

// start the proxy
proxy.start().then( () => {
  
  proxy.register( '/test', 'localhost:3333' )
  .then( () => {
    console.log( 'registered', '/test', 'done' );
  })
  .catch( error => {
    console.error( 'error registering', '/test' );
  });
  
  listener = http.listen(() => {
    const port = listener.address().port;
    console.log( 'management app listening on port', port );
    
    // if in development, load angular from port 4200
    const gui_port = process.env.NODE_ENV !== 'production' ? 4200 : port;
    
    // angular development mode
    if( process.env.NODE_ENV !== 'production' ) {
      proxy.register( '/sockjs-node', 'localhost:' + gui_port + '/sockjs-node' )
      .then(() => {})
      .catch(error => {
        console.error( 'unknown error binding angular sockjs_node' );
      });
    }

    // bind the management portal
    proxy.register( '/red-ampp', 'localhost:' + gui_port )
      .then( () => {
        console.log( 'access the management portal at http://localhost/red-ampp' );
      })
      .catch( error => {
        console.error( 'unknown error binding the management portal' );
      });
    proxy.register( '/red-ampp/api', 'localhost:' + port )
      .then( () => {})
      .catch( error => {
        console.error( 'unknown error binding the management portal api' );
      });
  })

});

// listen for a few paths
app.get('/', ( request, response ) => {
  response.send('success');
});
