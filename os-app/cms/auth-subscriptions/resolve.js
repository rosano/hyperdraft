/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var urlPackage = require('url');
var jsDOMPackage = require('jsdom');
const { JSDOM } = jsDOMPackage;

//_ WKCResolveRelativeURLs

exports.WKCResolveRelativeURLs = function(absoluteURL, sourceHTML) {
	if (!/^(http|https):\/\/[^ "]+$/.test(absoluteURL)) {
		throw new Error('WKCErrorInvalidInput');
	}

	if (typeof sourceHTML !== 'string') {
		throw new Error('WKCErrorInvalidInput');
	}

	var domObject = new JSDOM(sourceHTML);

	[].slice.call(domObject.window.document.getElementsByTagName('a')).forEach(function(e) {
		e.href = urlPackage.resolve(absoluteURL, e.href);
	});

	[].slice.call(domObject.window.document.getElementsByTagName('img')).forEach(function(e) {
		e.src = urlPackage.resolve(absoluteURL, e.src);
	});

	return domObject.window.document.body.innerHTML;
};
