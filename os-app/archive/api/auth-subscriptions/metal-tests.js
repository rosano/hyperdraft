if (global.KVCTestingMongoSkipped) {
	return;
}

const assert = require('assert');

const mainModule = require('./metal.js');
const modelLibrary = require('./model.js');

const kTesting = {
	StubValidSubscription() {
		return {
			WKCSubscriptionURL: 'https://google.com',
			WKCSubscriptionHandler: modelLibrary.WKCSubscriptionHandlerPage(),
		};
	},
};

describe('WKCMetalSubscriptionsCreate', function testWKCMetalSubscriptionsCreate() {

	it('throws error if param2 not object', function() {
		assert.throws(function() {
			mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, '', function() {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, {}, null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns KVCErrors if not valid WKCSubscription', function(done) {
		mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, {
			WKCSubscriptionURL: 'google.com',
			WKCSubscriptionHandler: modelLibrary.WKCSubscriptionHandlerPage(),
		}, function(err, responseJSON) {
			assert.deepEqual(responseJSON.KVCErrors, {
				WKCSubscriptionURL: [
					'KVCErrorNotFormatted',
				],
			});

			done();
		});
	});

	it('returns WKCSubscription', function(done) {
		mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, kTesting.StubValidSubscription(), function(err, responseJSON) {
			assert.deepEqual(responseJSON, Object.assign(kTesting.StubValidSubscription(), {
				WKCSubscriptionID: responseJSON.WKCSubscriptionID,
				WKCSubscriptionDateCreated: responseJSON.WKCSubscriptionDateCreated,
				WKCSubscriptionDateUpdated: responseJSON.WKCSubscriptionDateUpdated,
			}));

			assert.strictEqual(parseInt(responseJSON.WKCSubscriptionID) - (new Date()) > -500, true);
			assert.strictEqual(responseJSON.WKCSubscriptionDateCreated - (new Date()) > -500, true);
			assert.strictEqual(responseJSON.WKCSubscriptionDateUpdated - (new Date()) > -500, true);

			done();
		});
	});

});

describe('WKCMetalSubscriptionsRead', function testWKCMetalSubscriptionsRead() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			mainModule.WKCMetalSubscriptionsRead(KVCTestingMongoClient, 1, function() {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			mainModule.WKCMetalSubscriptionsRead(KVCTestingMongoClient, '1', null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns error if WKCSubscriptionID not found', function(done) {
		mainModule.WKCMetalSubscriptionsRead(KVCTestingMongoClient, '0', function(err) {
			assert.deepEqual(err, new Error('KVCErrorNotFound'));

			done();
		});
	});

	it('returns WKCSubscription', function(done) {
		mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, kTesting.StubValidSubscription(), function(err, subscriptionObject) {
			mainModule.WKCMetalSubscriptionsRead(KVCTestingMongoClient, subscriptionObject.WKCSubscriptionID, function(err, responseJSON) {
				assert.deepEqual(responseJSON, subscriptionObject);

				done();
			});
		});
	});

});

