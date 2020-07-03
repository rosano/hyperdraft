const kDefaultRoutePath = require('./controller.js').OLSKControllerRoutes().shift().OLSKRoutePath;

Object.entries({
	KVCTemplate: 'html',
	KVCTemplateHead: 'html head',
	KVCTemplateHeadTitle: 'html head title',
	KVCTemplateBody: 'html body',
	KVCTemplateArticle: '.KVCTemplateArticle',
	KVCTemplateArticleHeading: '.KVCTemplateArticleHeading',
	KVCTemplateArticleContent: '.KVCTemplateArticleContent',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('KVCTemplate_Access', function () {

	before(function() {
		return browser.visit(kDefaultRoutePath);
	});
	
	it('shows KVCTemplate', function() {
		browser.assert.elements(KVCTemplate, 1);
	});

	it('shows KVCTemplateHead', function () {
		browser.assert.elements(KVCTemplateHead, 1);
	});

	it('shows KVCTemplateHeadTitle', function () {
		browser.assert.elements(KVCTemplateHeadTitle, 1);
	});

	it('shows KVCTemplateBody', function () {
		browser.assert.elements(KVCTemplateBody, 1);
	});

	it('shows KVCTemplateArticle', function () {
		browser.assert.elements(KVCTemplateArticle, 1);
	});

	it('shows KVCTemplateArticleHeading', function () {
		browser.assert.elements(KVCTemplateArticleHeading, 1);
	});

	it('shows KVCTemplateArticleContent', function () {
		browser.assert.elements(KVCTemplateArticleContent, 1);
	});

});
