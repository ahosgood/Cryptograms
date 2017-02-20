'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var completedCryptograms = localStorage.getItem('completed');

try {
	JSON.parse(completedCryptograms);
} catch (e) {
	completedCryptograms = [];
}

var alphabet = {
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
    cryptograpmExists = function cryptograpmExists() {
	return false;
},
    getNextQuote = function getNextQuote() {
	return new Promise(function (resolve, reject) {
		fetch('//quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1').then(function (response) {
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
	var keys = Object.values(alphabet),
	    values = Object.values(alphabet),
	    cypher = {};

	values.sort(function () {
		return 0.5 - Math.random();
	});

	for (var key in keys) {
		if (keys.hasOwnProperty(key)) {
			cypher[keys[key]] = values[key];
		}
	}

	return cypher;
};

if (!cryptograpmExists()) {

	getNextQuote().then(function (quote) {
		var phrase = $(quote.content).text();

		new Cryptogram(phrase, generateCypher());
	}).catch(function (e) {
		return console.error(e);
	});
}

var Cryptogram = function () {
	function Cryptogram(phrase, cypher) {
		var answers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

		_classCallCheck(this, Cryptogram);

		this.phraseParts = [];
		this.template = Handlebars.compile($('#cryptogram-template').html());

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

						wordData.push({
							original: letter,
							cypher: cypher.hasOwnProperty(letter.toLowerCase()) ? cypher[letter.toLowerCase()] : ''
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

		this.update();
	}

	_createClass(Cryptogram, [{
		key: 'update',
		value: function update() {

			var context = { words: this.phraseParts };

			console.log(context);

			$('#cryptogram').html(this.template(context));
		}
	}]);

	return Cryptogram;
}();