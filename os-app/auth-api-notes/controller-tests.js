/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var apiNotesController = require('./controller');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(apiNotesController.OLSKControllerRoutes(), {
			WKCRouteAPINotesCreate: {
				OLSKRoutePath: '/api/notes',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: apiNotesController.WKCActionAPINotesCreate,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPINotesRead: {
				OLSKRoutePath: '/api/notes/:wkc_note_id',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: apiNotesController.WKCActionAPINotesRead,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
		});
	});

});

describe('Connection', function testConnection() {

	var mongodbPackage = require('mongodb');
	var mongoClient;

	before(function(done) {
		mongodbPackage.MongoClient.connect(process.env.WKC_DATABASE_URL, function(err, client) {
			if (err) {
				throw err;
			}

			mongoClient = client;

			done();
		});
	});

	after(function() {
		if (!mongoClient) {
			return;
		}

		mongoClient.close();
	});

	beforeEach(function() {
		mongoClient.db(process.env.WKC_SHARED_DATABASE_NAME).dropDatabase();
	});

	var WKCFakeRequest = function(inputData = {}) {
		return Object.assign({
			OLSKSharedConnectionFor: function() {
				return {
					OLSKConnectionClient: mongoClient,
				};
			},
			headers: {
				'x-client-key': process.env.WKC_INSECURE_API_ACCESS_TOKEN,
			},
		}, inputData);
	};

	describe('WKCAPISettingsLastRepoIDWithClientAndCallback', function testWKCAPISettingsLastRepoIDWithClientAndCallback() {

		var fakeRequest = function() {
			return WKCFakeRequest({
				body: {
					WKCNoteBody: 'alpha',
				},
			});
		};

		var fakeResponseAsync = function(callback) {
			return {
				json: function(inputData) {
					return callback(inputData);
				},
			};
		};

		it('throws error if param1 empty', function() {
			assert.throws(function() {
				apiNotesController.WKCAPISettingsLastRepoIDWithClientAndCallback(null, function() {});
			}, /WKCErrorInvalidInput/);
		});

		it('throws error if param2 not function', function() {
			assert.throws(function() {
				apiNotesController.WKCAPISettingsLastRepoIDWithClientAndCallback({}, null);
			}, /WKCErrorInvalidInput/);
		});

		it('returns 0 if no existing items', function(done) {
			apiNotesController.WKCAPISettingsLastRepoIDWithClientAndCallback(mongoClient, function(lastRepoID) {
				assert.strictEqual(lastRepoID, 0);
				done();
			});
		});

		it('returns 1 if created one item', function(done) {
			apiNotesController.WKCActionAPINotesCreate(fakeRequest(), fakeResponseAsync(function() {
				apiNotesController.WKCAPISettingsLastRepoIDWithClientAndCallback(mongoClient, function(lastRepoID) {
					assert.strictEqual(lastRepoID, 1);
				});
				done();
			}));
		});

		it('returns 2 if created two items', function(done) {
			apiNotesController.WKCActionAPINotesCreate(fakeRequest(), fakeResponseAsync(function() {
				apiNotesController.WKCActionAPINotesCreate(fakeRequest(), fakeResponseAsync(function() {
					apiNotesController.WKCAPISettingsLastRepoIDWithClientAndCallback(mongoClient, function(lastRepoID) {
						assert.strictEqual(lastRepoID, 2);
					});
					done();
				}));
			}));
		});

	});

	describe('WKCActionAPINotesCreate', function testWKCActionAPINotesCreate() {

		var fakeRequest = function(inputData = {}) {
			return WKCFakeRequest({
				body: Object.assign({}, inputData),
			});
		};

		var fakeResponse = function() {
			return {
				json: function(inputData) {
					return inputData;
				},
			};
		};

		var fakeResponseAsync = function(callback) {
			return {
				json: function(inputData) {
					return callback(inputData);
				},
			};
		};

		it('returns WKCErrors if no input', function() {
			assert.deepEqual(apiNotesController.WKCActionAPINotesCreate(fakeRequest(), fakeResponse()), {
				WKCErrors: {
					WKCNoteBody: [
						'WKCErrorNotString',
					],
				},
			});
		});

		it('returns created object if valid noteObject', function(done) {
			apiNotesController.WKCActionAPINotesCreate(fakeRequest({
				WKCNoteBody: 'alpha',
			}), fakeResponseAsync(function(responseJSON) {
				assert.strictEqual(responseJSON.WKCNoteID, 1);
				assert.strictEqual(responseJSON.WKCNoteBody, 'alpha');
				assert.strictEqual(responseJSON.WKCNoteDateCreated instanceof Date, true);
				assert.strictEqual(responseJSON.WKCNoteDateUpdated instanceof Date, true);
				done();
			}));
		});

	});

	describe('WKCActionAPINotesRead', function testWKCActionAPINotesRead() {

		var fakeResponseAsync = function(callback) {
			return {
				json: function(inputData) {
					return callback(inputData);
				},
			};
		};

		var fakeNext = function(inputData) {
			return inputData;
		};

		it('returns next(WKCAPIClientError) if wkc_note_id does not exist', function(done) {
			apiNotesController.WKCActionAPINotesRead(WKCFakeRequest({
				params: {
					wkc_note_id: 'alpha',
				}
			}), fakeResponseAsync(), fakeNext(function(inputData) {
				assert.deepEqual(inputData, new (class WKCAPIClientError extends Error {})('WKCAPIClientErrorNotFound'));
				done();
			}));
		});

		it('returns noteObject', function(done) {
			apiNotesController.WKCActionAPINotesCreate(WKCFakeRequest({
				body: {
					WKCNoteBody: 'alpha',
				}
			}), fakeResponseAsync(function(responseJSON) {
				apiNotesController.WKCActionAPINotesRead(WKCFakeRequest({
					params: {
						wkc_note_id: responseJSON.WKCNoteID,
					}
				}), fakeResponseAsync(function(responseJSON) {
					assert.strictEqual(responseJSON.WKCNoteID, 1);
					assert.strictEqual(responseJSON.WKCNoteBody, 'alpha');
					assert.strictEqual(responseJSON.WKCNoteDateCreated instanceof Date, true);
					assert.strictEqual(responseJSON.WKCNoteDateUpdated instanceof Date, true);
					done();
				}));
			}));
		});

	});

});