describe('WKCMetalSubscriptionsUpdate', function testWKCMetalSubscriptionsUpdate() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			mainModule.WKCMetalSubscriptionsUpdate(KVCTestingMongoClient, 1, {}, function() {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param3 not object', function() {
		assert.throws(function() {
			mainModule.WKCMetalSubscriptionsUpdate(KVCTestingMongoClient, '1', null, function() {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param4 not function', function() {
		assert.throws(function() {
			mainModule.WKCMetalSubscriptionsUpdate(KVCTestingMongoClient, '1', {}, null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns error if WKCSubscriptionID not found', function(done) {
		mainModule.WKCMetalSubscriptionsUpdate(KVCTestingMongoClient, '0', kTesting.StubValidSubscription(), function(err) {
			assert.deepEqual(err, new Error('KVCErrorNotFound'));

			done();
		});
	});

	it('returns KVCErrors if not valid WKCSubscription', function(done) {
		mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, kTesting.StubValidSubscription(), function(err, subscriptionObject) {
			mainModule.WKCMetalSubscriptionsUpdate(KVCTestingMongoClient, subscriptionObject.WKCSubscriptionID, {
				WKCSubscriptionURL: 'google.com',
			}, function(err, responseJSON) {
				assert.deepEqual(responseJSON.KVCErrors, {
					WKCSubscriptionURL: [
						'KVCErrorNotFormatted',
					],
				});

				done();
			});
		});
	});

	it('returns WKCSubscription', function(done) {
		mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, kTesting.StubValidSubscription(), function(err, subscriptionObject) {
			var newURL = 'https://yahoo.com';

			mainModule.WKCMetalSubscriptionsUpdate(KVCTestingMongoClient, subscriptionObject.WKCSubscriptionID, {
				WKCSubscriptionURL: newURL,
			}, function(err, responseJSON) {
				assert.deepEqual(responseJSON, Object.assign(subscriptionObject, {
					WKCSubscriptionURL: newURL,
					WKCSubscriptionDateUpdated: responseJSON.WKCSubscriptionDateUpdated,
				}));
				assert.strictEqual(responseJSON.WKCSubscriptionDateUpdated - (new Date()) > -200, true);

				done();
			});
		});
	});

});

describe('WKCMetalSubscriptionsDelete', function testWKCMetalSubscriptionsDelete() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			mainModule.WKCMetalSubscriptionsDelete(KVCTestingMongoClient, 1, function() {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			mainModule.WKCMetalSubscriptionsDelete(KVCTestingMongoClient, '1', null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns error if WKCSubscriptionID not found', function(done) {
		mainModule.WKCMetalSubscriptionsDelete(KVCTestingMongoClient, '0', function(err) {
			assert.deepEqual(err, new Error('KVCErrorNotFound'));

			done();
		});
	});

	it('returns WKCSubscription', function(done) {
		mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, kTesting.StubValidSubscription(), function(err, responseJSON) {
			mainModule.WKCMetalSubscriptionsDelete(KVCTestingMongoClient, responseJSON.WKCSubscriptionID, function(err, responseJSON) {
				assert.deepEqual(responseJSON, true);

				done();
			});
		});
	});

});

describe('WKCMetalSubscriptionsSearch', function testWKCMetalSubscriptionsSearch() {

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			mainModule.WKCMetalSubscriptionsSearch(KVCTestingMongoClient, '', null);
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param4 not object', function() {
		assert.throws(function() {
			mainModule.WKCMetalSubscriptionsNeedingFetch(KVCTestingMongoClient, '', function() {}, null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns all if param2 empty', function(done) {
		mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, kTesting.StubValidSubscription(), function(err, subscriptionObject) {
			mainModule.WKCMetalSubscriptionsSearch(KVCTestingMongoClient, '', function(err, responseJSON) {
				assert.deepEqual(responseJSON, [subscriptionObject]);

				done();
			});
		});
	});

	context('WKCOptionExcludeWKCSubscriptionFetchContent', function () {

		it('returns with WKCSubscriptionFetchContent if true', function(done) {
			mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, Object.assign(kTesting.StubValidSubscription(), {
				WKCSubscriptionFetchContent: 'alfa',
			}), function(err, subscriptionObject1) {
				delete subscriptionObject1.WKCSubscriptionFetchContent;
				
				mainModule.WKCMetalSubscriptionsSearch(KVCTestingMongoClient, '', function(err, responseJSON) {
					assert.deepEqual(responseJSON, [subscriptionObject1]);

					done();
				}, {
					WKCOptionExcludeWKCSubscriptionFetchContent: true,
				});
			});
		});

		it('returns without WKCSubscriptionFetchContent', function(done) {
			mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, Object.assign(kTesting.StubValidSubscription(), {
				WKCSubscriptionFetchContent: 'alfa',
			}), function(err, subscriptionObject1) {
				mainModule.WKCMetalSubscriptionsSearch(KVCTestingMongoClient, '', function(err, responseJSON) {
					assert.deepEqual(responseJSON, [subscriptionObject1]);

					done();
				});
			});
		});
		
	});

});

describe('WKCMetalSubscriptionsNeedingFetch', function testWKCMetalSubscriptionsNeedingFetch() {

	it('throws error if param2 not function', function() {
		assert.throws(function() {
			mainModule.WKCMetalSubscriptionsNeedingFetch(KVCTestingMongoClient, null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns subscriptionObjects with fetch date older than one hour', function(done) {
		mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, Object.assign(kTesting.StubValidSubscription(), {
			WKCSubscriptionName: 'alfa',
			WKCSubscriptionFetchDate: new Date(new Date() - 1000 * 60 * 60),
		}), function(err, subscriptionObject1) {
			mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, Object.assign(kTesting.StubValidSubscription(), {
				WKCSubscriptionName: 'bravo',
				WKCSubscriptionFetchDate: new Date(),
			}), function(err, subscriptionObject2) {
				mainModule.WKCMetalSubscriptionsNeedingFetch(KVCTestingMongoClient, function(err, responseJSON) {
					assert.deepEqual(responseJSON, [subscriptionObject1]);

					done();
				});
			});
		});
	});

	it('returns subscriptionObjects with no fetch date', function(done) {
		mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, Object.assign(kTesting.StubValidSubscription(), {
			WKCSubscriptionName: 'alfa',
			WKCSubscriptionFetchDate: new Date(),
		}), function(err, subscriptionObject1) {
			mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, Object.assign(kTesting.StubValidSubscription(), {
				WKCSubscriptionName: 'bravo',
			}), function(err, subscriptionObject2) {
				mainModule.WKCMetalSubscriptionsNeedingFetch(KVCTestingMongoClient, function(err, responseJSON) {
					assert.deepEqual(responseJSON, [subscriptionObject2]);

					done();
				});
			});
		});
	});

	context('WKCSubscriptionErrorDate', function() {

		it('excludes if less than one hour', function(done) {
			mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, Object.assign(kTesting.StubValidSubscription(), {
				WKCSubscriptionName: 'alfa',
				WKCSubscriptionFetchDate: new Date(new Date() - 1000 * 60 * 60),
				WKCSubscriptionErrorDate: new Date(),
			}), function(err, subscriptionObject) {
				mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, Object.assign(kTesting.StubValidSubscription(), {
					WKCSubscriptionName: 'bravo',
					WKCSubscriptionFetchDate: new Date(),
				}), function(err, subscriptionObject) {
					mainModule.WKCMetalSubscriptionsNeedingFetch(KVCTestingMongoClient, function(err, responseJSON) {
						assert.deepEqual(responseJSON, []);

						done();
					});
				});
			});
		});

		it('includes if older than one hour', function(done) {
			mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, Object.assign(kTesting.StubValidSubscription(), {
				WKCSubscriptionName: 'alfa',
				WKCSubscriptionFetchDate: new Date(new Date() - 1000 * 60 * 60),
				WKCSubscriptionErrorDate: new Date(new Date() - 1000 * 60 * 60),
			}), function(err, subscriptionObject1) {
				mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, Object.assign(kTesting.StubValidSubscription(), {
					WKCSubscriptionName: 'bravo',
					WKCSubscriptionFetchDate: new Date(),
				}), function(err, subscriptionObject2) {
					mainModule.WKCMetalSubscriptionsNeedingFetch(KVCTestingMongoClient, function(err, responseJSON) {
						assert.deepEqual(responseJSON, [subscriptionObject1]);

						done();
					});
				});
			});
		});

	});

	context('WKCSubscriptionIsPaused', function() {

		it('excludes if true', function(done) {
			mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, Object.assign(kTesting.StubValidSubscription(), {
				WKCSubscriptionName: 'alfa',
				WKCSubscriptionFetchDate: new Date(new Date() - 1000 * 60 * 60),
				WKCSubscriptionIsPaused: true,
			}), function(err, subscriptionObject) {
				mainModule.WKCMetalSubscriptionsCreate(KVCTestingMongoClient, Object.assign(kTesting.StubValidSubscription(), {
					WKCSubscriptionName: 'bravo',
					WKCSubscriptionFetchDate: new Date(),
				}), function(err, subscriptionObject) {
					mainModule.WKCMetalSubscriptionsNeedingFetch(KVCTestingMongoClient, function(err, responseJSON) {
						assert.deepEqual(responseJSON, []);

						done();
					});
				});
			});
		});

	});

});

