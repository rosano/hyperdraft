if (global.KVCTestingMongoSkipped) {
	return;
}

const assert = require('assert');

const mainModule = require('./model.js');

const kTesting = {
	StubValidSubscription() {
		return {
			WKCSubscriptionURL: 'https://google.com',
			WKCSubscriptionHandler: mainModule.WKCSubscriptionHandlerPage(),
		};
	},
};

describe('WKCSubscriptionHandlerFeedRSS', function test_WKCSubscriptionHandlerFeedRSS() {

	it('returns constant', function() {
		assert.strictEqual(mainModule.WKCSubscriptionHandlerFeedRSS(), 'FeedRSS');
	});

});

describe('WKCSubscriptionHandlerFeedAtom', function test_WKCSubscriptionHandlerFeedAtom() {

	it('returns constant', function() {
		assert.strictEqual(mainModule.WKCSubscriptionHandlerFeedAtom(), 'FeedAtom');
	});

});

describe('WKCSubscriptionHandlerFile', function test_WKCSubscriptionHandlerFile() {

	it('returns constant', function() {
		assert.strictEqual(mainModule.WKCSubscriptionHandlerFile(), 'File');
	});

});

describe('WKCSubscriptionHandlerPage', function test_WKCSubscriptionHandlerPage() {

	it('returns constant', function() {
		assert.strictEqual(mainModule.WKCSubscriptionHandlerPage(), 'Page');
	});

});

describe('WKCSubscriptionHandlerCustomTwitterTimeline', function test_WKCSubscriptionHandlerCustomTwitterTimeline() {

	it('returns constant', function() {
		assert.strictEqual(mainModule.WKCSubscriptionHandlerCustomTwitterTimeline(), 'CustomTwitterTimeline');
	});

});

