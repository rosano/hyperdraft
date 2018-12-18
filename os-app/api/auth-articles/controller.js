/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var modelLibrary = require('./model');
var metalLibrary = require('./metal');

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCRouteAPIArticlesCreate: {
			OLSKRoutePath: '/api/articles',
			OLSKRouteMethod: 'post',
			OLSKRouteFunction: exports.WKCActionAPIArticlesCreate,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPIArticlesSearch: {
			OLSKRoutePath: '/api/articles/search',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCActionAPIArticlesSearch,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPIArticlesRead: {
			OLSKRoutePath: '/api/articles/:wkc_article_id',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCActionAPIArticlesRead,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPIArticlesUpdate: {
			OLSKRoutePath: '/api/articles/:wkc_article_id',
			OLSKRouteMethod: 'put',
			OLSKRouteFunction: exports.WKCActionAPIArticlesUpdate,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPIArticlesDelete: {
			OLSKRoutePath: '/api/articles/:wkc_article_id',
			OLSKRouteMethod: 'delete',
			OLSKRouteFunction: exports.WKCActionAPIArticlesDelete,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
	};
};

//_ WKCActionAPIArticlesCreate

exports.WKCActionAPIArticlesCreate = function(req, res, next) {
	return metalLibrary.WKCMetalArticlesCreate(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.body, function(err, responseJSON) {
		if (err) {
			throw err;
		}

		if (responseJSON.WKCErrors) {
			res.status(400);
		}
		
		return res.json(responseJSON);
	});
};

//_ WKCActionAPIArticlesRead

exports.WKCActionAPIArticlesRead = function(req, res, next) {
	return metalLibrary.WKCMetalArticlesRead(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.params.wkc_article_id, function(err, responseJSON) {
		if (err) {
			throw err;
		}
		
		return res.json(responseJSON);
	});
};

//_ WKCActionAPIArticlesUpdate

exports.WKCActionAPIArticlesUpdate = function(req, res, next) {
	return metalLibrary.WKCMetalArticlesUpdate(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.params.wkc_article_id, req.body, function(err, responseJSON) {
		if (err) {
			throw err;
		}

		if (responseJSON.WKCErrors) {
			res.status(400);
		}

		return res.json(responseJSON);
	});
};

//_ WKCActionAPIArticlesDelete

exports.WKCActionAPIArticlesDelete = function(req, res, next) {
	return metalLibrary.WKCMetalArticlesDelete(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.params.wkc_article_id, function(err, responseJSON) {
		if (err) {
			throw err;
		}

		return res.json(responseJSON);
	});
};

//_ WKCActionAPIArticlesSearch

exports.WKCActionAPIArticlesSearch = function(req, res, next) {
	return metalLibrary.WKCMetalArticlesSearch(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, '', function(err, responseJSON) {
		if (err) {
			throw err;
		}

		return res.json(responseJSON);
	});
};
