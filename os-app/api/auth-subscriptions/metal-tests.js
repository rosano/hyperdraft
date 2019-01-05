/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var metalLibrary = require('./metal');
var modelLibrary = require('./model');

const kTesting = {
	kTestingValidSubscription: function() {
		return {
			WKCSubscriptionURL: 'https://google.com',
			WKCSubscriptionHandler: modelLibrary.WKCSubscriptionHandlerPage(),
		};
	},
};

describe('WKCMetalSubscriptionsCreate', function testWKCMetalSubscriptionsCreate() {

	it('throws error if param2 not object', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, '', function() {});
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, {}, null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns WKCErrors if not valid WKCSubscription', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, {
			WKCSubscriptionURL: 'google.com',
			WKCSubscriptionHandler: modelLibrary.WKCSubscriptionHandlerPage(),
		}, function(err, responseJSON) {
			assert.deepEqual(responseJSON.WKCErrors, {
				WKCSubscriptionURL: [
					'WKCErrorNotFormatted',
				],
			});

			done();
		});
	});

	it('returns WKCSubscription', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, kTesting.kTestingValidSubscription(), function(err, responseJSON) {
			assert.deepEqual(responseJSON, Object.assign(kTesting.kTestingValidSubscription(), {
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
			metalLibrary.WKCMetalSubscriptionsRead(WKCTestingMongoClient, 1, function() {});
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsRead(WKCTestingMongoClient, '1', null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns error if WKCSubscriptionID not found', function(done) {
		metalLibrary.WKCMetalSubscriptionsRead(WKCTestingMongoClient, '0', function(err) {
			assert.deepEqual(err, new Error('WKCErrorNotFound'));

			done();
		});
	});

	it('returns WKCSubscription', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, kTesting.kTestingValidSubscription(), function(err, subscriptionObject) {
			metalLibrary.WKCMetalSubscriptionsRead(WKCTestingMongoClient, subscriptionObject.WKCSubscriptionID, function(err, responseJSON) {
				assert.deepEqual(responseJSON, subscriptionObject);

				done();
			});
		});
	});

});

describe('WKCMetalSubscriptionsUpdate', function testWKCMetalSubscriptionsUpdate() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsUpdate(WKCTestingMongoClient, 1, {}, function() {});
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param3 not object', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsUpdate(WKCTestingMongoClient, '1', null, function() {});
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param4 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsUpdate(WKCTestingMongoClient, '1', {}, null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns error if WKCSubscriptionID not found', function(done) {
		metalLibrary.WKCMetalSubscriptionsUpdate(WKCTestingMongoClient, '0', kTesting.kTestingValidSubscription(), function(err) {
			assert.deepEqual(err, new Error('WKCErrorNotFound'));

			done();
		});
	});

	it('returns WKCErrors if not valid WKCSubscription', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, kTesting.kTestingValidSubscription(), function(err, subscriptionObject) {
			metalLibrary.WKCMetalSubscriptionsUpdate(WKCTestingMongoClient, subscriptionObject.WKCSubscriptionID, {
				WKCSubscriptionURL: 'google.com',
			}, function(err, responseJSON) {
				assert.deepEqual(responseJSON.WKCErrors, {
					WKCSubscriptionURL: [
						'WKCErrorNotFormatted',
					],
				});

				done();
			});
		});
	});

	it('returns WKCSubscription', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, kTesting.kTestingValidSubscription(), function(err, subscriptionObject) {
			var newURL = 'https://yahoo.com';

			metalLibrary.WKCMetalSubscriptionsUpdate(WKCTestingMongoClient, subscriptionObject.WKCSubscriptionID, {
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
			metalLibrary.WKCMetalSubscriptionsDelete(WKCTestingMongoClient, 1, function() {});
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsDelete(WKCTestingMongoClient, '1', null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns error if WKCSubscriptionID not found', function(done) {
		metalLibrary.WKCMetalSubscriptionsDelete(WKCTestingMongoClient, '0', function(err) {
			assert.deepEqual(err, new Error('WKCErrorNotFound'));

			done();
		});
	});

	it('returns WKCSubscription', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, kTesting.kTestingValidSubscription(), function(err, responseJSON) {
			metalLibrary.WKCMetalSubscriptionsDelete(WKCTestingMongoClient, responseJSON.WKCSubscriptionID, function(err, responseJSON) {
				assert.deepEqual(responseJSON, true);

				done();
			});
		});
	});

});

