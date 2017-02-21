class Cryptogram {

	constructor( phrase, cypher, answers = {} ) {
		this.template = Handlebars.compile( document.getElementById( 'cryptogram-template' ).innerHTML );
		this.characterTemplate = Handlebars.compile( document.getElementById( 'character-template' ).innerHTML );

		this.phrase = phrase;
		this.phraseParts = [];
		this.cypher = cypher;
		this.answers = answers;

		for( let word of phrase.split( ' ' ) ) {
			let wordData = [];

			for( let letter of word.split( '' ) ) {
				let isLetter = alphabet.indexOf( letter.toLowerCase() ) !== -1;

				wordData.push( {
					original: letter,
					letter: isLetter,
					cypher: isLetter ? this.cypher[letter.toLowerCase()] : '',
					uppercase: letter === letter.toUpperCase()
				} );
			}

			this.phraseParts.push( wordData );
		}

		localStorage.removeItem( 'current' );

		this.update();

		return this;
	}

	addAnswer( cypher, letter ) {
		this.removeAnswer( letter );

		this.answers[cypher] = letter;

		this.update();

		return this;
	}

	removeAnswer( letter ) {
		for( let answer in this.answers ) {
			if( this.answers.hasOwnProperty( answer ) ) {
				if( this.answers[answer] === letter ) {
					delete this.answers[answer];
				}
			}
		}

		this.update();

		return this;
	}

	checkIfComplete() {
		let answer = '';

		for( let word of this.phraseParts ) {
			for( let letter of word ) {
				if( letter.letter ) {
					answer += this.answers[letter.cypher] || '';
				} else {
					answer += letter.original;
				}
			}

			answer += ' ';
		}

		return answer.trim().toLowerCase() === this.phrase.toLowerCase();
	}

	update() {
		if( this.checkIfComplete() ) {
			alert( 'Well done!' );

			getNextQuote()
				.then( quote => {
					let phrase = $( quote.content ).text().trim().replace( /[\r\n]/, ' ' ).replace( '  ', ' ' );

					currentCryptogram = new Cryptogram( phrase, generateCypher() );
				} )
				.catch( e => console.error( e ) );

			return this;
		} else {
			$( '#cryptogram' ).html( this.template( { words: this.phraseParts, answers: this.answers } ) );

			let characters = {};

			for( let letter of alphabet.slice( 0 ) ) {
				characters[letter] = {
					letter: letter,
					used: Object.values( this.answers ).indexOf( letter ) !== -1
					//used: false
				};
			}

			$( '#characters' ).html( this.characterTemplate( characters ) );

			localStorage.setItem( 'current', JSON.stringify( {
				phrase: this.phrase,
				cypher: this.cypher,
				answers: this.answers
			} ) );
		}


		return this;
	}

}

let completedCryptograms = localStorage.getItem( 'completed' );

try {
	JSON.parse( completedCryptograms );
} catch( e ) {
	completedCryptograms = [];
}

let currentCryptogram = null,
	savedCryptogram = localStorage.getItem( 'current' ),
	alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
	cryptogramExists = () => {
		if( savedCryptogram ) {
			if( typeof savedCryptogram === 'string' ) {
				savedCryptogram = JSON.parse( savedCryptogram );
			}

			return savedCryptogram.hasOwnProperty( 'phrase' ) && savedCryptogram.hasOwnProperty( 'cypher' ) && savedCryptogram.hasOwnProperty( 'answers' );
		} else {
			return false;
		}
	},
	loadLastCryptogram = () => {
		currentCryptogram = new Cryptogram( savedCryptogram.phrase, savedCryptogram.cypher, savedCryptogram.answers );
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

		//http://forismatic.com/en/api/
		//http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en
		/*return new Promise( ( resolve, reject ) => {
			//fetch( 'http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en&rand=' + Math.random(), {
			fetch( 'http://api.forismatic.com/api/1.0/', {

				method: 'POST',
				//credentials: 'include',
				mode: 'cors',
				headers: new Headers( {
					'Content-Type': 'application/x-www-form-urlencoded;'
				} ),
				body: 'method=getQuote&format=json&lang=en&rand=' + Math.random()



			} )
				.then( response => {
					console.log( response );
					window.dev = response;

					return response;
				} )
				.then( response => response.json() )
				.then( response => resolve( response.quoteText ) )
				.catch( e => reject( e ) );
		} );*/
	},
	generateCypher = () => {
		let keys = alphabet.slice( 0 ),
			values = alphabet.slice( 0 ),
			cypher = {};

		values.sort( function() {
			return 0.5 - Math.random()
		} );

		for( let key in keys ) {
			if( keys.hasOwnProperty( key ) ) {
				cypher[keys[key]] = values[key];
			}
		}

		for( let cypherItem in cypher ) {
			if( cypherItem === cypher[cypherItem] ) {
				return generateCypher();
			}
		}

		return cypher;
	},
	cryptogramElement = $( '#cryptogram' );

let startPos = { x: 0, y: 0 },
	dragItem = null;

$( '#characters' )
	.on( 'touchstart mousedown', 'li', e => {
		let touch = ( e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0] ) || e;
		startPos = { x: touch.pageX, y: touch.pageY };
		let possibleDragItem = $( e.currentTarget );
		//if( possibleDragItem.attr( 'draggable' ) === 'true' ) {
			dragItem = possibleDragItem;
			dragItem.addClass( 'dragging' );
		//}
	} );

$( 'body' )
	.on( 'touchmove mousemove', e => {
		if( dragItem ) {
			let touch = ( e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0] ) || e,
				dragPos = { x: touch.pageX, y: touch.pageY },
				displace = { x: dragPos.x - startPos.x, y: dragPos.y - startPos.y };

			dragItem
				.css( 'transform', 'translate(' + displace.x + 'px, ' + displace.y + 'px)' );
		}
	} )
	.on( 'touchend mouseup', e => {
		if( dragItem ) {
			dragItem
				.css( 'transform', 'translate(0, 0)' )
				.removeClass( 'dragging' );
			dragItem = null;
		}
	} );

cryptogramElement
	.on( 'dragover', '.letter', e => {
		e.preventDefault();
		e.stopPropagation();

		let dropItem = $( e.currentTarget );
		//console.log( dropItem.attr( 'data-cypher' ), dragItem.attr( 'data-letter' ) );

		cryptogramElement.find( '.letter[data-cypher="' + dropItem.attr( 'data-cypher' ) + '"]' ).addClass( 'active' );
	} )
	.on( 'dragleave', '.letter', e => {
		e.preventDefault();
		e.stopPropagation();

		cryptogramElement.find( '.letter.active' ).removeClass( 'active' );
	} )
	.on( 'drop', '.letter', e => {
		e.preventDefault();
		e.stopPropagation();

		let dropItem = $( e.currentTarget );

		//dragItem.attr( 'draggable', 'false' );

		currentCryptogram
			.addAnswer( dropItem.attr( 'data-cypher' ), dragItem.attr( 'data-letter' ) );
	} )
	.on( 'touchmove', '.letter', e => {
		console.log( 'oover ' );
	} );

if( cryptogramExists() ) {
	loadLastCryptogram();
} else {
	getNextQuote()
		.then( quote => {
			let phrase = $( quote.content ).text().trim().replace( /[\r\n]/, ' ' ).replace( '  ', ' ' );

			currentCryptogram = new Cryptogram( phrase, generateCypher() );
		} )
		.catch( e => console.error( e ) );
}