/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var modelLibrary = require('./model');

const kTesting = {
	kTestingValidSubscription: function() {
		return {
			WKCSubscriptionURL: 'https://google.com',
			WKCSubscriptionType: modelLibrary.WKCSubscriptionTypePage(),
		}
	},
};

describe('WKCSubscriptionTypeFeed', function testWKCSubscriptionTypeFeed() {

	it('returns constant', function() {
		assert.strictEqual(modelLibrary.WKCSubscriptionTypeFeed(), 'Feed');
	});

});

describe('WKCSubscriptionTypeFile', function testWKCSubscriptionTypeFile() {

	it('returns constant', function() {
		assert.strictEqual(modelLibrary.WKCSubscriptionTypeFile(), 'File');
	});

});

describe('WKCSubscriptionTypePage', function testWKCSubscriptionTypePage() {

	it('returns constant', function() {
		assert.strictEqual(modelLibrary.WKCSubscriptionTypePage(), 'Page');
	});

});

describe('WKCSubscriptionTypes', function testWKCSubscriptionTypes() {

	it('returns constant', function() {
		assert.deepEqual(modelLibrary.WKCSubscriptionTypes(), [
			modelLibrary.WKCSubscriptionTypeFeed(),
			modelLibrary.WKCSubscriptionTypeFile(),
			modelLibrary.WKCSubscriptionTypePage(),
			]);
	});

});

describe('WKCModelSubscriptionPrepare', function testWKCModelSubscriptionPrepare() {

	it('returns input', function() {
		assert.deepEqual(modelLibrary.WKCModelSubscriptionPrepare({}), {});
	});

	it('returns input with WKCSubscriptionFetchDate as date', function() {
		assert.deepEqual(modelLibrary.WKCModelSubscriptionPrepare({
			WKCSubscriptionFetchDate: '2018-12-09T19:07:01.902Z',
		}), {
			WKCSubscriptionFetchDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

});

describe('WKCModelInputDataIsSubscriptionObject', function testWKCModelInputDataIsSubscriptionObject() {

	it('returns false if not object', function() {
		assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(null), false);
	});

	it('returns false with WKCErrors if WKCSubscriptionURL not string', function() {
		var item = Object.assign(kTesting.kTestingValidSubscription(), {
			WKCSubscriptionURL: null,
		});

		assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
		assert.deepEqual(item.WKCErrors, {
			WKCSubscriptionURL: [
				'WKCErrorNotFormatted',
			],
		});
	});

	it('returns false with WKCErrors if WKCSubscriptionURL not filled', function() {
		var item = Object.assign(kTesting.kTestingValidSubscription(), {
			WKCSubscriptionURL: '',
		});

		assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
		assert.deepEqual(item.WKCErrors, {
			WKCSubscriptionURL: [
				'WKCErrorNotFormatted',
			],
		});
	});

	it('returns false with WKCErrors if WKCSubscriptionURL not formatted', function() {
		var item = Object.assign(kTesting.kTestingValidSubscription(), {
			WKCSubscriptionURL: 'google.com',
		});

		assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
		assert.deepEqual(item.WKCErrors, {
			WKCSubscriptionURL: [
				'WKCErrorNotFormatted',
			],
		});
	});

	it('returns false with WKCErrors if WKCSubscriptionType not valid', function() {
		var item = Object.assign(kTesting.kTestingValidSubscription(), {
			WKCSubscriptionType: 'alfa',
		});

		assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
		assert.deepEqual(item.WKCErrors, {
			WKCSubscriptionType: [
				'WKCErrorNotValid',
			],
		});
	});

	it('returns true', function() {
		assert.deepEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(kTesting.kTestingValidSubscription()), true);
	});

	it('ignores unpresent fields if WKCModelValidatePresentOnly true', function() {
		var item = {
			WKCSubscriptionType: 'alfa',
		};

		assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item, {
			WKCModelValidatePresentOnly: true,
		}), false);
		assert.deepEqual(item.WKCErrors, {
			WKCSubscriptionType: [
				'WKCErrorNotValid',
			],
		});
	});

	context('WKCSubscriptionName', function() {

		it('returns false with WKCErrors if not string', function() {
			var item = Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionName: 123
			});

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
			var item = Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionBlurb: 123
			});

			assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
			assert.deepEqual(item.WKCErrors, {
				WKCSubscriptionBlurb: [
					'WKCErrorNotString',
				],
			});
		});

	});

	context('WKCSubscriptionFetchDate', function() {

		it('returns false with WKCErrors if not date', function() {
			var item = Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionFetchDate: new Date('alfa'),
			});

			assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
			assert.deepEqual(item.WKCErrors, {
				WKCSubscriptionFetchDate: [
					'WKCErrorNotDate',
				],
			});
		});

	});

	context('WKCSubscriptionFetchContent', function() {

		it('returns false with WKCErrors if not string', function() {
			var item = Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionFetchContent: 123
			});

			assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
			assert.deepEqual(item.WKCErrors, {
				WKCSubscriptionFetchContent: [
					'WKCErrorNotString',
				],
			});
		});

	});

	context('WKCSubscriptionErrorDate', function() {

		it('returns false with WKCErrors if not date', function() {
			var item = Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionErrorDate: new Date('alfa'),
			});

			assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
			assert.deepEqual(item.WKCErrors, {
				WKCSubscriptionErrorDate: [
					'WKCErrorNotDate',
				],
			});
		});

	});

	context('WKCSubscriptionErrorMessage', function() {

		it('returns false with WKCErrors if not string', function() {
			var item = Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionErrorMessage: 123
			});

			assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
			assert.deepEqual(item.WKCErrors, {
				WKCSubscriptionErrorMessage: [
					'WKCErrorNotString',
				],
			});
		});

	});

});

describe('WKCSubscriptionHiddenPropertyNames', function testWKCSubscriptionHiddenPropertyNames() {

	it('returns array', function() {
		assert.deepEqual(modelLibrary.WKCSubscriptionHiddenPropertyNames(), [
			'_id',
		]);
	});

});
