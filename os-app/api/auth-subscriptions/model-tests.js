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
		};
	},
};

describe('WKCSubscriptionTypeFeedRSS', function testWKCSubscriptionTypeFeedRSS() {

	it('returns constant', function() {
		assert.strictEqual(modelLibrary.WKCSubscriptionTypeFeedRSS(), 'FeedRSS');
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
			modelLibrary.WKCSubscriptionTypeFeedRSS(),
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

describe('WKCSubscriptionsModelErrorsFor', function testWKCSubscriptionsModelErrorsFor() {

	it('throws error if param2 not object', function() {
		assert.throws(function() {
			modelLibrary.WKCSubscriptionsModelErrorsFor(null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns errors if WKCSubscriptionURL not string', function() {
		assert.deepEqual(modelLibrary.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.kTestingValidSubscription(), {
			WKCSubscriptionURL: null,
		})), {
			WKCSubscriptionURL: [
				'WKCErrorNotFormatted',
			],
		});
	});

	it('returns errors if WKCSubscriptionURL not filled', function() {
		assert.deepEqual(modelLibrary.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.kTestingValidSubscription(), {
			WKCSubscriptionURL: '',
		})), {
			WKCSubscriptionURL: [
				'WKCErrorNotFormatted',
			],
		});
	});

	it('returns errors if WKCSubscriptionURL not formatted', function() {
		assert.deepEqual(modelLibrary.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.kTestingValidSubscription(), {
			WKCSubscriptionURL: 'google.com',
		})), {
			WKCSubscriptionURL: [
				'WKCErrorNotFormatted',
			],
		});
	});

	it('returns errors if WKCSubscriptionType not valid', function() {
		assert.deepEqual(modelLibrary.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.kTestingValidSubscription(), {
			WKCSubscriptionType: 'alfa',
		})), {
			WKCSubscriptionType: [
				'WKCErrorNotValid',
			],
		});
	});

	it('returns null', function() {
		assert.deepEqual(modelLibrary.WKCSubscriptionsModelErrorsFor(kTesting.kTestingValidSubscription()), null);
	});

	it('ignores unpresent fields if WKCModelValidatePresentOnly true', function() {
		assert.deepEqual(modelLibrary.WKCSubscriptionsModelErrorsFor({
			WKCSubscriptionType: 'alfa',
		}, {
			WKCModelValidatePresentOnly: true,
		}), {
			WKCSubscriptionType: [
				'WKCErrorNotValid',
			],
		});
	});

	context('WKCSubscriptionName', function() {

		it('returns errors if not string', function() {
			assert.deepEqual(modelLibrary.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionName: 123
			})), {
				WKCSubscriptionName: [
					'WKCErrorNotString',
				],
			});
		});

	});

	context('WKCSubscriptionBlurb', function() {

		it('returns errors if not string', function() {
			assert.deepEqual(modelLibrary.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionBlurb: 123
			})), {
				WKCSubscriptionBlurb: [
					'WKCErrorNotString',
				],
			});
		});

	});

	context('WKCSubscriptionFetchDate', function() {

		it('returns errors if not date', function() {
			assert.deepEqual(modelLibrary.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionFetchDate: new Date('alfa'),
			})), {
				WKCSubscriptionFetchDate: [
					'WKCErrorNotDate',
				],
			});
		});

	});

	context('WKCSubscriptionFetchContent', function() {

		it('returns errors if not string', function() {
			assert.deepEqual(modelLibrary.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionFetchContent: 123
			})), {
				WKCSubscriptionFetchContent: [
					'WKCErrorNotString',
				],
			});
		});

	});

	context('WKCSubscriptionErrorDate', function() {

		it('returns errors if not date', function() {
			assert.deepEqual(modelLibrary.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionErrorDate: new Date('alfa'),
			})), {
				WKCSubscriptionErrorDate: [
					'WKCErrorNotDate',
				],
			});
		});

	});

	context('WKCSubscriptionErrorMessage', function() {

		it('returns errors if not string', function() {
			assert.deepEqual(modelLibrary.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionErrorMessage: 123
			})), {
				WKCSubscriptionErrorMessage: [
					'WKCErrorNotString',
				],
			});
		});

	});

	context('WKCSubscriptionIsPaused', function() {

		it('returns errors if not boolean', function() {
			assert.deepEqual(modelLibrary.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionIsPaused: 'true'
			})), {
				WKCSubscriptionIsPaused: [
					'WKCErrorNotBoolean',
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
