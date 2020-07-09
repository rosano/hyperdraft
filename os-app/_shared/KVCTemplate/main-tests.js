const { throws, deepEqual } = require('assert');

const mainModule = require('./main.js');

const showdown = require('showdown');

describe('KVCTemplatePlaintextTitle', function test_KVCTemplatePlaintextTitle() {

	it('throws if not string', function () {
		throws(function () {
			mainModule.KVCTemplatePlaintextTitle(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		deepEqual(mainModule.KVCTemplatePlaintextTitle(''), '');
	});

	it('extracts if single', function() {
		deepEqual(mainModule.KVCTemplatePlaintextTitle('alfa'), 'alfa');
	});

	it('extracts if multiple', function() {
		deepEqual(mainModule.KVCTemplatePlaintextTitle('alfa\nbravo'), 'alfa');
	});

	it('extracts if blank', function() {
		deepEqual(mainModule.KVCTemplatePlaintextTitle('\nbravo'), '');
	});

});

describe('KVCTemplatePlaintextBody', function test_KVCTemplatePlaintextBody() {

	it('throws if not string', function () {
		throws(function () {
			mainModule.KVCTemplatePlaintextBody(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		deepEqual(mainModule.KVCTemplatePlaintextBody(''), '');
	});

	it('extracts if single', function() {
		deepEqual(mainModule.KVCTemplatePlaintextBody('alfa'), '');
	});

	it('extracts if multiple', function() {
		deepEqual(mainModule.KVCTemplatePlaintextBody('alfa\nbravo'), 'bravo');
	});

	it('extracts if blank', function() {
		deepEqual(mainModule.KVCTemplatePlaintextBody('\nbravo'), 'bravo');
	});

	it('extracts if double break', function() {
		deepEqual(mainModule.KVCTemplatePlaintextBody('alfa\n\nbravo'), 'bravo');
	});

});

describe('KVCTemplateRemappedLinks', function test_KVCTemplateRemappedLinks() {

	it('throws if param1 not string', function () {
		throws(function () {
			mainModule.KVCTemplateRemappedLinks(null, {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws if param2 not object', function () {
		throws(function () {
			mainModule.KVCTemplateRemappedLinks('', null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		deepEqual(mainModule.KVCTemplateRemappedLinks('', {}), '');
	});

	it('ignores if no replacement', function() {
		deepEqual(mainModule.KVCTemplateRemappedLinks('[[alfa]]', {
			bravo: 'charlie',
		}), '[[alfa]]');
	});

	it('ignores if not double-bracket', function() {
		deepEqual(mainModule.KVCTemplateRemappedLinks('[alfa]', {
			alfa: 'bravo',
		}), '[alfa]');
	});

	it('replaces single', function() {
		deepEqual(mainModule.KVCTemplateRemappedLinks('[[alfa]]', {
			alfa: 'bravo',
		}), '[alfa](bravo)');
	});

	it('replaces multiple', function() {
		deepEqual(mainModule.KVCTemplateRemappedLinks('[[alfa]] [[charlie]]', {
			alfa: 'bravo',
			charlie: 'delta',
		}), '[alfa](bravo) [charlie](delta)');
	});

	it('replaces duplicate', function() {
		deepEqual(mainModule.KVCTemplateRemappedLinks('[[alfa]] [[alfa]]', {
			alfa: 'bravo',
		}), '[alfa](bravo) [alfa](bravo)');
	});

});

describe('KVCTemplateHTML', function test_KVCTemplateHTML() {

	it('throws if param1 not showdown', function() {
		throws(function() {
			mainModule.KVCTemplateHTML({
				Converter: null,
			}, '');
		}, /KVCErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mainModule.KVCTemplateHTML(showdown, null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string as p', function() {
		deepEqual(mainModule.KVCTemplateHTML(showdown, 'alfa'), '<p>alfa</p>');
	});

	it('converts simple headers without anchors', function() {
		deepEqual(mainModule.KVCTemplateHTML(showdown, '# alfa'), '<h1>alfa</h1>');
	});

	it('converts single newline as br', function() {
		deepEqual(mainModule.KVCTemplateHTML(showdown, 'alfa\nbravo'), '<p>alfa<br />\nbravo</p>');
	});

	it('converts double newline as p', function() {
		deepEqual(mainModule.KVCTemplateHTML(showdown, 'alfa\n\nbravo'), '<p>alfa</p>\n<p>bravo</p>');
	});

	it('converts www domains to links', function() {
		deepEqual(mainModule.KVCTemplateHTML(showdown, 'www.alfa.com'), '<p><a href="http://www.alfa.com">www.alfa.com</a></p>');
	});

});

describe('KVCTemplateTokensMap', function test_KVCTemplateTokensMap() {

	it('throws if param1 not showdown', function() {
		throws(function() {
			mainModule.KVCTemplateTokensMap({
				Converter: null,
			}, '', {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws if param2 not string', function () {
		throws(function () {
			mainModule.KVCTemplateTokensMap(showdown, null, {})
		}, /KVCErrorInputNotValid/);
	});

	it('throws if param3 not object', function () {
		throws(function () {
			mainModule.KVCTemplateTokensMap(showdown, '', null)
		}, /KVCErrorInputNotValid/);
	});

	it('returns object', function() {
		deepEqual(typeof mainModule.KVCTemplateTokensMap(showdown, '', {}), 'object');
	});

	context('KVCTemplateTokenPostTitle', function () {
		
		it('sets to KVCTemplatePlaintextTitle', function () {
			const item = 'alfa\nbravo';
			deepEqual(mainModule.KVCTemplateTokensMap(showdown, item, {})[mainModule.KVCTemplateTokenPostTitle()], mainModule.KVCTemplatePlaintextTitle(item));
		});
	
	});

	context('KVCTemplateTokenPostBody', function () {
		
		it('sets to KVCTemplateHTML', function () {
			const item = 'alfa\n# bravo';
			deepEqual(mainModule.KVCTemplateTokensMap(showdown, item, {})[mainModule.KVCTemplateTokenPostBody()], mainModule.KVCTemplateHTML(showdown, mainModule.KVCTemplatePlaintextBody(item)));
		});
	
	});

	context('KVCTemplateTokenRootURL', function () {
		
		it('sets to KVCOptionRootURL', function () {
			deepEqual(mainModule.KVCTemplateTokensMap(showdown, '', {
				KVCOptionRootURL: 'alfa',
			})[mainModule.KVCTemplateTokenRootURL()], 'alfa');
		});
	
	});

	context('KVCTemplateTokenRootURLLegacy', function () {
		
		it('sets to KVCOptionRootURL', function () {
			deepEqual(mainModule.KVCTemplateTokensMap(showdown, '', {
				KVCOptionRootURL: 'alfa',
			})[mainModule.KVCTemplateTokenRootURLLegacy()], 'alfa');
		});
	
	});

});

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

describe('KVCTemplateTokenRootURL', function test_KVCTemplateTokenRootURL() {

	it('returns string', function() {
		deepEqual(mainModule.KVCTemplateTokenRootURL(), '{RootURL}');
	});

});

describe('KVCTemplateTokenRootURLLegacy', function test_KVCTemplateTokenRootURLLegacy() {

	it('returns string', function() {
		deepEqual(mainModule.KVCTemplateTokenRootURLLegacy(), '{BlogURL}');
	});

});
