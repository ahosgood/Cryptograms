'use strict';

var quotes = 1;

fetch('//quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=' + quotes).then(function (response) {
	if (response.status < 200 || response.status >= 400) {
		throw 'Error: ' + response.status + ' - ' + response.text();
	}

	return response;
}).then(function (response) {
	return response.json();
}).then(function (response) {
	console.log(response);
}).catch(function (e) {});