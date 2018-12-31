/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var suggestLibrary = require('./suggest');

describe('WKCSubscriptionsModuleCreateSuggestionsTypeStandard', function testWKCSubscriptionsModuleCreateSuggestionsTypeStandard() {

	it('returns constant', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsTypeStandard(), 'SuggestionsTypeStandard');
	});

});

describe('WKCSubscriptionsModuleCreateSuggestionsTypeSecure', function testWKCSubscriptionsModuleCreateSuggestionsTypeSecure() {

	it('returns constant', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsTypeSecure(), 'SuggestionsTypeSecure');
	});

});

describe('WKCSubscriptionsModuleCreateSuggestionsFor', function testWKCSubscriptionsModuleCreateSuggestionsFor() {

	it('throws error if not string', function() {
		assert.throws(function() {
			suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor(null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns none if empty', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor(''), []);
	});

	it('returns none if blank', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor(' '), []);
	});

	it('returns none if word', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor('alfa'), []);
	});

	it('returns none if localhost', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor('localhost'), []);
	});

	it('returns urls from domain', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor('alfa.com').map(function (e) {
			return e.WKCSuggestionURL;
		}), [
			'https://alfa.com',
			'http://alfa.com',
			]);
	});

	it('returns urls from domain with slash', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor('alfa.com/bravo').map(function (e) {
			return e.WKCSuggestionURL;
		}), [
			'https://alfa.com/bravo',
			'http://alfa.com/bravo',
			]);
	});

	it('returns urls from domain with slash and query', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor('alfa.com/bravo?charlie=delta').map(function (e) {
			return e.WKCSuggestionURL;
		}), [
			'https://alfa.com/bravo?charlie=delta',
			'http://alfa.com/bravo?charlie=delta',
			]);
	});

	it('returns https if no http', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor('http://alfa.com/bravo').map(function (e) {
			return e.WKCSuggestionURL;
		}), [
			'https://alfa.com/bravo',
			]);
	});

	it('returns none if https', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor('https://alfa.com/bravo').map(function (e) {
			return e.WKCSuggestionURL;
		}), []);
	});

});
