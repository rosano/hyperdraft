/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var logicLibrary = require('./ui-logic');

describe('WKCReadModuleSubscribeCompleteURL', function test_WKCReadModuleSubscribeCompleteURL() {

	it('throws error if param1 not string', function() {
		assert.throws(function() {
			logicLibrary.WKCReadModuleSubscribeCompleteURL(null, 'https://google.com');
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param1 not filled', function() {
		assert.throws(function() {
			logicLibrary.WKCReadModuleSubscribeCompleteURL('', 'https://google.com');
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param2 not formatted', function() {
		assert.throws(function() {
			logicLibrary.WKCReadModuleSubscribeCompleteURL('/', 'google.com');
		}, /KVCErrorInputNotValid/);
	});

	it('returns input if formatted', function() {
		assert.strictEqual(logicLibrary.WKCReadModuleSubscribeCompleteURL('http://google.com/alfa', 'https://google.com'), 'http://google.com/alfa');
	});

	it('returns path appended to domain if root', function() {
		assert.strictEqual(logicLibrary.WKCReadModuleSubscribeCompleteURL('/alfa', 'https://google.com/bravo'), 'https://google.com/alfa');
	});

	it('returns path appended to url with slash', function() {
		assert.strictEqual(logicLibrary.WKCReadModuleSubscribeCompleteURL('alfa', 'https://google.com/bravo/'), 'https://google.com/bravo/alfa');
	});

	it('returns path appended to url with no slash', function() {
		assert.strictEqual(logicLibrary.WKCReadModuleSubscribeCompleteURL('alfa', 'https://google.com/bravo'), 'https://google.com/bravo/alfa');
	});

	it('returns path appended to url file', function() {
		assert.strictEqual(logicLibrary.WKCReadModuleSubscribeCompleteURL('alfa', 'https://google.com/bravo/charlie/delta.html'), 'https://google.com/bravo/charlie/alfa');
	});

	it('returns path appended to url file at root', function() {
		assert.strictEqual(logicLibrary.WKCReadModuleSubscribeCompleteURL('alfa', 'https://google.com/bravo.html'), 'https://google.com/alfa');
	});

	it('returns path appended to url query', function() {
		assert.strictEqual(logicLibrary.WKCReadModuleSubscribeCompleteURL('alfa', 'https://google.com/bravo?charlie'), 'https://google.com/bravo/alfa');
	});

	it('returns path appended to url hash', function() {
		assert.strictEqual(logicLibrary.WKCReadModuleSubscribeCompleteURL('alfa', 'https://google.com/bravo#charlie'), 'https://google.com/bravo/alfa');
	});

});

describe('WKCReadLogicArticlesSort', function test_WKCReadLogicArticlesSort() {

	it('sorts by WKCArticlePublishDate descending', function() {
		var item1 = {
			WKCArticlePublishDate: new Date(0),
		};
		var item2 = {
			WKCArticlePublishDate: new Date(1),
		};

		assert.deepEqual([item1, item2].sort(logicLibrary.WKCReadLogicArticlesSort), [item2, item1]);
	});

});

describe('WKCReadLogicArticlesDiscardedSort', function test_WKCReadLogicArticlesDiscardedSort() {

	it('sorts by WKCArticleDateDiscarded descending', function() {
		var item1 = {
			WKCArticlePublishDate: new Date(1),
			WKCArticleDateDiscarded: new Date(0),
		};
		var item2 = {
			WKCArticlePublishDate: new Date(0),
			WKCArticleDateDiscarded: new Date(1),
		};

		assert.deepEqual([item1, item2].sort(logicLibrary.WKCReadLogicArticlesDiscardedSort), [item2, item1]);
	});

});
