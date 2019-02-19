/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const modelLibrary = require('./model.js');

const StubValidArticle = function() {
	return {
		WKCArticleSubscriptionID: 'alfa',
		WKCArticlePublishDate: new Date(),
	};
};

describe('WKCModelArticlePrepare', function testWKCModelArticlePrepare() {

	it('returns input', function() {
		assert.deepEqual(modelLibrary.WKCModelArticlePrepare({}), {});
	});

	it('returns input with WKCArticlePublishDate as date', function() {
		assert.deepEqual(modelLibrary.WKCModelArticlePrepare({
			WKCArticlePublishDate: '2018-12-09T19:07:01.902Z',
		}), {
			WKCArticlePublishDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

	it('returns input with WKCArticleDateDiscarded as date', function() {
		assert.deepEqual(modelLibrary.WKCModelArticlePrepare({
			WKCArticleDateDiscarded: '2018-12-09T19:07:01.902Z',
		}), {
			WKCArticleDateDiscarded: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

});

describe('WKCModelInputDataIsArticleObject', function testWKCModelInputDataIsArticleObject() {

	it('returns false if not object', function() {
		assert.strictEqual(modelLibrary.WKCModelInputDataIsArticleObject(null), false);
	});

	it('returns false with WKCErrors if WKCArticleSubscriptionID not string', function() {
		var item = Object.assign(StubValidArticle(), {
			WKCArticleSubscriptionID: null,
		});

		assert.strictEqual(modelLibrary.WKCModelInputDataIsArticleObject(item), false);
		assert.deepEqual(item.WKCErrors, {
			WKCArticleSubscriptionID: [
				'WKCErrorNotValid',
			],
		});
	});

	it('returns false with WKCErrors if WKCArticleSubscriptionID not blank', function() {
		var item = Object.assign(StubValidArticle(), {
			WKCArticleSubscriptionID: '',
		});

		assert.strictEqual(modelLibrary.WKCModelInputDataIsArticleObject(item), false);
		assert.deepEqual(item.WKCErrors, {
			WKCArticleSubscriptionID: [
				'WKCErrorNotValid',
			],
		});
	});

	it('returns false with WKCErrors if WKCArticlePublishDate not date', function() {
		var item = Object.assign(StubValidArticle(), {
			WKCArticlePublishDate: new Date('alfa'),
		});

		assert.strictEqual(modelLibrary.WKCModelInputDataIsArticleObject(item), false);
		assert.deepEqual(item.WKCErrors, {
			WKCArticlePublishDate: [
				'WKCErrorNotDate',
			],
		});
	});

	it('returns true', function() {
		assert.deepEqual(modelLibrary.WKCModelInputDataIsArticleObject(StubValidArticle()), true);
	});

	it('ignores unpresent fields if WKCOptionValidatePresentOnly true', function() {
		var item = {
			WKCArticlePublishDate: new Date('alfa'),
		};

		assert.strictEqual(modelLibrary.WKCModelInputDataIsArticleObject(item, {
			WKCOptionValidatePresentOnly: true,
		}), false);
		assert.deepEqual(item.WKCErrors, {
			WKCArticlePublishDate: [
				'WKCErrorNotDate',
			],
		});
	});

	context('WKCArticleTitle', function() {

		it('returns false with WKCErrors if not string', function() {
			var item = Object.assign(StubValidArticle(), {
				WKCArticleTitle: 123
			});

			assert.strictEqual(modelLibrary.WKCModelInputDataIsArticleObject(item), false);
			assert.deepEqual(item.WKCErrors, {
				WKCArticleTitle: [
					'WKCErrorNotString',
				],
			});
		});

	});

	context('WKCArticleSnippet', function() {

		it('returns false with WKCErrors if not string', function() {
			var item = Object.assign(StubValidArticle(), {
				WKCArticleBody: 123
			});

			assert.strictEqual(modelLibrary.WKCModelInputDataIsArticleObject(item), false);
			assert.deepEqual(item.WKCErrors, {
				WKCArticleBody: [
					'WKCErrorNotString',
				],
			});
		});

	});

	context('WKCArticleIsRead', function() {

		it('returns false with WKCErrors if not boolean', function() {
			var item = Object.assign(StubValidArticle(), {
				WKCArticleIsRead: 'true'
			});

			assert.strictEqual(modelLibrary.WKCModelInputDataIsArticleObject(item), false);
			assert.deepEqual(item.WKCErrors, {
				WKCArticleIsRead: [
					'WKCErrorNotBoolean',
				],
			});
		});

	});

	context('WKCArticleIsArchived', function() {

		it('returns false with WKCErrors if not boolean', function() {
			var item = Object.assign(StubValidArticle(), {
				WKCArticleIsArchived: 'true'
			});

			assert.strictEqual(modelLibrary.WKCModelInputDataIsArticleObject(item), false);
			assert.deepEqual(item.WKCErrors, {
				WKCArticleIsArchived: [
					'WKCErrorNotBoolean',
				],
			});
		});

	});

	context('WKCArticleIsDiscarded', function() {

		it('returns false with WKCErrors if not boolean', function() {
			var item = Object.assign(StubValidArticle(), {
				WKCArticleIsDiscarded: 'true'
			});

			assert.strictEqual(modelLibrary.WKCModelInputDataIsArticleObject(item), false);
			assert.deepEqual(item.WKCErrors, {
				WKCArticleIsDiscarded: [
					'WKCErrorNotBoolean',
				],
			});
		});

	});

	context('WKCArticleDateDiscarded', function() {

		it('returns false with WKCErrors if not date', function() {
			var item = Object.assign(StubValidArticle(), {
				WKCArticleDateDiscarded: Date.now(),
			});

			assert.strictEqual(modelLibrary.WKCModelInputDataIsArticleObject(item), false);
			assert.deepEqual(item.WKCErrors, {
				WKCArticleDateDiscarded: [
					'WKCErrorNotDate',
				],
			});
		});

		it('returns true', function() {
			var item = Object.assign(StubValidArticle(), {
				WKCArticleDateDiscarded: new Date(),
			});

			assert.strictEqual(modelLibrary.WKCModelInputDataIsArticleObject(item), true);
		});

	});

});

describe('WKCArticleHiddenPropertyNames', function testWKCArticleHiddenPropertyNames() {

	it('returns array', function() {
		assert.deepEqual(modelLibrary.WKCArticleHiddenPropertyNames(), [
			'_id',
		]);
	});

});
