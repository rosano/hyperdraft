const kDefaultRoutePath = require('./controller.js').OLSKControllerRoutes().shift().OLSKRoutePath;

Object.entries({
	KVCTemplate: 'html',
	KVCTemplateHead: 'html head',
	KVCTemplateHeadTitle: 'html head title',
	KVCTemplateHeadStyle: 'html head style',
	KVCTemplateHeadMetaContentType: 'html head meta[http-equiv="Content-Type"]',
	KVCTemplateHeadMetaViewport: 'html head meta[name="viewport"]',
	KVCTemplateBody: 'html body',
	KVCRootLink: '.KVCRootLink',
	KVCArticleTitle: '.KVCArticleTitle',
	KVCArticleBody: '.KVCArticleBody',
	KVCBacklinks: '.KVCBacklinks',
	KVCBacklinksHeading: '.KVCBacklinksHeading',
	KVCBacklinksLink: '.KVCBacklinksLink',
	KVCBacklinksSnippet: '.KVCBacklinksSnippet',
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

	it('shows KVCTemplateHeadMetaContentType', function () {
		browser.assert.elements(KVCTemplateHeadMetaContentType, 1);
	});

	it('shows KVCTemplateHeadMetaViewport', function () {
		browser.assert.elements(KVCTemplateHeadMetaViewport, 1);
	});

	it('shows KVCTemplateHeadStyle', function () {
		browser.assert.elements(KVCTemplateHeadStyle, 1);
	});

	it('shows KVCTemplateBody', function () {
		browser.assert.elements(KVCTemplateBody, 1);
	});

	it('shows KVCRootLink', function () {
		browser.assert.elements(KVCRootLink, 1);
	});

	it('shows KVCArticleTitle', function () {
		browser.assert.elements(KVCArticleTitle, 1);
	});

	it('shows KVCArticleBody', function () {
		browser.assert.elements(KVCArticleBody, 1);
	});

	it('shows KVCBacklinks', function () {
		browser.assert.elements(KVCBacklinks, 1);
	});

	it('shows KVCBacklinksHeading', function () {
		browser.assert.elements(KVCBacklinksHeading, 1);
	});

	it('shows KVCBacklinksSnippet', function () {
		browser.assert.elements(KVCBacklinksSnippet, 1);
	});

});
