const kDefaultRoutePath = require('./controller.js').OLSKControllerRoutes().shift().OLSKRoutePath;

const mainModule = require('./main.js');

describe('KVCTemplate_Misc', function () {

	before(function() {
		return browser.visit(kDefaultRoutePath);
	});

	describe('KVCTemplateHeadTitle', function test_KVCTemplateHeadTitle() {

		it('sets text', function () {
			browser.assert.text(KVCTemplateHeadTitle, `{${ mainModule.KVCTemplateTokenPostTitle() }}`);
		});
		
	});

	describe('KVCTemplateHeadMetaContentType', function test_KVCTemplateHeadMetaContentType() {

		it('sets value', function () {
			browser.assert.attribute(KVCTemplateHeadMetaContentType, 'content', 'text/html; charset=utf-8');
		});

	});

	describe('KVCTemplateHeadMetaViewport', function test_KVCTemplateHeadMetaViewport() {

		it('sets value', function () {
			browser.assert.attribute(KVCTemplateHeadMetaViewport, 'content', 'width=device-width');
		});

	});

	describe('KVCTemplateBody', function test_KVCTemplateBody() {

		it('classes body', function () {
			browser.assert.hasClass(KVCTemplateBody, 'KVCBox');
		});

	});

	describe('KVCRootLink', function test_KVCRootLink() {

		it('sets href', function () {
			browser.assert.attribute(KVCRootLink, 'href', `{${ mainModule.KVCTemplateTokenRootURL() }}`);
		});

	});

	describe('KVCArticleTitle', function test_KVCArticleTitle() {

		it('sets text', function () {
			browser.assert.text(KVCArticleTitle, `{${ mainModule.KVCTemplateTokenPostTitle() }}`);
		});

	});

	describe('KVCArticleBody', function test_KVCArticleBody() {

		it('sets text', function () {
			browser.assert.text(KVCArticleBody, `{${ mainModule.KVCTemplateTokenPostBody() }}`);
		});

	});
	
});
