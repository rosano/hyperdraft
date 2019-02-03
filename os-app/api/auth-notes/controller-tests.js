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
			WKCRouteAPINotesUpdate: {
				OLSKRoutePath: '/api/notes/:wkc_note_id',
				OLSKRouteMethod: 'put',
				OLSKRouteFunction: controllerModule.WKCActionAPINotesUpdate,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPINotesPublish: {
				OLSKRoutePath: '/api/notes/:wkc_note_id/publish',
				OLSKRouteMethod: 'put',
				OLSKRouteFunction: controllerModule.WKCAPINotesPublishAction,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPINotesUnpublish: {
				OLSKRoutePath: '/api/notes/:wkc_note_id/unpublish',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: controllerModule.WKCAPINotesUnpublishAction,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPINotesDelete: {
				OLSKRoutePath: '/api/notes/:wkc_note_id',
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
