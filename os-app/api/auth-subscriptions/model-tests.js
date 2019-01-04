/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var modelLibrary = require('./model');

const kTesting = {
	kTestingValidSubscription: function() {
		return {
			WKCSubscriptionURL: 'https://google.com',
			WKCSubscriptionHandler: modelLibrary.WKCSubscriptionHandlerPage(),
		};
	},
};

describe('WKCSubscriptionHandlerFeedRSS', function testWKCSubscriptionHandlerFeedRSS() {

	it('returns constant', function() {
		assert.strictEqual(modelLibrary.WKCSubscriptionHandlerFeedRSS(), 'FeedRSS');
	});

});

describe('WKCSubscriptionHandlerFeedAtom', function testWKCSubscriptionHandlerFeedAtom() {

	it('returns constant', function() {
		assert.strictEqual(modelLibrary.WKCSubscriptionHandlerFeedAtom(), 'FeedAtom');
	});

});

describe('WKCSubscriptionHandlerFile', function testWKCSubscriptionHandlerFile() {

	it('returns constant', function() {
		assert.strictEqual(modelLibrary.WKCSubscriptionHandlerFile(), 'File');
	});

});

describe('WKCSubscriptionHandlerPage', function testWKCSubscriptionHandlerPage() {

	it('returns constant', function() {
		assert.strictEqual(modelLibrary.WKCSubscriptionHandlerPage(), 'Page');
	});

});

describe('WKCSubscriptionHandlerCustomTwitterTimeline', function testWKCSubscriptionHandlerCustomTwitterTimeline() {

	it('returns constant', function() {
		assert.strictEqual(modelLibrary.WKCSubscriptionHandlerCustomTwitterTimeline(), 'CustomTwitterTimeline');
	});

});

describe('WKCSubscriptionHandlerCustomTwitterTimelineRequestCallback', function testWKCSubscriptionHandlerCustomTwitterTimelineRequestCallback() {

	it('throws error if param1 not function', function() {
		assert.throws(function() {
			modelLibrary.WKCSubscriptionHandlerCustomTwitterTimelineRequestCallback(WKCTestingMongoClient, null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns error if no kWKCSettingKeyCustomTwitterToken', function(done) {
		modelLibrary.WKCSubscriptionHandlerCustomTwitterTimelineRequestCallback(WKCTestingMongoClient, function(err, responseJSON) {
			assert.deepEqual(err.message, 'WKCErrorCustomTwitterMissingToken');
			assert.deepEqual(err.responseJSON, undefined);

			done();
		});
	});

	it('returns kWKCSettingKeyCustomTwitterToken', function(done) {
		WKCTestingMongoClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_settings').insertOne({
			WKCSettingKey: 'kWKCSettingKeyCustomTwitterToken',
			WKCSettingValue: 'alfa',
		}, function(err, result) {
			modelLibrary.WKCSubscriptionHandlerCustomTwitterTimelineRequestCallback(WKCTestingMongoClient, function(err, responseJSON) {
				assert.deepEqual(err, undefined);
				assert.deepEqual(responseJSON, {
					auth: {
						bearer: 'alfa',
					},
				});
				
				done();
			});
		});
	});

});

describe('WKCSubscriptionHandlers', function testWKCSubscriptionHandlers() {

	it('returns constant', function() {
		assert.deepEqual(modelLibrary.WKCSubscriptionHandlers(), [
			modelLibrary.WKCSubscriptionHandlerFeedRSS(),
			modelLibrary.WKCSubscriptionHandlerFeedAtom(),
			modelLibrary.WKCSubscriptionHandlerFile(),
			modelLibrary.WKCSubscriptionHandlerPage(),
			modelLibrary.WKCSubscriptionHandlerCustomTwitterTimeline(),
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

	it('returns object if WKCSubscriptionURL not string', function() {
		assert.deepEqual(modelLibrary.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.kTestingValidSubscription(), {
			WKCSubscriptionURL: null,
		})), {
			WKCSubscriptionURL: [
				'WKCErrorNotFormatted',
			],
		});
	});

	it('returns object if WKCSubscriptionURL not filled', function() {
		assert.deepEqual(modelLibrary.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.kTestingValidSubscription(), {
			WKCSubscriptionURL: '',
		})), {
			WKCSubscriptionURL: [
				'WKCErrorNotFormatted',
			],
		});
	});

	it('returns object if WKCSubscriptionURL not formatted', function() {
		assert.deepEqual(modelLibrary.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.kTestingValidSubscription(), {
			WKCSubscriptionURL: 'google.com',
		})), {
			WKCSubscriptionURL: [
				'WKCErrorNotFormatted',
			],
		});
	});

	it('returns object if WKCSubscriptionHandler not valid', function() {
		assert.deepEqual(modelLibrary.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.kTestingValidSubscription(), {
			WKCSubscriptionHandler: 'alfa',
		})), {
			WKCSubscriptionHandler: [
				'WKCErrorNotValid',
			],
		});
	});

	it('returns null', function() {
		assert.deepEqual(modelLibrary.WKCSubscriptionsModelErrorsFor(kTesting.kTestingValidSubscription()), null);
	});

	it('ignores unpresent fields if WKCModelValidatePresentOnly true', function() {
		assert.deepEqual(modelLibrary.WKCSubscriptionsModelErrorsFor({
			WKCSubscriptionHandler: 'alfa',
		}, {
			WKCModelValidatePresentOnly: true,
		}), {
			WKCSubscriptionHandler: [
				'WKCErrorNotValid',
			],
		});
	});

	context('WKCSubscriptionName', function() {

		it('returns object if not string', function() {
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

		it('returns object if not string', function() {
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

		it('returns object if not date', function() {
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

		it('returns object if not string', function() {
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

		it('returns object if not date', function() {
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

		it('returns object if not string', function() {
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

		it('returns object if not boolean', function() {
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
