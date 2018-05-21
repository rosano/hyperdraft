/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var pathPackage = require('path');

//_ OLSKControllerSharedErrorHandlers

exports.OLSKControllerSharedErrorHandlers = function() {
	return [
		exports.WKCErrorsFirstHandler,
		exports.WKCErrors404Handler,
		exports.WKCErrorsFinalHandler,
	];
};

//_ WKCErrorsFirstHandler

exports.WKCErrorsFirstHandler = function(err, req, res, next) {
	res.locals.OLSKSharedPageControllerSlug = pathPackage.basename(__dirname);

	return next(err);
};

//_ WKCErrors404Handler

exports.WKCErrors404Handler = function(err, req, res, next) {
	if (res.statusCode !== 404) {
		return next(err);
	}

	return res.render([
		__dirname,
		'404',
	].join('/'), {});
};

//_ WKCErrorsFinalHandler

exports.WKCErrorsFinalHandler = function(err, req, res, next) {
	if (res.statusCode === 200) {
		res.status(500);
	}

	return res.render([
		__dirname,
		'500',
	].join('/'), {});
};
