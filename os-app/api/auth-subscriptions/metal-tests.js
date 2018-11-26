/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var metalLibrary = require('./metal');

describe('WKCMetalSubscriptionsCreate', function testWKCMetalSubscriptionsCreate() {

	it('throws error if param2 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, {}, null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns WKCErrors if not valid WKCSubscription', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, {
			WKCSubscriptionURL: 'google.com',
		}, function(responseJSON) {
			assert.deepEqual(responseJSON.WKCErrors, {
				WKCSubscriptionURL: [
					'WKCErrorNotFormatted',
				],
			});
			
			done();
		});
	});

	it('returns WKCSubscription', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, {
			WKCSubscriptionURL: 'https://google.com',
		}, function(responseJSON) {
			assert.strictEqual(responseJSON._id, undefined);
			assert.strictEqual(responseJSON.WKCSubscriptionID - (new Date()) > -200, true);
			assert.strictEqual(responseJSON.WKCSubscriptionURL, 'https://google.com');
			assert.strictEqual(responseJSON.WKCSubscriptionDateCreated instanceof Date, true);
			assert.strictEqual(responseJSON.WKCSubscriptionDateUpdated instanceof Date, true);
			
			done();
		});
	});

});
