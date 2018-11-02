require('dotenv').config();

const proxy = require('./proxy');
const app = require('express')();
const http = require('http').Server( app );

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
    let port = listener.address().port;
    console.log( 'management app listening on port', port );
    proxy.register( '/red-ampp', 'localhost:' + port )
      .then( () => {
        console.log( 'access the management portal at http://localhost/red-ampp' );
      })
      .catch( error => {
        console.error( 'unknown error binding the management portal' );
      });
  })

});

// listen for a few paths
app.get('/', ( request, response ) => {
  response.send('success');
});
