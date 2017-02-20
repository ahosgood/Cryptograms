let completedCryptograms = localStorage.getItem( 'completed' );

try {
	JSON.parse( completedCryptograms );
} catch( e ) {
	completedCryptograms = [];
}

let alphabet = {
			a: 'a',
			b: 'b',
			c: 'c',
			d: 'd',
			e: 'e',
			f: 'f',
			g: 'g',
			h: 'h',
			i: 'i',
			j: 'j',
			k: 'k',
			l: 'l',
			m: 'm',
			n: 'n',
			o: 'o',
			p: 'p',
			q: 'q',
			r: 'r',
			s: 's',
			t: 't',
			u: 'u',
			v: 'v',
			w: 'w',
			x: 'x',
			y: 'y',
			z: 'z'
		},
		cryptograpmExists = () => {
			return false;
		},
		getNextQuote = () => {
			return new Promise( ( resolve, reject ) => {
				fetch( '//quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&rand=' + Math.random() )
						.then( response => {
							if( response.status < 200 || response.status >= 400 ) {
								throw 'Error: ' + response.status + ' - ' + response.text();
							}

							return response;
						} )
						.then( response => response.json() )
						.then( response => resolve( response[0] ) )
						.catch( e => reject( e ) );
			} );
		},
		generateCypher = () => {
			let keys = Object.values( alphabet ),
					values = Object.values( alphabet ),
					cypher = {};

			values.sort( function() { return 0.5 - Math.random() } );

			for( let key in keys ) {
				if( keys.hasOwnProperty( key ) ) {
					cypher[keys[key]] = values[key];
				}
			}

			return cypher;
		};


if( !cryptograpmExists() ) {

	getNextQuote()
			.then( quote => {
				let phrase = $( quote.content ).text();

				new Cryptogram( phrase, generateCypher() );
			} )
			.catch( e => console.error( e ) );

}


class Cryptogram {

	constructor( phrase, cypher, answers = {} ) {

		this.phraseParts = [];
		this.template = Handlebars.compile( $( '#cryptogram-template' ).html() );

		for( let word of phrase.split( ' ' ) ) {
			let wordData = [];

			for( let letter of word.split( '' ) ) {
				wordData.push( {
					original: letter,
					cypher: cypher.hasOwnProperty( letter.toLowerCase() ) ? cypher[letter.toLowerCase()] : ''
				} );
			}

			this.phraseParts.push( wordData );
		}

		this.update();

	}

	update() {

		let context = {words: this.phraseParts};

		console.log( context );

		$( '#cryptogram' ).html( this.template( context ) );

	}

}