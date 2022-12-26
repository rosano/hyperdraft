const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCTemplate: 'html',
	KVCTemplateHead: 'html head',
	KVCTemplateHeadTitle: 'html head title',
	KVCTemplateHeadMetaDescription: 'html head meta[name="description"]',
	KVCTemplateHeadMetaContentType: 'html head meta[http-equiv="Content-Type"]',
	KVCTemplateHeadMetaViewport: 'html head meta[name="viewport"]',
	KVCTemplateHeadLinkCanonical: 'html head link[rel="canonical"]',
	KVCTemplateHeadLinkNormalize: 'html head link[rel="stylesheet"]:nth-of-type(2)',
	KVCTemplateHeadLinkDecor: 'html head link[rel="stylesheet"]:nth-of-type(3)',
	KVCTemplateHeadMetaPublished: 'html head meta[property="article:published_time"]',
	KVCTemplateHeadMetaModified: 'html head meta[property="article:modified_time"]',
	KVCTemplateBody: 'html body',
	KVCRootLink: '.KVCRootLink',
	KVCArticleTitle: '.KVCArticleTitle',
	KVCArticleBody: '.KVCArticleBody',
	KVCBacklinks: '.KVCBacklinks',
	KVCBacklinksHeading: '.KVCBacklinksHeading',
	KVCBacklinksLink: '.KVCBacklinksLink',
	KVCBacklinksSnippet: '.KVCBacklinksSnippet',
}).map(function (e) {
	return global[e.shift()] = e.pop();
});

describe('KVCTemplate_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
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

	it('shows KVCTemplateHeadMetaDescription', function () {
		browser.assert.elements(KVCTemplateHeadMetaDescription, 1);
	});

	it('shows KVCTemplateHeadMetaContentType', function () {
		browser.assert.elements(KVCTemplateHeadMetaContentType, 1);
	});

	it('shows KVCTemplateHeadMetaViewport', function () {
		browser.assert.elements(KVCTemplateHeadMetaViewport, 1);
	});

	it('shows KVCTemplateHeadLinkCanonical', function () {
		browser.assert.elements(KVCTemplateHeadLinkCanonical, 1);
	});

	it('shows KVCTemplateHeadLinkNormalize', function () {
		browser.assert.elements(KVCTemplateHeadLinkNormalize, 1);
	});

	it('shows KVCTemplateHeadLinkDecor', function () {
		browser.assert.elements(KVCTemplateHeadLinkDecor, 1);
	});

	it('shows KVCTemplateHeadMetaPublished', function () {
		browser.assert.elements(KVCTemplateHeadMetaPublished, 1);
	});

	it('shows KVCTemplateHeadMetaModified', function () {
		browser.assert.elements(KVCTemplateHeadMetaModified, 1);
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
