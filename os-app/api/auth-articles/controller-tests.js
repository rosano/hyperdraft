/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var testingLibrary = require('OLSKTesting');

var controllerModule = require('./controller');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(controllerModule.OLSKControllerRoutes(), {
			WKCRouteAPIArticlesCreate: {
				OLSKRoutePath: '/api/articles',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: controllerModule.WKCActionAPIArticlesCreate,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPIArticlesRead: {
				OLSKRoutePath: '/api/articles/:wkc_article_id',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: controllerModule.WKCActionAPIArticlesRead,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPIArticlesUpdate: {
				OLSKRoutePath: '/api/articles/:wkc_article_id',
				OLSKRouteMethod: 'put',
				OLSKRouteFunction: controllerModule.WKCActionAPIArticlesUpdate,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPIArticlesDelete: {
				OLSKRoutePath: '/api/articles/:wkc_article_id',
				OLSKRouteMethod: 'delete',
				OLSKRouteFunction: controllerModule.WKCActionAPIArticlesDelete,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPIArticlesSearch: {
				OLSKRoutePath: '/api/articles/search',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: controllerModule.WKCActionAPIArticlesSearch,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
		});
	});

});
