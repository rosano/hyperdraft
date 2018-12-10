/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var metalLibrary = require('./metal');
var modelLibrary = require('./model');

const kTestingValidSubscription = {
	WKCSubscriptionURL: 'https://google.com',
	WKCSubscriptionType: modelLibrary.WKCSubscriptionTypePage(),
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
			WKCSubscriptionType: modelLibrary.WKCSubscriptionTypePage(),
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
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, kTestingValidSubscription, function(err, responseJSON) {
			assert.strictEqual(responseJSON._id, undefined);
			assert.strictEqual(parseInt(responseJSON.WKCSubscriptionID) - (new Date()) > -200, true);
			assert.strictEqual(responseJSON.WKCSubscriptionURL, 'https://google.com');
			assert.strictEqual(responseJSON.WKCSubscriptionDateCreated instanceof Date, true);
			assert.strictEqual(responseJSON.WKCSubscriptionDateUpdated instanceof Date, true);
			
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
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, kTestingValidSubscription, function(err, subscriptionObject) {
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
		metalLibrary.WKCMetalSubscriptionsUpdate(WKCTestingMongoClient, '0', kTestingValidSubscription, function(err) {
			assert.deepEqual(err, new Error('WKCErrorNotFound'));

			done();
		});
	});

	it('returns WKCErrors if not valid WKCSubscription', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, kTestingValidSubscription, function(err, subscriptionObject) {
			metalLibrary.WKCMetalSubscriptionsUpdate(WKCTestingMongoClient, subscriptionObject.WKCSubscriptionID, {
				WKCSubscriptionType: modelLibrary.WKCSubscriptionTypePage(),
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
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, kTestingValidSubscription, function(err, subscriptionObject) {
			metalLibrary.WKCMetalSubscriptionsUpdate(WKCTestingMongoClient, subscriptionObject.WKCSubscriptionID, {
				WKCSubscriptionURL: 'https://yahoo.com',
			}, function(err, responseJSON) {
				assert.deepEqual(responseJSON.WKCSubscriptionURL, 'https://yahoo.com');
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
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, kTestingValidSubscription, function(err, responseJSON) {
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

	it('returns all if param2 empty', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, {
			WKCSubscriptionURL: 'https://alfa.com',
			WKCSubscriptionType: modelLibrary.WKCSubscriptionTypePage(),
		}, function(err, subscriptionObject) {
			metalLibrary.WKCMetalSubscriptionsSearch(WKCTestingMongoClient, '', function(err, responseJSON) {
				assert.deepEqual(responseJSON, [subscriptionObject]);

				done();
			});
		});
	});

});
