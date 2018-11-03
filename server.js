require('dotenv').config();

const proxy = require('./proxy');
const app = require('express')();
const http = require('http').Server( app );
const bodyParser = require('body-parser');

const storage = require('node-persist');

const baseAPI = '/red-ampp/api/';

// app use stuff here
app.use( bodyParser() );

// start the proxy
proxy.start().then( () => {
  
  listener = http.listen(() => {
    const port = listener.address().port;
    console.log( 'management app listening on port', port );
    
    // if in development, load angular from port 4200
    const gui_port = process.env.NODE_ENV !== 'production' ? 4200 : port;
    
    // angular development mode
    if( process.env.NODE_ENV !== 'production' ) {
      proxy.register( '/sockjs-node', 'localhost:' + gui_port + '/sockjs-node', false )
      .then(() => {})
      .catch(error => {
        console.error( 'unknown error binding angular sockjs_node' );
      });
    }

    // bind the management portal
    proxy.register( '/red-ampp', 'localhost:' + gui_port, false )
      .then( () => {
        console.log( 'access the management portal at http://localhost/red-ampp' );
      })
      .catch( error => {
        console.error( 'unknown error binding the management portal' );
      });
    proxy.register( '/red-ampp/api', 'localhost:' + port + '/red-ampp/api', false )
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

app.get( baseAPI + 'getRoutes', ( request, response ) => {
  response.send( proxy.getRoutes() );
});

app.post( baseAPI + 'register', ( request, response ) => {
  proxy.register( request.body.path, request.body.destination )
  .then( () => {
    response.send({
      success: true
    });
  })
  .catch( error => {
    response.status(500).send({
      sucess: false,
    })
  })
});
app.post( baseAPI + 'unregister', ( request, response ) => {
  proxy.unregister( request.body.path, request.body.destination )
  .then( () => {
    response.send({
      success: true
    });
  })
  .catch( error => {
    response.status(500).send({
      sucess: false,
    })
  })
});