describe('WKCSubscriptionHandlerCustomTwitterTimelineRequestCallback', function test_WKCSubscriptionHandlerCustomTwitterTimelineRequestCallback() {

	it('throws error if param1 not function', function() {
		assert.throws(function() {
			mainModule.WKCSubscriptionHandlerCustomTwitterTimelineRequestCallback(KVCTestingMongoClient, null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns error if no kKVCSettingKeyCustomTwitterToken', function(done) {
		mainModule.WKCSubscriptionHandlerCustomTwitterTimelineRequestCallback(KVCTestingMongoClient, function(err, responseJSON) {
			assert.deepEqual(err.message, 'KVCErrorCustomTwitterMissingToken');
			assert.deepEqual(err.responseJSON, undefined);

			done();
		});
	});

	it('returns kKVCSettingKeyCustomTwitterToken', function(done) {
		KVCTestingMongoClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('kvc_settings').insertOne({
			KVCSettingKey: 'kKVCSettingKeyCustomTwitterToken',
			KVCSettingValue: 'alfa',
		}, function(err, result) {
			mainModule.WKCSubscriptionHandlerCustomTwitterTimelineRequestCallback(KVCTestingMongoClient, function(err, responseJSON) {
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

describe('WKCSubscriptionHandlers', function test_WKCSubscriptionHandlers() {

	it('returns constant', function() {
		assert.deepEqual(mainModule.WKCSubscriptionHandlers(), [
			mainModule.WKCSubscriptionHandlerFeedRSS(),
			mainModule.WKCSubscriptionHandlerFeedAtom(),
			mainModule.WKCSubscriptionHandlerFile(),
			mainModule.WKCSubscriptionHandlerPage(),
			mainModule.WKCSubscriptionHandlerCustomTwitterTimeline(),
		]);
	});

});

describe('WKCModelSubscriptionPrepare', function test_WKCModelSubscriptionPrepare() {

	it('returns input', function() {
		assert.deepEqual(mainModule.WKCModelSubscriptionPrepare({}), {});
	});

	it('returns input with WKCSubscriptionFetchDate as date', function() {
		assert.deepEqual(mainModule.WKCModelSubscriptionPrepare({
			WKCSubscriptionFetchDate: '2018-12-09T19:07:01.902Z',
		}), {
			WKCSubscriptionFetchDate: new Date('2018-12-09T19:07:01.902Z'),
		});
	});

});

describe('WKCSubscriptionsModelErrorsFor', function test_WKCSubscriptionsModelErrorsFor() {

	it('throws error if param2 not object', function() {
		assert.throws(function() {
			mainModule.WKCSubscriptionsModelErrorsFor(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns object if WKCSubscriptionURL not string', function() {
		assert.deepEqual(mainModule.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.StubValidSubscription(), {
			WKCSubscriptionURL: null,
		})), {
			WKCSubscriptionURL: [
				'KVCErrorNotFormatted',
			],
		});
	});

	it('returns object if WKCSubscriptionURL not filled', function() {
		assert.deepEqual(mainModule.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.StubValidSubscription(), {
			WKCSubscriptionURL: '',
		})), {
			WKCSubscriptionURL: [
				'KVCErrorNotFormatted',
			],
		});
	});

	it('returns object if WKCSubscriptionURL not formatted', function() {
		assert.deepEqual(mainModule.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.StubValidSubscription(), {
			WKCSubscriptionURL: 'google.com',
		})), {
			WKCSubscriptionURL: [
				'KVCErrorNotFormatted',
			],
		});
	});

	it('returns object if WKCSubscriptionHandler not valid', function() {
		assert.deepEqual(mainModule.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.StubValidSubscription(), {
			WKCSubscriptionHandler: 'alfa',
		})), {
			WKCSubscriptionHandler: [
				'KVCErrorNotValid',
			],
		});
	});

	it('returns null', function() {
		assert.deepEqual(mainModule.WKCSubscriptionsModelErrorsFor(kTesting.StubValidSubscription()), null);
	});

	it('ignores unpresent fields if WKCOptionValidatePresentOnly true', function() {
		assert.deepEqual(mainModule.WKCSubscriptionsModelErrorsFor({
			WKCSubscriptionHandler: 'alfa',
		}, {
			WKCOptionValidatePresentOnly: true,
		}), {
			WKCSubscriptionHandler: [
				'KVCErrorNotValid',
			],
		});
	});

	context('WKCSubscriptionName', function() {

		it('returns object if not string', function() {
			assert.deepEqual(mainModule.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.StubValidSubscription(), {
				WKCSubscriptionName: 123
			})), {
				WKCSubscriptionName: [
					'KVCErrorNotString',
				],
			});
		});

	});

	context('WKCSubscriptionBlurb', function() {

		it('returns object if not string', function() {
			assert.deepEqual(mainModule.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.StubValidSubscription(), {
				WKCSubscriptionBlurb: 123
			})), {
				WKCSubscriptionBlurb: [
					'KVCErrorNotString',
				],
			});
		});

	});

	context('WKCSubscriptionFetchDate', function() {

		it('returns object if not date', function() {
			assert.deepEqual(mainModule.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.StubValidSubscription(), {
				WKCSubscriptionFetchDate: new Date('alfa'),
			})), {
				WKCSubscriptionFetchDate: [
					'KVCErrorNotDate',
				],
			});
		});

	});

	context('WKCSubscriptionFetchContent', function() {

		it('returns object if not string', function() {
			assert.deepEqual(mainModule.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.StubValidSubscription(), {
				WKCSubscriptionFetchContent: 123
			})), {
				WKCSubscriptionFetchContent: [
					'KVCErrorNotString',
				],
			});
		});

	});

	context('WKCSubscriptionErrorDate', function() {

		it('returns object if not date', function() {
			assert.deepEqual(mainModule.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.StubValidSubscription(), {
				WKCSubscriptionErrorDate: new Date('alfa'),
			})), {
				WKCSubscriptionErrorDate: [
					'KVCErrorNotDate',
				],
			});
		});

	});

	context('WKCSubscriptionErrorMessage', function() {

		it('returns object if not string', function() {
			assert.deepEqual(mainModule.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.StubValidSubscription(), {
				WKCSubscriptionErrorMessage: 123
			})), {
				WKCSubscriptionErrorMessage: [
					'KVCErrorNotString',
				],
			});
		});

	});

	context('WKCSubscriptionIsPaused', function() {

		it('returns object if not boolean', function() {
			assert.deepEqual(mainModule.WKCSubscriptionsModelErrorsFor(Object.assign(kTesting.StubValidSubscription(), {
				WKCSubscriptionIsPaused: 'true'
			})), {
				WKCSubscriptionIsPaused: [
					'KVCErrorNotBoolean',
				],
			});
		});

	});

});

describe('WKCSubscriptionHiddenPropertyNames', function test_WKCSubscriptionHiddenPropertyNames() {

	it('returns array', function() {
		assert.deepEqual(mainModule.WKCSubscriptionHiddenPropertyNames(), [
			'_id',
		]);
	});

});
