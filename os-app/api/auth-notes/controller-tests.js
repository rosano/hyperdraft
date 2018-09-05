/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var testingLibrary = require('OLSKTesting');

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
				OLSKRoutePath: '/api/notes/:wkc_note_id(\\d+)',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: apiNotesController.WKCActionAPINotesRead,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPINotesUpdate: {
				OLSKRoutePath: '/api/notes/:wkc_note_id(\\d+)',
				OLSKRouteMethod: 'put',
				OLSKRouteFunction: apiNotesController.WKCActionAPINotesUpdate,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPINotesDelete: {
				OLSKRoutePath: '/api/notes/:wkc_note_id(\\d+)',
				OLSKRouteMethod: 'delete',
				OLSKRouteFunction: apiNotesController.WKCActionAPINotesDelete,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPINotesSearch: {
				OLSKRoutePath: '/api/notes/search',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: apiNotesController.WKCActionAPINotesSearch,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
		});
	});

});

describe('OLSKControllerSharedMiddlewares', function testOLSKControllerSharedMiddlewares() {

	it('returns middleware functions', function() {
		assert.deepEqual(apiNotesController.OLSKControllerSharedMiddlewares(), {
			WKCSharedMiddlewareAPINotesFindByID: apiNotesController.WKCAPINotesMiddlewareFindByID,
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
		return Object.assign(testingLibrary.OLSKTestingFakeRequestForHeaders({
			'x-client-key': process.env.WKC_INSECURE_API_ACCESS_TOKEN,
		}), {
			OLSKSharedConnectionFor: function() {
				return {
					OLSKConnectionClient: mongoClient,
				};
			},
			
		}, inputData);
	};

	var WKCFakeResponseSync = function() {
		return {
			json: function(inputData) {
				return inputData;
			},
		};
	};

	var WKCFakeResponseAsync = function(callback) {
		return {
			json: function(inputData) {
				return callback(inputData);
			},
		};
	};

	describe('WKCAPINotesMiddlewareFindByID', function WKCAPINotesMiddlewareFindByID() {

		it('returns next(WKCAPIClientError) without wkc_note_id', function() {
			assert.deepEqual(apiNotesController.WKCAPINotesMiddlewareFindByID(WKCFakeRequest({
				params: {},
			}), testingLibrary.OLSKTestingFakeResponseForJSON(), testingLibrary.OLSKTestingFakeNext()), new Error('WKCAPIClientErrorNotFound'));
		});

		it('returns next(WKCAPIClientError) with null wkc_note_id', function() {
			assert.deepEqual(apiNotesController.WKCAPINotesMiddlewareFindByID(WKCFakeRequest({
				params: {
					wkc_note_id: null,
				},
			}), testingLibrary.OLSKTestingFakeResponseForJSON(), testingLibrary.OLSKTestingFakeNext()), new Error('WKCAPIClientErrorNotFound'));
		});

		it('returns next(WKCAPIClientError) with whitespace wkc_note_id', function() {
			assert.deepEqual(apiNotesController.WKCAPINotesMiddlewareFindByID(WKCFakeRequest({
				params: {
					wkc_note_id: ' ',
				},
			}), testingLibrary.OLSKTestingFakeResponseForJSON(), testingLibrary.OLSKTestingFakeNext()), new Error('WKCAPIClientErrorNotFound'));
		});

		it('returns next(WKCAPIClientError) with non-existant wkc_note_id', function(done) {
			apiNotesController.WKCAPINotesMiddlewareFindByID(WKCFakeRequest({
				params: {
					wkc_note_id: 'alfa',
				},
			}), testingLibrary.OLSKTestingFakeResponseForJSON(), function(inputData) {
				assert.deepEqual(inputData, new Error('WKCAPIClientErrorNotFound'));

				done();
			});
		});

		it('returns next(undefined)', function(done) {
			apiNotesController.WKCActionAPINotesCreate(WKCFakeRequest({
				body: {
					WKCNoteBody: 'alpha',
				},
			}), WKCFakeResponseAsync(function(responseJSON) {
				var requestObject = WKCFakeRequest({
					params: {
						wkc_note_id: responseJSON.WKCNoteID.toString(),
					},
				});
				
				apiNotesController.WKCAPINotesMiddlewareFindByID(requestObject, testingLibrary.OLSKTestingFakeResponseForJSON(), function(inputData) {
					assert.deepEqual(inputData, undefined);

					assert.deepEqual(requestObject._WKCAPINotesMiddlewareFindByIDResult, responseJSON)

					done();
				});
			}));
		});

	});

	describe('WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback', function testWKCAPISettingsLastGeneratedPublicIDWithClientAndCallback() {

		it('throws error if param1 empty', function() {
			assert.throws(function() {
				apiNotesController.WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback(null, function() {});
			}, /WKCErrorInvalidInput/);
		});

		it('throws error if param2 not function', function() {
			assert.throws(function() {
				apiNotesController.WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback({}, null);
			}, /WKCErrorInvalidInput/);
		});

		it('returns 0 if no existing items', function(done) {
			apiNotesController.WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback(mongoClient, function(lastRepoID) {
				assert.strictEqual(lastRepoID, 0);
				
				done();
			});
		});

		it('returns 1 if created one item', function(done) {
			apiNotesController.WKCActionAPINotesCreate(WKCFakeRequest({
				body: {
					WKCNoteBody: 'alpha',
				},
			}), WKCFakeResponseAsync(function() {
				apiNotesController.WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback(mongoClient, function(lastRepoID) {
					assert.strictEqual(lastRepoID, 1);
					
					done();
				});
			}));
		});

		it('returns 2 if created two items and deleted first one', function(done) {
			apiNotesController.WKCActionAPINotesCreate(WKCFakeRequest({
				body: {
					WKCNoteBody: 'alpha',
				},
			}), WKCFakeResponseAsync(function() {
				apiNotesController.WKCActionAPINotesCreate(WKCFakeRequest({
				body: {
					WKCNoteBody: 'alpha',
				},
			}), WKCFakeResponseAsync(function(responseJSON) {
					apiNotesController.WKCActionAPINotesDelete(WKCFakeRequest({
						params: {
							wkc_note_id: responseJSON.WKCNoteID.toString(),
						},
					}), WKCFakeResponseAsync(function() {
						apiNotesController.WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback(mongoClient, function(lastRepoID) {
							assert.strictEqual(lastRepoID, 2);
							
							done();
						});
					}));
				}));
			}));
		});

	});

	describe('WKCActionAPINotesCreate', function testWKCActionAPINotesCreate() {

		it('returns WKCErrors if not valid noteObject', function() {
			assert.deepEqual(apiNotesController.WKCActionAPINotesCreate(WKCFakeRequest({
				body: {},
			}), WKCFakeResponseSync()).WKCErrors, {
				WKCNoteBody: [
					'WKCErrorNotString',
				],
			});
		});

		it('returns noteObject with WKCNoteID', function(done) {
			apiNotesController.WKCActionAPINotesCreate(WKCFakeRequest({
				body: {
					WKCNoteBody: 'alpha',
				},
			}), WKCFakeResponseAsync(function(responseJSON) {
				assert.strictEqual(responseJSON.WKCNoteID, 1);
				assert.strictEqual(responseJSON.WKCNoteBody, 'alpha');
				assert.strictEqual(responseJSON.WKCNoteDateCreated instanceof Date, true);
				assert.strictEqual(responseJSON.WKCNoteDateUpdated instanceof Date, true);
				
				done();
			}));
		});

	});

	describe('WKCActionAPINotesRead', function testWKCActionAPINotesRead() {

		it('returns next(WKCAPIClientError) if wkc_note_id does not exist', function(done) {
			apiNotesController.WKCActionAPINotesRead(WKCFakeRequest({
				params: {
					wkc_note_id: 'alpha',
				},
			}), WKCFakeResponseAsync(), function(inputData) {
				assert.deepEqual(inputData, new Error('WKCAPIClientErrorNotFound'));
				
				done();
			});
		});

		it('returns noteObject', function(done) {
			apiNotesController.WKCActionAPINotesCreate(WKCFakeRequest({
				body: {
					WKCNoteBody: 'alpha',
				},
			}), WKCFakeResponseAsync(function(responseJSON) {
				apiNotesController.WKCActionAPINotesRead(WKCFakeRequest({
					params: {
						wkc_note_id: responseJSON.WKCNoteID.toString(),
					},
				}), WKCFakeResponseAsync(function(responseJSON) {
					assert.strictEqual(responseJSON.WKCNoteID, 1);
					assert.strictEqual(responseJSON.WKCNoteBody, 'alpha');
					assert.strictEqual(responseJSON.WKCNoteDateCreated instanceof Date, true);
					assert.strictEqual(responseJSON.WKCNoteDateUpdated instanceof Date, true);

					done();
				}));
			}));
		});

	});

	describe('WKCActionAPINotesUpdate', function testWKCActionAPINotesUpdate() {

		it('returns next(WKCAPIClientError) if wkc_note_id does not exist', function(done) {
			apiNotesController.WKCActionAPINotesUpdate(WKCFakeRequest({
				params: {
					wkc_note_id: 'alpha',
				},
				body: {
					WKCNoteBody: 'bravo',
				},
			}), WKCFakeResponseSync(), function(inputData) {
				assert.deepEqual(inputData, new Error('WKCAPIClientErrorNotFound'));

				done();
			});
		});

		it('returns WKCErrors if not valid noteObject', function(done) {
			apiNotesController.WKCActionAPINotesCreate(WKCFakeRequest({
				params: {
					wkc_note_id: '',
				},
				body: {
					WKCNoteBody: 'alpha',
				},
			}), WKCFakeResponseAsync(function(responseJSON) {
				assert.deepEqual(apiNotesController.WKCActionAPINotesUpdate(WKCFakeRequest({
					params: {
						wkc_note_id: responseJSON.WKCNoteID,
					},
					body: Object.assign(responseJSON, {
						WKCNoteBody: null,
					}),
				}), WKCFakeResponseSync()).WKCErrors, {
					WKCNoteBody: [
						'WKCErrorNotString',
					],
				});

				done();
			}));
		});

		it('returns noteObject with updated properties', function(done) {
			apiNotesController.WKCActionAPINotesCreate(WKCFakeRequest({
				body: {
					WKCNoteBody: 'alpha',
				},
			}), WKCFakeResponseAsync(function(responseJSON) {
				var originalDateUpdated = responseJSON.WKCNoteDateUpdated;

				apiNotesController.WKCActionAPINotesUpdate(WKCFakeRequest({
					params: {
						wkc_note_id: responseJSON.WKCNoteID,
					},
					body: Object.assign(responseJSON, {
						WKCNoteBody: 'bravo',
					}),
				}), WKCFakeResponseAsync(function(responseJSON) {
					assert.strictEqual(responseJSON.WKCNoteBody, 'bravo');
					assert.strictEqual(responseJSON.WKCNoteDateUpdated > originalDateUpdated, true);
					
					done();
				}));
			}));
		});

	});

	describe('WKCActionAPINotesDelete', function testWKCActionAPINotesDelete() {

		it('returns next(WKCAPIClientError) if wkc_note_id does not exist', function(done) {
			apiNotesController.WKCActionAPINotesDelete(WKCFakeRequest({
				params: {
					wkc_note_id: 'alpha',
				},
			}), WKCFakeResponseAsync(), function(inputData) {
				assert.deepEqual(inputData, new Error('WKCAPIClientErrorNotFound'));
				
				done();
			});
		});

		it('returns true', function(done) {
			apiNotesController.WKCActionAPINotesCreate(WKCFakeRequest({
				body: {
					WKCNoteBody: 'alpha',
				}
			}), WKCFakeResponseAsync(function(responseJSON) {
				var noteID = responseJSON.WKCNoteID.toString();
				apiNotesController.WKCActionAPINotesDelete(WKCFakeRequest({
					params: {
						wkc_note_id: noteID,
					},
				}), WKCFakeResponseAsync(function(responseJSON) {
					assert.strictEqual(responseJSON.WKCAPIResponse, true);

					apiNotesController.WKCActionAPINotesRead(WKCFakeRequest({
						params: {
							wkc_note_id: noteID,
						},
					}), WKCFakeResponseAsync(), function(inputData) {
						assert.deepEqual(inputData, new Error('WKCAPIClientErrorNotFound'));

						done();
					});
				}));
			}));
		});

	});

	describe('WKCActionAPINotesSearch', function testWKCActionAPINotesSearch() {

		it('returns noteObject', function(done) {
			apiNotesController.WKCActionAPINotesCreate(WKCFakeRequest({
				body: {
					WKCNoteBody: 'alpha',
				},
			}), WKCFakeResponseAsync(function(responseJSON) {
				apiNotesController.WKCActionAPINotesSearch(WKCFakeRequest(), WKCFakeResponseAsync(function(responseJSON) {
					assert.strictEqual(Array.isArray(responseJSON), true);
					assert.strictEqual(responseJSON[0]._id, undefined);
					assert.strictEqual(responseJSON[0].WKCNoteID, 1);
					assert.strictEqual(responseJSON[0].WKCNoteBody, 'alpha');
					assert.strictEqual(responseJSON[0].WKCNoteDateCreated instanceof Date, true);
					assert.strictEqual(responseJSON[0].WKCNoteDateUpdated instanceof Date, true);
					
					done();
				}));
			}));
		});

	});

});
