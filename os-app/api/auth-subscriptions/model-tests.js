/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var modelLibrary = require('./model');

describe('WKCModelInputDataIsSubscriptionObject', function testWKCModelInputDataIsSubscriptionObject() {

	it('returns false if not object', function() {
		assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(null), false);
	});

	it('returns false with WKCErrors if WKCSubscriptionURL not string', function() {
		var item = {
			WKCSubscriptionURL: null,
		};

		assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
		assert.deepEqual(item.WKCErrors, {
			WKCSubscriptionURL: [
				'WKCErrorNotFormatted',
			],
		});
	});

	it('returns false with WKCErrors if WKCSubscriptionURL not filled', function() {
		var item = {
			WKCSubscriptionURL: '',
		};

		assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
		assert.deepEqual(item.WKCErrors, {
			WKCSubscriptionURL: [
				'WKCErrorNotFormatted',
			],
		});
	});

	it('returns false with WKCErrors if WKCSubscriptionURL not formatted', function() {
		var item = {
			WKCSubscriptionURL: 'google.com',
		};

		assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
		assert.deepEqual(item.WKCErrors, {
			WKCSubscriptionURL: [
				'WKCErrorNotFormatted',
			],
		});
	});

	it('returns true', function() {
		assert.deepEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject({
			WKCSubscriptionURL: 'https://google.com',
		}), true);
	});

	context('WKCSubscriptionName', function() {

		it('returns false with WKCErrors if not string', function() {
			var item = {
				WKCSubscriptionURL: 'https://google.com',
				WKCSubscriptionName: 123
			};

			assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
			assert.deepEqual(item.WKCErrors, {
				WKCSubscriptionName: [
					'WKCErrorNotString',
				],
			});
		});

	});

	context('WKCSubscriptionBlurb', function() {

		it('returns false with WKCErrors if not string', function() {
			var item = {
				WKCSubscriptionURL: 'https://google.com',
				WKCSubscriptionBlurb: 123
			};

			assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
			assert.deepEqual(item.WKCErrors, {
				WKCSubscriptionBlurb: [
					'WKCErrorNotString',
				],
			});
		});

	});

});
