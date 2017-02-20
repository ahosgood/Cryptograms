"use strict";

const http = require( 'http' ),
		url = require( 'url' ),
		fs = require( 'fs' ),
		path = require( 'path' );

let port = 8000;

http
		.createServer( ( request, response ) => {
			try {
				let requestUrl = url.parse( request.url ),
						fsPath = './' + path.normalize( requestUrl.pathname );

				if( requestUrl.pathname.replace( /^[\/\\]/, '' ) === '' ) {
					fsPath = './index.html';
				}

				response.writeHead( 200 );

				fs.createReadStream( fsPath )
						.pipe( response )
						.on( 'error', e => {
							response.writeHead( 404 );
							response.end();

							console.log( e.stack );
						} );
			} catch( e ) {
				response.writeHead( 500 );
				response.end();

				console.log( e.stack );
			}
		} )
		.listen( port );