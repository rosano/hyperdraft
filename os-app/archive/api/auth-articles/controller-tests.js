/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const mainModule = require('./controller.js');

describe('OLSKControllerRoutes', function test_OLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(mainModule.OLSKControllerRoutes(), {
			WKCRouteAPIArticlesCreate: {
				OLSKRoutePath: '/api/articles',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: mainModule.WKCActionAPIArticlesCreate,
				OLSKRouteMiddlewares: [
					'KVCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPIArticlesRead: {
				OLSKRoutePath: '/api/articles/:wkc_article_id',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: mainModule.WKCActionAPIArticlesRead,
				OLSKRouteMiddlewares: [
					'KVCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPIArticlesUpdate: {
				OLSKRoutePath: '/api/articles/:wkc_article_id',
				OLSKRouteMethod: 'put',
				OLSKRouteFunction: mainModule.WKCActionAPIArticlesUpdate,
				OLSKRouteMiddlewares: [
					'KVCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPIArticlesDelete: {
				OLSKRoutePath: '/api/articles/:wkc_article_id',
				OLSKRouteMethod: 'delete',
				OLSKRouteFunction: mainModule.WKCActionAPIArticlesDelete,
				OLSKRouteMiddlewares: [
					'KVCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPIArticlesSearch: {
				OLSKRoutePath: '/api/articles/search',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: mainModule.WKCActionAPIArticlesSearch,
				OLSKRouteMiddlewares: [
					'KVCSharedMiddlewareAPIAuthenticate',
				],
			},
		});
	});

});
