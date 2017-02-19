let quotes = 1;

fetch( '//quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=' + quotes )
	.then( response => {
		if( response.status < 200 || response.status >= 400 ) {
			throw 'Error: ' + response.status + ' - ' + response.text();
		}

		return response;
	} )
	.then( response => response.json() )
	.then( response => {
		console.log( response );
	} )
	.catch( e => {
	} );