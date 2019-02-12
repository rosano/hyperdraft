/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var resolveLibrary = require('./resolve');
var jsDOMPackage = require('jsdom');
const {
	JSDOM
} = jsDOMPackage;

describe('WKCResolveRelativeURLs', function testWKCResolveRelativeURLs() {

	it('throws error if param1 not formatted', function() {
		assert.throws(function() {
			resolveLibrary.WKCResolveRelativeURLs('google.com', '');
		}, /WKCErrorInputInvalid/);
	});

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			resolveLibrary.WKCResolveRelativeURLs('https://google.com', null);
		}, /WKCErrorInputInvalid/);
	});

	it('includes a href', function() {
		assert.strictEqual(resolveLibrary.WKCResolveRelativeURLs('https://google.com', '<a href="/alfa">bravo</a>'), '<a href="https://google.com/alfa">bravo</a>');
	});

	it('includes img src', function() {
		assert.strictEqual(resolveLibrary.WKCResolveRelativeURLs('https://google.com', '<img src="/alfa">'), '<img src="https://google.com/alfa">');
	});

	it('ignores anchors', function() {
		assert.strictEqual(resolveLibrary.WKCResolveRelativeURLs('https://google.com', '<a href="#alfa">bravo</a>'), '<a href="about:blank#alfa">bravo</a>');
	});

	it('resolves queries', function() {
		assert.strictEqual(resolveLibrary.WKCResolveRelativeURLs('https://google.com', '<a href="?alfa">bravo</a>'), '<a href="https://google.com/?alfa">bravo</a>');
	});

	it('resolves non-trailing slash', function() {
		assert.strictEqual(resolveLibrary.WKCResolveRelativeURLs('https://google.com/charlie', '<a href="alfa">bravo</a>'), '<a href="https://google.com/alfa">bravo</a>');
	});

	it('resolves file page', function() {
		assert.strictEqual(resolveLibrary.WKCResolveRelativeURLs('https://google.com/charlie/delta.html', '<a href="alfa">bravo</a>'), '<a href="https://google.com/charlie/alfa">bravo</a>');
	});

});