describe('WKCSubscriptionsMetalRequestParameters', function testWKCSubscriptionsMetalRequestParameters() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			mainModule.WKCSubscriptionsMetalRequestParameters(KVCTestingMongoClient, null, function () {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			mainModule.WKCSubscriptionsMetalRequestParameters(KVCTestingMongoClient, '', null);
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param3 not object', function() {
		assert.throws(function() {
			mainModule.WKCSubscriptionsMetalRequestParameters(KVCTestingMongoClient, '', function() {}, null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns parameters', function(done) {
		mainModule.WKCSubscriptionsMetalRequestParameters(KVCTestingMongoClient, 'alfa', function(err, responseJSON) {
			assert.deepEqual(responseJSON, {
				method: 'GET',
				uri: 'alfa',
			});

			done();
		});
	});

	context('WKCOptionHandler', function () {

		it('returns parameters if WKCSubscriptionHandlerCustomTwitterTimeline', function(done) {
			KVCTestingMongoClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('kvc_settings').insertOne({
				KVCSettingKey: 'kKVCSettingKeyCustomTwitterToken',
				KVCSettingValue: 'bravo',
			}, function(err, result) {
				mainModule.WKCSubscriptionsMetalRequestParameters(KVCTestingMongoClient, 'alfa', function(err, responseJSON) {
					assert.deepEqual(responseJSON, {
						method: 'GET',
						uri: 'alfa',
						auth: {
							bearer: 'bravo',
						},
					});

					done();
				}, {
					WKCOptionHandler: modelLibrary.WKCSubscriptionHandlerCustomTwitterTimeline(),
				});
			});
		});

	});

});
