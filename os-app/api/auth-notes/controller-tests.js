/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var testingLibrary = require('OLSKTesting');

var metalLibrary = require('./metal.js');
var controllerModule = require('./controller');
const versionsMetal = require('../auth-versions/metal.js');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(controllerModule.OLSKControllerRoutes(), {
			WKCRouteAPINotesCreate: {
				OLSKRoutePath: '/api/notes',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: controllerModule.WKCAPINotesCreateAction,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPINotesPublicRead: {
				OLSKRoutePath: '/api/notes/:wkc_note_public_id(\\d+)',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: controllerModule.WKCActionAPINotesPublicRead,
			},
			WKCRouteAPINotesUpdate: {
				OLSKRoutePath: '/api/notes/:wkc_note_id(\\d+)',
				OLSKRouteMethod: 'put',
				OLSKRouteFunction: controllerModule.WKCActionAPINotesUpdate,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPINotesPublish: {
				OLSKRoutePath: '/api/notes/:wkc_note_id(\\d+)/publish',
				OLSKRouteMethod: 'put',
				OLSKRouteFunction: controllerModule.WKCAPINotesPublishAction,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPINotesDelete: {
				OLSKRoutePath: '/api/notes/:wkc_note_id(\\d+)',
				OLSKRouteMethod: 'delete',
				OLSKRouteFunction: controllerModule.WKCAPINotesDeleteAction,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPINotesSearch: {
				OLSKRoutePath: '/api/notes/search',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: controllerModule.WKCAPINotesSearchAction,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
		});
	});

});

var WKCFakeRequest = function(inputData = {}) {
	return Object.assign(testingLibrary.OLSKTestingFakeRequestForHeaders({
		'x-client-key': process.env.WKC_INSECURE_API_ACCESS_TOKEN,
	}), {
		OLSKSharedConnectionFor: function() {
			return {
				OLSKConnectionClient: global.WKCTestingMongoClient,
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

describe('WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback', function testWKCAPISettingsLastGeneratedPublicIDWithClientAndCallback() {

	it('throws error if param1 empty', function() {
		assert.throws(function() {
			controllerModule.WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback(null, function() {});
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param2 not function', function() {
		assert.throws(function() {
			controllerModule.WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback({}, null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns 0 if no existing items', function(done) {
		controllerModule.WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback(global.WKCTestingMongoClient, function(lastRepoID) {
			assert.strictEqual(lastRepoID, 0);

			done();
		});
	});

	it('returns 1 if published one item', function(done) {
		controllerModule.WKCAPINotesCreateAction(WKCFakeRequest({
			body: {
				WKCNoteBody: 'alpha',
			},
		}), WKCFakeResponseAsync(function(noteObject) {
			controllerModule.WKCAPINotesPublishAction(WKCFakeRequest({
				params: {
					wkc_note_id: noteObject.WKCNoteID,
				},
				_WKCAPINotesMiddlewareFindByIDResult: noteObject,
				body: {
					WKCNotePublishStatusIsPublished: true,
				},
			}), WKCFakeResponseAsync(function(responseJSON) {
				controllerModule.WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback(global.WKCTestingMongoClient, function(lastRepoID) {
					assert.strictEqual(lastRepoID, 1);

					done();
				});
			}));
		}));
	});

	it('returns 2 if published two items and deleted first one', function(done) {
		controllerModule.WKCAPINotesCreateAction(WKCFakeRequest({
			body: {
				WKCNoteBody: 'alpha',
			},
		}), WKCFakeResponseAsync(function(noteObject) {
			controllerModule.WKCAPINotesPublishAction(WKCFakeRequest({
				params: {
					wkc_note_id: noteObject.WKCNoteID,
				},
				_WKCAPINotesMiddlewareFindByIDResult: noteObject,
				body: {
					WKCNotePublishStatusIsPublished: true,
				},
			}), WKCFakeResponseAsync(function(responseJSON) {
				controllerModule.WKCAPINotesDeleteAction(WKCFakeRequest({
					params: {
						wkc_note_id: noteObject.WKCNoteID.toString(),
					},
				}), WKCFakeResponseAsync(function() {
					controllerModule.WKCAPINotesCreateAction(WKCFakeRequest({
						body: {
							WKCNoteBody: 'alpha',
						},
					}), WKCFakeResponseAsync(function(noteObject) {
						controllerModule.WKCAPINotesPublishAction(WKCFakeRequest({
							params: {
								wkc_note_id: noteObject.WKCNoteID,
							},
							_WKCAPINotesMiddlewareFindByIDResult: noteObject,
							body: {
								WKCNotePublishStatusIsPublished: true,
							},
						}), WKCFakeResponseAsync(function(responseJSON) {
							controllerModule.WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback(global.WKCTestingMongoClient, function(lastRepoID) {
								assert.strictEqual(lastRepoID, 2);

								done();
							});
						}));
					}));
				}));
			}));
		}));
	});

});

describe('WKCActionAPINotesPublicRead', function testWKCActionAPINotesPublicRead() {

	it('returns next(WKCAPIClientError) if wkc_note_id does not exist', function(done) {
		controllerModule.WKCActionAPINotesPublicRead(WKCFakeRequest({
			params: {
				wkc_note_public_id: 'alpha',
			},
		}), WKCFakeResponseAsync(), function(inputData) {
			assert.deepEqual(inputData, new Error('WKCAPIClientErrorNotFound'));

			done();
		});
	});

	it('returns noteObject', function(done) {
		controllerModule.WKCAPINotesCreateAction(WKCFakeRequest({
			body: {
				WKCNoteBody: 'alpha\nbravo',
			},
		}), WKCFakeResponseAsync(function(noteObject) {
			controllerModule.WKCAPINotesPublishAction(WKCFakeRequest({
				params: {
					wkc_note_id: noteObject.WKCNoteID,
				},
				_WKCAPINotesMiddlewareFindByIDResult: noteObject,
				body: {
					WKCNotePublishStatusIsPublished: true,
				},
			}), WKCFakeResponseAsync(function(responseJSON) {
				controllerModule.WKCActionAPINotesPublicRead(WKCFakeRequest({
					params: {
						wkc_note_public_id: noteObject.WKCNotePublicID,
					},
				}), WKCFakeResponseAsync(function(noteObjectPublic) {
					assert.deepEqual(noteObjectPublic, {
						WKCNotePublicID: 1,
						WKCNoteBody: noteObject.WKCNoteBody,
						WKCNoteDateCreated: noteObject.WKCNoteDateCreated,
						WKCNoteDateUpdated: noteObject.WKCNoteDateUpdated,
						WKCNoteDetectedTitle: 'alpha',
						WKCNoteDetectedBody: 'bravo',
					});

					done();
				}));
			}));
		}));
	});

});
