/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const OLSKTesting = require('OLSKTesting');

var controllerModule = require('./controller.js');

describe('OLSKControllerSharedErrorHandlers', function test_OLSKControllerSharedErrorHandlers() {

	it('returns shared error handlers', function() {
		assert.deepEqual(controllerModule.OLSKControllerSharedErrorHandlers(), [
			controllerModule.KVCErrorsFirstHandler,
			controllerModule.KVCErrors404Handler,
			controllerModule.KVCErrorsFinalHandler,
		]);
	});

});

describe.skip('KVCErrorsFirstHandler', function test_KVCErrorsFirstHandler() {

	var pathPackage = require('path');

	it('sets res.locals.OLSKSharedPageControllerSlug to folder name', function() {
		var res = OLSKTesting.OLSKTestingFakeResponseForLocals();
		controllerModule.KVCErrorsFirstHandler(new Error('alpha'), null, res, OLSKTesting.OLSKTestingFakeNext());
		assert.strictEqual(res.locals.OLSKSharedPageControllerSlug, pathPackage.basename(__dirname));
	});

	it('returns next(error)', function() {
		var errorObject = new Error('alpha');
		assert.deepEqual(controllerModule.KVCErrorsFirstHandler(errorObject, null, OLSKTesting.OLSKTestingFakeResponseForLocals(), OLSKTesting.OLSKTestingFakeNext()), errorObject);
	});

});

describe.skip('KVCErrors404Handler', function test_KVCErrors404Handler() {

	it('returns next(error)', function() {
		var errorObject = new Error('alpha');
		assert.deepEqual(controllerModule.KVCErrors404Handler(errorObject, null, OLSKTesting.OLSKTestingFakeRequest(), OLSKTesting.OLSKTestingFakeNext()), errorObject);
	});

});
