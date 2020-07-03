const { throws, deepEqual } = require('assert');

const mainModule = require('./main.js').default;

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

describe('KVCTemplateReplaceLinks', function test_KVCTemplateReplaceLinks() {

	it('throws if param1 not string', function() {
		throws(function() {
			mainModule.KVCTemplateReplaceLinks(null, {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws if param2 not object', function() {
		throws(function() {
			mainModule.KVCTemplateReplaceLinks('', null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns param1', function() {
		deepEqual(mainModule.KVCTemplateReplaceLinks('alfa', {}), 'alfa');
	});

	it('excludes if no replacement', function() {
		deepEqual(mainModule.KVCTemplateReplaceLinks('[[alfa]]', {
			bravo: 'charlie',
		}), '[[alfa]]');
	});

	it('excludes if not double-bracket', function() {
		deepEqual(mainModule.KVCTemplateReplaceLinks('[alfa]', {
			alfa: 'bravo',
		}), '[alfa]');
	});

	it('includes if single', function() {
		deepEqual(mainModule.KVCTemplateReplaceLinks('[[alfa]]', {
			alfa: 'bravo',
		}), '[alfa](bravo)');
	});

	it('includes if multiple', function() {
		deepEqual(mainModule.KVCTemplateReplaceLinks('[[alfa]] [[charlie]]', {
			alfa: 'bravo',
			charlie: 'delta',
		}), '[alfa](bravo) [charlie](delta)');
	});

	it('includes if global', function() {
		deepEqual(mainModule.KVCTemplateReplaceLinks('[[alfa]] [[alfa]]', {
			alfa: 'bravo',
		}), '[alfa](bravo) [alfa](bravo)');
	});

});

describe('KVCTemplateHTML', function test_KVCTemplateHTML() {

	it('throws if not string', function() {
		throws(function() {
			mainModule.KVCTemplateHTML(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string as p', function() {
		deepEqual(mainModule.KVCTemplateHTML('alfa'), '<p>alfa</p>');
	});

	it('converts simple headers without anchors', function() {
		deepEqual(mainModule.KVCTemplateHTML('# alfa'), '<h1>alfa</h1>');
	});

	it('converts single newline as br', function() {
		deepEqual(mainModule.KVCTemplateHTML('alfa\nbravo'), '<p>alfa<br />\nbravo</p>');
	});

	it('converts double newline as p', function() {
		deepEqual(mainModule.KVCTemplateHTML('alfa\n\nbravo'), '<p>alfa</p>\n<p>bravo</p>');
	});

	it('converts www domains to links', function() {
		deepEqual(mainModule.KVCTemplateHTML('www.alfa.com'), '<p><a href="http://www.alfa.com">www.alfa.com</a></p>');
	});

});

describe('KVCTemplateViewDefault', function test_KVCTemplateViewDefault() {

	it('returns string', function() {
		deepEqual(typeof mainModule.KVCTemplateViewDefault(), 'string');
	});

	it('begins with doctype', function() {
		deepEqual(mainModule.KVCTemplateViewDefault().match('<!DOCTYPE html>').index, 0);
	});

	it('contains html', function() {
		deepEqual(mainModule.KVCTemplateViewDefault().match('<html>').index < mainModule.KVCTemplateViewDefault().match('</html>').index, true);
	});

	it('contains head', function() {
		deepEqual(mainModule.KVCTemplateViewDefault().match('<head>').index < mainModule.KVCTemplateViewDefault().match('</head>').index, true);
	});

	it('contains title', function() {
		deepEqual(mainModule.KVCTemplateViewDefault().match('<title>').index < mainModule.KVCTemplateViewDefault().match('</title>').index, true);
	});

	it('contains body', function() {
		deepEqual(mainModule.KVCTemplateViewDefault().match('<body>').index < mainModule.KVCTemplateViewDefault().match('</body>').index, true);
	});

	it('contains KVCTemplateTokenPostTitle in title', function() {
		deepEqual(!!mainModule.KVCTemplateViewDefault().match(`<title>${ mainModule.KVCTemplateTokenPostTitle() }</title>`), true);
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
