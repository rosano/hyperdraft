const kDefaultRoutePath = require('./controller.js').OLSKControllerRoutes().shift().OLSKRoutePath;

const mod = require('./main.js').default;

const uTokenTag = function (inputData) {
	return `{${ mod[inputData]() }}`;
};

describe('KVCTemplate_Misc', function () {

	before(function() {
		return browser.visit(kDefaultRoutePath);
	});

	describe('KVCTemplateHeadTitle', function test_KVCTemplateHeadTitle() {

		it('sets text', function () {
			browser.assert.text(KVCTemplateHeadTitle, uTokenTag('KVCTemplateTokenPostTitle'));
		});
		
	});

	describe('KVCTemplateHeadMetaDescription', function test_KVCTemplateHeadMetaDescription() {

		it('sets value', function () {
			browser.assert.attribute(KVCTemplateHeadMetaDescription, 'content', uTokenTag('KVCTemplateTokenPostBlurb'));
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

	describe('KVCTemplateHeadLinkNormalize', function test_KVCTemplateHeadLinkNormalize() {

		it('sets href', function () {
			browser.assert.attribute(KVCTemplateHeadLinkNormalize, 'href', mod.KVCTemplateNormalizeURL());
		});

	});

	describe('KVCTemplateHeadLinkDecor', function test_KVCTemplateHeadLinkDecor() {

		it('sets href', function () {
			browser.assert.attribute(KVCTemplateHeadLinkDecor, 'href', mod.KVCTemplateDecorURL());
		});

	});

	describe('KVCTemplateBody', function test_KVCTemplateBody() {

		it('classes OLSKDecor', function () {
			browser.assert.hasClass(KVCTemplateBody, 'OLSKDecor');
		});

		it('classes OLSKDecorCapped', function () {
			browser.assert.hasClass(KVCTemplateBody, 'OLSKDecorCapped');
		});

		it('classes OLSKDecorX', function () {
			browser.assert.hasClass(KVCTemplateBody, 'OLSKDecorX');
		});

	});

	describe('KVCRootLink', function test_KVCRootLink() {

		it('sets href', function () {
			browser.assert.attribute(KVCRootLink, 'href', uTokenTag('KVCTemplateTokenRootURL'));
		});

	});

	describe('KVCArticleTitle', function test_KVCArticleTitle() {

		it('sets text', function () {
			browser.assert.text(KVCArticleTitle, uTokenTag('KVCTemplateTokenPostTitle'));
		});

	});

	describe('KVCArticleBody', function test_KVCArticleBody() {

		it('sets text', function () {
			browser.assert.text(KVCArticleBody, uTokenTag('KVCTemplateTokenPostBody'));
		});

	});

	describe('KVCBacklinksLink', function test_KVCBacklinksLink() {

		it('sets href', function () {
			browser.assert.attribute(KVCBacklinksLink, 'href', uTokenTag('KVCTemplateTokenURL'));
		});

		it('sets text', function () {
			browser.assert.text(KVCBacklinksLink, uTokenTag('KVCTemplateTokenName'));
		});

	});

	describe('KVCBacklinksSnippet', function test_KVCBacklinksSnippet() {

		it('sets text', function () {
			browser.assert.text(KVCBacklinksSnippet, uTokenTag('KVCTemplateTokenDescription'));
		});

	});
	
});
