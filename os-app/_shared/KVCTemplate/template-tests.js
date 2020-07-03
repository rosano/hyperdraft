const { throws, deepEqual } = require('assert');

const mainModule = require('./template.js');

describe('KVCTemplateViewDefault', function test_KVCTemplateViewDefault() {

	const uTag = function (inputData) {
		return new RegExp(`<${ inputData }>[\\s\\S]*</${ inputData }>`)
	};

	const uTagContent = function (param1, param2) {
		return new RegExp(`<${ param1 }>[\\s\\S]*${ param2 }[\\s\\S]*</${ param1 }>`)
	};

	it('returns string', function() {
		deepEqual(typeof mainModule.KVCTemplateViewDefault(), 'string');
	});

	it('begins with doctype', function() {
		deepEqual(mainModule.KVCTemplateViewDefault().match('<!DOCTYPE html>').index, 0);
	});

	it('contains html', function() {
		deepEqual(!!mainModule.KVCTemplateViewDefault().match(uTag('html')), true);
	});

	it('contains head', function() {
		deepEqual(!!mainModule.KVCTemplateViewDefault().match(uTag('head')), true);
	});

	it('contains title', function() {
		deepEqual(!!mainModule.KVCTemplateViewDefault().match(uTag('title')), true);
	});

	it('contains body', function() {
		deepEqual(!!mainModule.KVCTemplateViewDefault().match(uTag('body')), true);
	});

	it('contains KVCTemplateTokenPostTitle in title', function() {
		deepEqual(!!mainModule.KVCTemplateViewDefault().match(uTagContent('title', mainModule.KVCTemplateTokenPostTitle())), true);
	});

});

describe('KVCTemplateTokenPostTitle', function test_KVCTemplateTokenPostTitle() {

	it('returns string', function() {
		deepEqual(mainModule.KVCTemplateTokenPostTitle(), '{Title}');
	});

});

describe('KVCTemplateTokenPostBody', function test_KVCTemplateTokenPostBody() {

	it('returns string', function() {
		deepEqual(mainModule.KVCTemplateTokenPostBody(), '{Body}');
	});

});
