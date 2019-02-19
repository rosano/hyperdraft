/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const mainModule = require('./controller.js');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(mainModule.OLSKControllerRoutes(), {
			WKCRouteAPIArticlesCreate: {
				OLSKRoutePath: '/api/articles',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: mainModule.WKCActionAPIArticlesCreate,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPIArticlesRead: {
				OLSKRoutePath: '/api/articles/:wkc_article_id',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: mainModule.WKCActionAPIArticlesRead,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPIArticlesUpdate: {
				OLSKRoutePath: '/api/articles/:wkc_article_id',
				OLSKRouteMethod: 'put',
				OLSKRouteFunction: mainModule.WKCActionAPIArticlesUpdate,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPIArticlesDelete: {
				OLSKRoutePath: '/api/articles/:wkc_article_id',
				OLSKRouteMethod: 'delete',
				OLSKRouteFunction: mainModule.WKCActionAPIArticlesDelete,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPIArticlesSearch: {
				OLSKRoutePath: '/api/articles/search',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: mainModule.WKCActionAPIArticlesSearch,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
		});
	});

});
