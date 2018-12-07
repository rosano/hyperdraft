/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var logicLibrary = require('./ui-logic');

describe('WKSubscriptionsCompleteURL', function testWKSubscriptionsCompleteURL() {

	it('throws error if param1 not string', function() {
		assert.throws(function() {
			logicLibrary.WKSubscriptionsCompleteURL(null, 'https://google.com');
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param1 not filled', function() {
		assert.throws(function() {
			logicLibrary.WKSubscriptionsCompleteURL('', 'https://google.com');
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param2 not formatted', function() {
		assert.throws(function() {
			logicLibrary.WKSubscriptionsCompleteURL('/', 'google.com');
		}, /WKCErrorInvalidInput/);
	});

	it('returns input if formatted', function() {
		assert.strictEqual(logicLibrary.WKSubscriptionsCompleteURL('http://google.com/alfa', 'https://google.com'), 'http://google.com/alfa');
	});

	it('returns path appended to domain if root', function() {
		assert.strictEqual(logicLibrary.WKSubscriptionsCompleteURL('/alfa', 'https://google.com/bravo'), 'https://google.com/alfa');
	});

	it('returns path appended to url with slash', function() {
		assert.strictEqual(logicLibrary.WKSubscriptionsCompleteURL('alfa', 'https://google.com/bravo/'), 'https://google.com/bravo/alfa');
	});

	it('returns path appended to url with no slash', function() {
		assert.strictEqual(logicLibrary.WKSubscriptionsCompleteURL('alfa', 'https://google.com/bravo'), 'https://google.com/bravo/alfa');
	});

	it('returns path appended to url file', function() {
		assert.strictEqual(logicLibrary.WKSubscriptionsCompleteURL('alfa', 'https://google.com/bravo/charlie/delta.html'), 'https://google.com/bravo/charlie/alfa');
	});

	it('returns path appended to url file at root', function() {
		assert.strictEqual(logicLibrary.WKSubscriptionsCompleteURL('alfa', 'https://google.com/bravo.html'), 'https://google.com/alfa');
	});

	it('returns path appended to url query', function() {
		assert.strictEqual(logicLibrary.WKSubscriptionsCompleteURL('alfa', 'https://google.com/bravo?charlie'), 'https://google.com/bravo/alfa');
	});

	it('returns path appended to url hash', function() {
		assert.strictEqual(logicLibrary.WKSubscriptionsCompleteURL('alfa', 'https://google.com/bravo#charlie'), 'https://google.com/bravo/alfa');
	});

});
