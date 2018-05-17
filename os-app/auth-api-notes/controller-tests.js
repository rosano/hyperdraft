/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

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

		mongoClient.close()
	});

	beforeEach(function() {
		mongoClient.db(process.env.WKC_SHARED_DATABASE_NAME).dropDatabase();
	});

	var apiNotesController = require('./controller');

	describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

		it('returns route objects', function() {
			assert.deepEqual(apiNotesController.OLSKControllerRoutes(), {
				WKCRouteAPINotesAdd: {
					OLSKRoutePath: '/api/notes',
					OLSKRouteMethod: 'post',
					OLSKRouteFunction: apiNotesController.WKCActionAPINotesCreate,
					OLSKRouteMiddlewares: [
						'WKCSharedMiddlewareAPIAuthenticate',
					],
				},
			});
		});

	});

	describe('WKCActionAPINotesCreate', function testWKCActionAPINotesCreate() {

		var fakeRequest = function(inputData = {}) {
			return {
				OLSKSharedConnectionFor: function() {
					return {
						OLSKConnectionClient: mongoClient,
					}
				},
				body: Object.assign({}, inputData),
				headers: {
					'x-client-key': process.env.WKC_INSECURE_API_ACCESS_TOKEN,
				},
			};
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
				assert.deepEqual(responseJSON.WKCNoteBody, 'alpha');
				assert.deepEqual(responseJSON.WKCNoteDateCreated instanceof Date, true);
				assert.deepEqual(responseJSON.WKCNoteDateUpdated instanceof Date, true);
				done();
			}));
		});

	});

});
