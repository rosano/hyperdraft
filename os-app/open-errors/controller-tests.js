/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var errorController = require('./controller');

describe('OLSKControllerSharedErrorHandlers', function testOLSKControllerSharedErrorHandlers() {

	it('returns shared error handlers', function() {
		assert.deepEqual(errorController.OLSKControllerSharedErrorHandlers(), [
			errorController.WKCErrorsFirstHandler,
			errorController.WKCErrors404Handler,
			errorController.WKCErrorsFinalHandler,
		]);
	});

});

describe('WKCErrorsFirstHandler', function testWKCErrorsFirstHandler() {

	var pathPackage = require('path');

	it('sets res.locals.OLSKSharedPageControllerSlug to directory name', function() {
		var res = {
			locals: {},
		};
		errorController.WKCErrorsFirstHandler(new Error('alpha'), null, res, function() {});
		assert.strictEqual(res.locals.OLSKSharedPageControllerSlug, pathPackage.basename(__dirname));
	});

	it('returns next(error)', function() {
		var errorObject = new Error('alpha');
		assert.deepEqual(errorController.WKCErrorsFirstHandler(errorObject, null, {
			locals: {},
		}, function(inputData) {
			return inputData;
		}), errorObject);
	});

});

describe('WKCErrors404Handler', function testWKCErrors404Handler() {

	it('renders page if res.statusCode 404', function() {
		errorController.WKCErrors404Handler(null, {}, {
			statusCode: 404,
			render: function(viewsPath) {
				assert.strictEqual(viewsPath, [
					__dirname,
					'404',
					].join('/'));
			},
		}, null);
	});

	it('returns next(error)', function() {
		var errorObject = new Error('alpha');
		assert.deepEqual(errorController.WKCErrors404Handler(errorObject, null, {}, function(inputData) {
			return inputData;
		}), errorObject);
	});

});

describe('WKCErrorsFinalHandler', function testWKCErrorsFinalHandler() {

	it('renders page', function() {
		errorController.WKCErrorsFinalHandler(null, {}, {
			render: function(viewsPath) {
				assert.strictEqual(viewsPath, [
					__dirname,
					'500',
					].join('/'));
			},
		}, null);
	});

});
