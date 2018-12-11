/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var modelLibrary = require('./model');

const kTestingValidArticle = function() {
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

});

describe('WKCModelInputDataIsArticleObject', function testWKCModelInputDataIsArticleObject() {

	it('returns false if not object', function() {
		assert.strictEqual(modelLibrary.WKCModelInputDataIsArticleObject(null), false);
	});

	it('returns false with WKCErrors if WKCArticleSubscriptionID not string', function() {
		var item = Object.assign(kTestingValidArticle(), {
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
		var item = Object.assign(kTestingValidArticle(), {
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
		var item = Object.assign(kTestingValidArticle(), {
			WKCArticlePublishDate: new Date('alfa'),
		});

		assert.strictEqual(modelLibrary.WKCModelInputDataIsArticleObject(item), false);
		assert.deepEqual(item.WKCErrors, {
			WKCArticlePublishDate: [
				'WKCErrorNotDate',
			],
		});
	});

	context('WKCArticleTitle', function() {

		it('returns false with WKCErrors if not string', function() {
			var item = Object.assign(kTestingValidArticle(), {
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

	context('WKCArticleBody', function() {

		it('returns false with WKCErrors if not string', function() {
			var item = Object.assign(kTestingValidArticle(), {
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

});

describe('WKCArticleHiddenPropertyNames', function testWKCArticleHiddenPropertyNames() {

	it('returns array', function() {
		assert.deepEqual(modelLibrary.WKCArticleHiddenPropertyNames(), [
			'_id',
		]);
	});

});
