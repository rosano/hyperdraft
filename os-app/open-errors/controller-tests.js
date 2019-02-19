/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const OLSKTesting = require('OLSKTesting');

var controllerModule = require('./controller.js');

describe('OLSKControllerSharedErrorHandlers', function testOLSKControllerSharedErrorHandlers() {

	it('returns shared error handlers', function() {
		assert.deepEqual(controllerModule.OLSKControllerSharedErrorHandlers(), [
			controllerModule.WKCErrorsFirstHandler,
			controllerModule.WKCErrors404Handler,
			controllerModule.WKCErrorsFinalHandler,
		]);
	});

});

describe('WKCErrorsFirstHandler', function testWKCErrorsFirstHandler() {

	var pathPackage = require('path');

	it('sets res.locals.OLSKSharedPageControllerSlug to folder name', function() {
		var res = OLSKTesting.OLSKTestingFakeResponseForLocals();
		controllerModule.WKCErrorsFirstHandler(new Error('alpha'), null, res, OLSKTesting.OLSKTestingFakeNext());
		assert.strictEqual(res.locals.OLSKSharedPageControllerSlug, pathPackage.basename(__dirname));
	});

	it('returns next(error)', function() {
		var errorObject = new Error('alpha');
		assert.deepEqual(controllerModule.WKCErrorsFirstHandler(errorObject, null, OLSKTesting.OLSKTestingFakeResponseForLocals(), OLSKTesting.OLSKTestingFakeNext()), errorObject);
	});

});

describe('WKCErrors404Handler', function testWKCErrors404Handler() {

	it('renders page if res.statusCode 404', function() {
		assert.deepEqual(controllerModule.WKCErrors404Handler(null, OLSKTesting.OLSKTestingFakeRequest(), Object.assign(OLSKTesting.OLSKTestingFakeResponseForRender(function(viewPath) {
			return viewPath;
		}), {
			statusCode: 404,
		})), [
			__dirname,
			'404',
		].join('/'));
	});

	it('returns next(error)', function() {
		var errorObject = new Error('alpha');
		assert.deepEqual(controllerModule.WKCErrors404Handler(errorObject, null, OLSKTesting.OLSKTestingFakeRequest(), OLSKTesting.OLSKTestingFakeNext()), errorObject);
	});

});

describe('WKCErrorsFinalHandler', function testWKCErrorsFinalHandler() {

	it('renders page', function() {
		assert.deepEqual(controllerModule.WKCErrorsFinalHandler(null, OLSKTesting.OLSKTestingFakeRequest(), OLSKTesting.OLSKTestingFakeResponseForRender(function(viewPath) {
			return viewPath;
		})), [
			__dirname,
			'500',
		].join('/'));
	});

});
