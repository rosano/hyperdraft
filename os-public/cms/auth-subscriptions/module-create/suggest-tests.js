/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var suggestLibrary = require('./suggest');

const kTestingSuggestionTwitterFor = function(inputData) {
	return {
		WKCSuggestionType: suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsTypeCustomTwitter(),
		WKCSuggestionURL: 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name='.concat(inputData),
	};
};

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

describe('WKCSubscriptionsModuleCreateSuggestionsTypeCustomTwitter', function testWKCSubscriptionsModuleCreateSuggestionsTypeCustomTwitter() {

	it('returns constant', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsTypeCustomTwitter(), 'SuggestionsTypeCustomTwitter');
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

	context('Twitter', function() {

		it('returns none if disconnected', function() {
			assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor('@ alfa'), []);
		});

		it('returns url if letters', function() {
			assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor('@alfa'), [
				kTestingSuggestionTwitterFor('alfa'),
				]);
		});

		it('returns url if numbers', function() {
			assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor('@alfa1'), [
				kTestingSuggestionTwitterFor('alfa1'),
				]);
		});

		it('returns url if underscore', function() {
			assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor('@alfa_bravo'), [
				kTestingSuggestionTwitterFor('alfa_bravo'),
				]);
		});

		it('returns none if hyphen', function() {
			assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor('@alfa-bravo'), []);
		});

		it('returns none if space', function() {
			assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor('@alfa bravo'), []);
		});

		it('returns url if standard url', function() {
			assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor('https://twitter.com/alfa'), [
				kTestingSuggestionTwitterFor('alfa'),
				]);
		});

		it('returns url if www', function() {
			assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor('https://www.twitter.com/alfa'), [
				kTestingSuggestionTwitterFor('alfa'),
				]);
		});

		it('returns url if hash bang', function() {
			assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor('https://twitter.com/#!/alfa'), [
				kTestingSuggestionTwitterFor('alfa'),
				]);
		});

		it('returns url if intent/user\?screen_name=', function() {
			assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor('https://twitter.com/intent/user?screen_name=alfa'), [
				kTestingSuggestionTwitterFor('alfa'),
				]);
		});

		it('returns url if @username', function() {
			assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor('https://twitter.com/@alfa'), [
				kTestingSuggestionTwitterFor('alfa'),
				]);
		});

		it('returns none if search', function() {
			assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestionsFor('https://twitter.com/search'), []);
		});

	});

});
