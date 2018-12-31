/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var suggestLibrary = require('./suggest');

describe('WKCSubscriptionsModuleCreateSuggestionsTypeComplete', function testWKCSubscriptionsModuleCreateSuggestionsTypeComplete() {

	it('returns constant', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsTypeComplete(), 'kWKCSubscriptionsModuleCreateSuggestionsTypeComplete');
	});

});

describe('WKCSubscriptionsModuleCreateSuggestionsTypeSecure', function testWKCSubscriptionsModuleCreateSuggestionsTypeSecure() {

	it('returns constant', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsTypeSecure(), 'kWKCSubscriptionsModuleCreateSuggestionsTypeSecure');
	});

});

describe('WKCSubscriptionsModuleCreateSuggestFor', function testWKCSubscriptionsModuleCreateSuggestFor() {

	it('throws error if not string', function() {
		assert.throws(function() {
			suggestLibrary.WKCSubscriptionsModuleCreateSuggestFor(null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns none if empty', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestFor(''), []);
	});

	it('returns none if blank', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestFor(' '), []);
	});

	it('returns none if word', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestFor('alfa'), []);
	});

	it('returns none if localhost', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestFor('localhost'), []);
	});

	it('returns urls from domain', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestFor('alfa.com'), [
			'https://alfa.com',
			'http://alfa.com',
			]);
	});

	it('returns urls from domain with slash', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestFor('alfa.com/bravo'), [
			'https://alfa.com/bravo',
			'http://alfa.com/bravo',
			]);
	});

	it('returns urls from domain with slash and query', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestFor('alfa.com/bravo?charlie=delta'), [
			'https://alfa.com/bravo?charlie=delta',
			'http://alfa.com/bravo?charlie=delta',
			]);
	});

	it('returns https if no http', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestFor('http://alfa.com/bravo'), [
			'https://alfa.com/bravo',
			]);
	});

	it('returns none if https', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestFor('https://alfa.com/bravo'), []);
	});

});
