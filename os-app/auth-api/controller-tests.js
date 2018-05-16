/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');
require('dotenv').config();

var apiController = require('./controller');

var WKCFakeResponse = function() {
	return {
		json: function(e) {
			return e;
		},
		text: function(e) {
			return e;
		}
	};
};

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(apiController.OLSKControllerRoutes(), {
			WKCRouteAPIRoot: {
				OLSKRoutePath: '/api/',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: apiController.WKCAPIRoot,
			},
			WKCRouteAPINotesAdd: {
				OLSKRoutePath: '/api/notes',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: apiController.index,
			},
		});
	});

});

describe('WKCAPIRoot', function testWKCAPIRoot() {

	it('returns error if not authenticated', function() {
		assert.deepEqual(apiController.WKCAPIRoot({
			headers: {
				authorization: null,
			},
		}, WKCFakeResponse()), {
			WKCError: 'Invalid access token',
		});
	});

	it('returns confirmation authenticated', function() {
		assert.deepEqual(apiController.WKCAPIRoot({
			headers: {
				authorization: ['Bearer', process.env.WKC_INSECURE_API_ACCESS_TOKEN].join(' '),
			},
		}, WKCFakeResponse()), 'Successfully authenticated');
	});

});
