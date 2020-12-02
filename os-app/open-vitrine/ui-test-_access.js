const kDefaultRoutePath = require('./controller.js').OLSKControllerRoutes().shift().OLSKRoutePath;

Object.entries({
	KVCVitrine: '.KVCVitrine',
	
	KVCVitrineIdentity: '.KVCVitrineIdentity',
	KVCVitrineIdentityLogo: '.KVCVitrineIdentityLogo',
	KVCVitrineIdentityName: '.KVCVitrineIdentityName',
	KVCVitrineIdentityBlurb: '.KVCVitrineIdentityBlurb',

	KVCVitrineContent: '.KVCVitrineContent',
	KVCVitrineContentAppButton: '.KVCVitrineContentAppButton',

	KVCVitrineVideoHeading: '.KVCVitrineVideoHeading',
	KVCVitrineVideoFrame: '.KVCVitrineVideoFrame',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('KVCVitrine_Access', function () {

	before(function() {
		return browser.visit(kDefaultRoutePath);
	});
	
	it('shows KVCVitrine', function() {
		browser.assert.elements(KVCVitrine, 1);
	});
	
	it('shows OLSKLanguageSwitcher', function() {
		browser.assert.elements('.OLSKLanguageSwitcher', 1);
	});

	it('shows KVCVitrineIdentity', function () {
		browser.assert.elements(KVCVitrineIdentity, 1);
	});

	it('shows KVCVitrineIdentityLogo', function () {
		browser.assert.elements(KVCVitrineIdentityLogo, 1);
	});

	it('shows KVCVitrineIdentityName', function () {
		browser.assert.elements(KVCVitrineIdentityName, 1);
	});

	it('shows KVCVitrineIdentityBlurb', function () {
		browser.assert.elements(KVCVitrineIdentityBlurb, 1);
	});
	
	it('shows KVCVitrineContent', function() {
		browser.assert.elements(KVCVitrineContent, 1);
	});

	it('shows KVCVitrineContentAppButton', function() {
		browser.assert.elements(KVCVitrineContentAppButton, 1);
	});

	it('shows KVCVitrineVideoHeading', function () {
		browser.assert.elements(KVCVitrineVideoHeading, 1);
	});

	it('shows KVCVitrineVideoFrame', function () {
		browser.assert.elements(KVCVitrineVideoFrame, 1);
	});

	it('shows ROCORootLink', function() {
		browser.assert.elements('.ROCORootLink', 1);
	});

});