describe('WKCMetalSubscriptionsSearch', function testWKCMetalSubscriptionsSearch() {

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsSearch(WKCTestingMongoClient, '', null);
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param4 not object', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsNeedingFetch(WKCTestingMongoClient, '', function() {}, null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns all if param2 empty', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, kTesting.kTestingValidSubscription(), function(err, subscriptionObject) {
			metalLibrary.WKCMetalSubscriptionsSearch(WKCTestingMongoClient, '', function(err, responseJSON) {
				assert.deepEqual(responseJSON, [subscriptionObject]);

				done();
			});
		});
	});

	context('WKCOptionExcludeWKCSubscriptionFetchContent', function () {

		it('returns with WKCSubscriptionFetchContent if true', function(done) {
			metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionFetchContent: 'alfa',
			}), function(err, subscriptionObject1) {
				delete subscriptionObject1.WKCSubscriptionFetchContent;
				
				metalLibrary.WKCMetalSubscriptionsSearch(WKCTestingMongoClient, '', function(err, responseJSON) {
					assert.deepEqual(responseJSON, [subscriptionObject1]);

					done();
				}, {
					WKCOptionExcludeWKCSubscriptionFetchContent: true,
				});
			});
		});

		it('returns without WKCSubscriptionFetchContent', function(done) {
			metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionFetchContent: 'alfa',
			}), function(err, subscriptionObject1) {
				metalLibrary.WKCMetalSubscriptionsSearch(WKCTestingMongoClient, '', function(err, responseJSON) {
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
			metalLibrary.WKCMetalSubscriptionsNeedingFetch(WKCTestingMongoClient, null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns subscriptionObjects with fetch date older than one hour', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
			WKCSubscriptionName: 'alfa',
			WKCSubscriptionFetchDate: new Date(new Date() - 1000 * 60 * 60),
		}), function(err, subscriptionObject1) {
			metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionName: 'bravo',
				WKCSubscriptionFetchDate: new Date(),
			}), function(err, subscriptionObject2) {
				metalLibrary.WKCMetalSubscriptionsNeedingFetch(WKCTestingMongoClient, function(err, responseJSON) {
					assert.deepEqual(responseJSON, [subscriptionObject1]);

					done();
				});
			});
		});
	});

	it('returns subscriptionObjects with no fetch date', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
			WKCSubscriptionName: 'alfa',
			WKCSubscriptionFetchDate: new Date(),
		}), function(err, subscriptionObject1) {
			metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionName: 'bravo',
			}), function(err, subscriptionObject2) {
				metalLibrary.WKCMetalSubscriptionsNeedingFetch(WKCTestingMongoClient, function(err, responseJSON) {
					assert.deepEqual(responseJSON, [subscriptionObject2]);

					done();
				});
			});
		});
	});

	context('WKCSubscriptionErrorDate', function() {

		it('excludes if less than one hour', function(done) {
			metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionName: 'alfa',
				WKCSubscriptionFetchDate: new Date(new Date() - 1000 * 60 * 60),
				WKCSubscriptionErrorDate: new Date(),
			}), function(err, subscriptionObject) {
				metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
					WKCSubscriptionName: 'bravo',
					WKCSubscriptionFetchDate: new Date(),
				}), function(err, subscriptionObject) {
					metalLibrary.WKCMetalSubscriptionsNeedingFetch(WKCTestingMongoClient, function(err, responseJSON) {
						assert.deepEqual(responseJSON, []);

						done();
					});
				});
			});
		});

		it('includes if older than one hour', function(done) {
			metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionName: 'alfa',
				WKCSubscriptionFetchDate: new Date(new Date() - 1000 * 60 * 60),
				WKCSubscriptionErrorDate: new Date(new Date() - 1000 * 60 * 60),
			}), function(err, subscriptionObject1) {
				metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
					WKCSubscriptionName: 'bravo',
					WKCSubscriptionFetchDate: new Date(),
				}), function(err, subscriptionObject2) {
					metalLibrary.WKCMetalSubscriptionsNeedingFetch(WKCTestingMongoClient, function(err, responseJSON) {
						assert.deepEqual(responseJSON, [subscriptionObject1]);

						done();
					});
				});
			});
		});

	});

	context('WKCSubscriptionIsPaused', function() {

		it('excludes if true', function(done) {
			metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionName: 'alfa',
				WKCSubscriptionFetchDate: new Date(new Date() - 1000 * 60 * 60),
				WKCSubscriptionIsPaused: true,
			}), function(err, subscriptionObject) {
				metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
					WKCSubscriptionName: 'bravo',
					WKCSubscriptionFetchDate: new Date(),
				}), function(err, subscriptionObject) {
					metalLibrary.WKCMetalSubscriptionsNeedingFetch(WKCTestingMongoClient, function(err, responseJSON) {
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
			metalLibrary.WKCSubscriptionsMetalRequestParameters(WKCTestingMongoClient, null, function () {});
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCSubscriptionsMetalRequestParameters(WKCTestingMongoClient, '', null);
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param3 not object', function() {
		assert.throws(function() {
			metalLibrary.WKCSubscriptionsMetalRequestParameters(WKCTestingMongoClient, '', function() {}, null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns parameters', function(done) {
		metalLibrary.WKCSubscriptionsMetalRequestParameters(WKCTestingMongoClient, 'alfa', function(err, responseJSON) {
			assert.deepEqual(responseJSON, {
				method: 'GET',
				uri: 'alfa',
			});

			done();
		});
	});

	context('WKCOptionHandler', function () {

		it('returns parameters if WKCSubscriptionHandlerCustomTwitterTimeline', function(done) {
			WKCTestingMongoClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_settings').insertOne({
				WKCSettingKey: 'kWKCSettingKeyCustomTwitterToken',
				WKCSettingValue: 'bravo',
			}, function(err, result) {
				metalLibrary.WKCSubscriptionsMetalRequestParameters(WKCTestingMongoClient, 'alfa', function(err, responseJSON) {
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
