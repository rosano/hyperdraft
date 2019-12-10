/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var pathPackage = require('path');

//_ OLSKControllerSharedErrorHandlers

exports.OLSKControllerSharedErrorHandlers = function() {
	return [
		exports.KVCErrorsFirstHandler,
		exports.KVCErrors404Handler,
		exports.KVCErrorsFinalHandler,
	];
};

//_ KVCErrorsFirstHandler

exports.KVCErrorsFirstHandler = function(err, req, res, next) {
	res.locals.OLSKSharedPageControllerSlug = pathPackage.basename(__dirname);

	return next(err);
};

//_ KVCErrors404Handler

exports.KVCErrors404Handler = function(err, req, res, next) {
	if (res.statusCode !== 404) {
		return next(err);
	}

	return res.render(req.OLSKLive.OLSKLivePathJoin(__dirname, '404'), {});
};

//_ KVCErrorsFinalHandler

exports.KVCErrorsFinalHandler = function(err, req, res, next) {
	if (res.statusCode === 200) {
		res.status(500);
	}

	if (process.env.NODE_ENV === 'development') {
		return next(err);
	}

	if (err) {
		console.log(err);
	}

	return res.render(req.OLSKLive.OLSKLivePathJoin(__dirname, '500'), {});
};
