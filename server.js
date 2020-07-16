#!/usr/bin/env node
require('redbird');
const proxy      = require('./app/proxy');
const express    = require('express');
const path       = require('path');
const paths      = require('./paths');
const app        = express();
const http       = require('http').Server( app );
const bodyParser = require('body-parser');
const io         = require('socket.io')( http, {
  path: '/socket.io/',
});

if ( !process.env.NODE_ENV && process.pkg ) {
  process.env.NODE_ENV = 'production';
}

const storage = require('node-persist');
storage.init({
  dir: paths.configFolder
});

const baseAPI = '/red-ampp/api/';
var port = 0;
var address = 0;

// app use stuff here
app.use( bodyParser.urlencoded({
  extended: true,
}) );
app.use( bodyParser.json() );

// start the proxy
proxy.start().then( () => {
  
  listener = http.listen(() => {

    // save for status and later usage
    port = listener.address().port;
    address = listener.address().address;

    console.log( 'management app listening on port', port );
    
    // if in development, load angular from port 4200
    const gui_port = process.env.NODE_ENV === 'development' ? 4200 : port;
    
    // angular development mode
    if( process.env.NODE_ENV === 'development' ) {
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
    proxy.register( '/red-ampp/socket.io', 'localhost:' + port + '/socket.io', false )
      .then( () => {})
      .catch( error => {
        console.error( 'unknown error binding the management portal socket.io' );
      });

    storage.forEach( async datum => {
      let [ path, destination ] = JSON.parse( datum.key );
      await proxy.register( path, destination, datum.value );
    })
  });

});

// listen for a few paths
app.get( baseAPI + 'getRoutes', ( request, response ) => {
  response.send( proxy.getRoutes() );
});

app.post( baseAPI + 'register', ( request, response ) => {
  proxy.register( request.body.path, request.body.destination )
  .then( async() => {
    let item = JSON.stringify( [ request.body.path, request.body.destination ] );
    await storage.setItem( item, true );
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
  .then( async() => {
    let item = JSON.stringify( [ request.body.path, request.body.destination ] );
    await storage.removeItem( item, true );
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

app.get( baseAPI + 'status', ( request, response ) => {
  let status = {
    address,
    port,
    proxy: proxy ? true : false,
    requests: proxy.getRequestStats(),
    PID: process.pid,
    redbirdPID: proxy.getRedbirdPID(),
  };

  response.send( status );
});

if ( process.env.NODE_ENV !== 'development' ) {
  app.use( express.static( path.join( __dirname, 'dist' ) ) );

  app.get( '*', ( request, response ) => {
    response.sendFile( path.join( __dirname, 'dist/index.html' ) );
  });
}

proxy.registerLogHandler( ( host, url ) => {
  io.emit( 'new-log-entry', {
    host,
    url,
  })
});
