const kDefaultRoutePath = require('./controller.js').OLSKControllerRoutes().shift().OLSKRoutePath;

const mainModule = require('./template.js');

describe('KVCTemplate_Misc', function () {

	before(function() {
		return browser.visit(kDefaultRoutePath);
	});

	describe('KVCTemplateHeadTitle', function test_KVCTemplateHeadTitle() {

		it('sets text', function () {
			browser.assert.text(KVCTemplateHeadTitle, mainModule.KVCTemplateTokenPostTitle());
		});
		
	});

	describe('KVCTemplateArticleHeading', function test_KVCTemplateArticleHeading() {

		it('sets text', function () {
			browser.assert.text(KVCTemplateArticleHeading, mainModule.KVCTemplateTokenPostTitle());
		});

	});

	describe('KVCTemplateArticleContent', function test_KVCTemplateArticleContent() {

		it('sets text', function () {
			browser.assert.text(KVCTemplateArticleContent, mainModule.KVCTemplateTokenPostBody());
		});

	});
	
});
