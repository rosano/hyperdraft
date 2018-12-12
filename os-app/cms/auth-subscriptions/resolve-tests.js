/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var resolveLibrary = require('./resolve');
var jsDOMPackage = require('jsdom');
const { JSDOM } = jsDOMPackage;

const kTests = {
	kTestsURLValid: function() {
		return 'https://google.com';
	},
};

describe('WKCResolveRelativeURLs', function testWKCResolveRelativeURLs() {

	it('throws error if param1 not formatted', function() {
		assert.throws(function() {
			resolveLibrary.WKCResolveRelativeURLs('google.com', '');
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			resolveLibrary.WKCResolveRelativeURLs(kTests.kTestsURLValid(), null);
		}, /WKCErrorInvalidInput/);
	});

	it('resolves anchors', function() {
		assert.strictEqual(resolveLibrary.WKCResolveRelativeURLs(kTests.kTestsURLValid(), '<a href="/alfa">bravo</a>'), '<a href="https://google.com/alfa">bravo</a>');
	});

	it('resolves images', function() {
		assert.strictEqual(resolveLibrary.WKCResolveRelativeURLs(kTests.kTestsURLValid(), '<img src="/alfa">'), '<img src="https://google.com/alfa">');
	});

});
