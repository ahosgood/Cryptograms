'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cryptogram = function () {
	function Cryptogram(phrase, cypher) {
		var answers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

		_classCallCheck(this, Cryptogram);

		this.template = Handlebars.compile(document.getElementById('cryptogram-template').innerHTML);
		this.characterTemplate = Handlebars.compile(document.getElementById('character-template').innerHTML);

		this.phrase = phrase;
		this.phraseParts = [];
		this.cypher = cypher;
		this.answers = answers;

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = phrase.split(' ')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var word = _step.value;

				var wordData = [];

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = word.split('')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var letter = _step2.value;

						var isLetter = alphabet.indexOf(letter.toLowerCase()) !== -1;

						wordData.push({
							original: letter,
							letter: isLetter,
							cypher: isLetter ? this.cypher[letter.toLowerCase()] : '',
							uppercase: letter === letter.toUpperCase()
						});
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				this.phraseParts.push(wordData);
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		localStorage.removeItem('current');

		this.update();

		return this;
	}

	_createClass(Cryptogram, [{
		key: 'addAnswer',
		value: function addAnswer(cypher, letter) {
			this.removeAnswer(letter);

			this.answers[cypher] = letter;

			this.update();

			return this;
		}
	}, {
		key: 'removeAnswer',
		value: function removeAnswer(letter) {
			for (var answer in this.answers) {
				if (this.answers.hasOwnProperty(answer)) {
					if (this.answers[answer] === letter) {
						delete this.answers[answer];
					}
				}
			}

			this.update();

			return this;
		}
	}, {
		key: 'checkIfComplete',
		value: function checkIfComplete() {
			var answer = '';

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = this.phraseParts[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var word = _step3.value;
					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;

					try {
						for (var _iterator4 = word[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var letter = _step4.value;

							if (letter.letter) {
								answer += this.answers[letter.cypher] || '';
							} else {
								answer += letter.original;
							}
						}
					} catch (err) {
						_didIteratorError4 = true;
						_iteratorError4 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion4 && _iterator4.return) {
								_iterator4.return();
							}
						} finally {
							if (_didIteratorError4) {
								throw _iteratorError4;
							}
						}
					}

					answer += ' ';
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			return answer.trim().toLowerCase() === this.phrase.toLowerCase();
		}
	}, {
		key: 'update',
		value: function update() {
			if (this.checkIfComplete()) {
				alert('Well done!');

				getNextQuote().then(function (quote) {
					var phrase = $(quote.content).text().trim().replace(/[\r\n]/, ' ').replace('  ', ' ');

					currentCryptogram = new Cryptogram(phrase, generateCypher());
				}).catch(function (e) {
					return console.error(e);
				});
			} else {
				$('#cryptogram').html(this.template({ words: this.phraseParts, answers: this.answers }));

				var characters = {};

				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = alphabet.slice(0)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var letter = _step5.value;

						characters[letter] = {
							letter: letter,
							//used: Object.values( this.answers ).indexOf( letter ) !== -1
							used: false
						};
					}
				} catch (err) {
					_didIteratorError5 = true;
					_iteratorError5 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion5 && _iterator5.return) {
							_iterator5.return();
						}
					} finally {
						if (_didIteratorError5) {
							throw _iteratorError5;
						}
					}
				}

				$('#characters').html(this.characterTemplate(characters));

				localStorage.setItem('current', JSON.stringify({
					phrase: this.phrase,
					cypher: this.cypher,
					answers: this.answers
				}));
			}

			return this;
		}
	}]);

	return Cryptogram;
}();

var completedCryptograms = localStorage.getItem('completed');

try {
	JSON.parse(completedCryptograms);
} catch (e) {
	completedCryptograms = [];
}

var currentCryptogram = null,
    savedCryptogram = localStorage.getItem('current'),
    alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    cryptogramExists = function cryptogramExists() {
	if (savedCryptogram) {
		if (typeof savedCryptogram === 'string') {
			savedCryptogram = JSON.parse(savedCryptogram);
		}

		return savedCryptogram.hasOwnProperty('phrase') && savedCryptogram.hasOwnProperty('cypher') && savedCryptogram.hasOwnProperty('answers');
	} else {
		return false;
	}
},
    loadLastCryptogram = function loadLastCryptogram() {
	currentCryptogram = new Cryptogram(savedCryptogram.phrase, savedCryptogram.cypher, savedCryptogram.answers);
},
    getNextQuote = function getNextQuote() {
	return new Promise(function (resolve, reject) {
		fetch('//quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&rand=' + Math.random()).then(function (response) {
			if (response.status < 200 || response.status >= 400) {
				throw 'Error: ' + response.status + ' - ' + response.text();
			}

			return response;
		}).then(function (response) {
			return response.json();
		}).then(function (response) {
			return resolve(response[0]);
		}).catch(function (e) {
			return reject(e);
		});
	});
},
    generateCypher = function generateCypher() {
	var keys = alphabet.slice(0),
	    values = alphabet.slice(0),
	    cypher = {};

	values.sort(function () {
		return 0.5 - Math.random();
	});

	for (var key in keys) {
		if (keys.hasOwnProperty(key)) {
			cypher[keys[key]] = values[key];
		}
	}

	for (var cypherItem in cypher) {
		if (cypherItem === cypher[cypherItem]) {
			return generateCypher();
		}
	}

	return cypher;
},
    cryptogramElement = $('#cryptogram');

var startPos = { x: 0, y: 0 },
    dragItem = null;

$('#characters').on('touchstart mousedown', 'li:not(.used)', function (e) {
	var touch = e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0] || e;
	startPos = { x: touch.pageX, y: touch.pageY };
	var possibleDragItem = $(e.currentTarget);
	//if( possibleDragItem.attr( 'draggable' ) === 'true' ) {
	dragItem = possibleDragItem;
	dragItem.addClass('dragging');
	//}
});

$('body').on('touchmove mousemove', function (e) {
	if (dragItem) {
		var touch = e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0] || e,
		    dragPos = { x: touch.pageX, y: touch.pageY },
		    displace = { x: dragPos.x - startPos.x, y: dragPos.y - startPos.y };

		dragItem.css('transform', 'translate(' + displace.x + 'px, ' + displace.y + 'px)');
	}
}).on('touchend mouseup', function (e) {
	if (dragItem) {
		dragItem.css('transform', 'translate(0, 0)').removeClass('dragging');
		dragItem = null;
	}
});

cryptogramElement.on('dragover', '.letter', function (e) {
	e.preventDefault();
	e.stopPropagation();

	var dropItem = $(e.currentTarget);
	//console.log( dropItem.attr( 'data-cypher' ), dragItem.attr( 'data-letter' ) );

	cryptogramElement.find('.letter[data-cypher="' + dropItem.attr('data-cypher') + '"]').addClass('active');
}).on('dragleave', '.letter', function (e) {
	e.preventDefault();
	e.stopPropagation();

	cryptogramElement.find('.letter.active').removeClass('active');
}).on('drop', '.letter', function (e) {
	e.preventDefault();
	e.stopPropagation();

	var dropItem = $(e.currentTarget);

	//dragItem.attr( 'draggable', 'false' );

	currentCryptogram.addAnswer(dropItem.attr('data-cypher'), dragItem.attr('data-letter')).update();
});

if (cryptogramExists()) {
	loadLastCryptogram();
} else {
	getNextQuote().then(function (quote) {
		var phrase = $(quote.content).text().trim().replace(/[\r\n]/, ' ').replace('  ', ' ');

		currentCryptogram = new Cryptogram(phrase, generateCypher());
	}).catch(function (e) {
		return console.error(e);
	});
}