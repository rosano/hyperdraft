const kDefaultRoutePath = require('./controller.js').OLSKControllerRoutes().shift().OLSKRoutePath;

Object.entries({
	KVCVitrine: '.KVCVitrine',
	
	KVCVitrineCrown: '.KVCVitrineCrown',
	KVCVitrineCrownIcon: '.KVCVitrineCrownIcon',
	KVCVitrineCrownName: '.KVCVitrineCrownName',

	KVCVitrineFeaturesHeading: '.KVCVitrineFeaturesHeading',

	KVCVitrineGuideButton: '.KVCVitrineGuideButton',

	KVCVitrineVideoHeading: '.KVCVitrineVideoHeading',
	KVCVitrineVideo1: '.OLSKCommonVideoList .OLSKCommonVideoListItem.KVCVitrineVideo1 iframe',
	KVCVitrineVideo2: '.OLSKCommonVideoList .OLSKCommonVideoListItem.KVCVitrineVideo2 iframe',

	KVCVitrineGazetteHeading: '.KVCVitrineGazetteHeading',

	KVCVitrineSupportHeading: '.KVCVitrineSupportHeading',
	KVCVitrineSupportBlurb: '.KVCVitrineSupportBlurb',

	KVCVitrineAppringLink: '.KVCVitrineAppringLink',
	KVCVitrineAppringLinkImage: '.KVCVitrineAppringLinkImage',
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
	
	it('shows OLSKLanding', function() {
		browser.assert.elements('.OLSKLanding', 1);
	});

	it('shows KVCVitrineCrown', function () {
		browser.assert.elements(KVCVitrineCrown, 1);
	});

	it('shows KVCVitrineCrownIcon', function () {
		browser.assert.elements(KVCVitrineCrownIcon, 1);
	});

	it('shows KVCVitrineCrownName', function () {
		browser.assert.elements(KVCVitrineCrownName, 1);
	});

	it('shows KVCVitrineFeaturesHeading', function () {
		browser.assert.elements(KVCVitrineFeaturesHeading, 1);
	});

	it('shows KVCFeatureList', function () {
		browser.assert.elements('.KVCFeatureList', 1);
	});

	it('shows OLSKAppFeatureList', function () {
		browser.assert.elements('.OLSKAppFeatureList', 1);
	});

	it('shows OLSKAppFeatureOpenSource', function () {
		browser.assert.elements('.OLSKAppFeatureListItemOpenSource', 1);
	});

	it('shows KVCVitrineGuideButton', function () {
		browser.assert.elements(KVCVitrineGuideButton, 1);
	});

	it('shows KVCVitrineVideoHeading', function () {
		browser.assert.elements(KVCVitrineVideoHeading, 1);
	});

	it('shows KVCVitrineVideo1', function () {
		browser.assert.elements(KVCVitrineVideo1, 1);
	});

	it('shows KVCVitrineVideo2', function () {
		browser.assert.elements(KVCVitrineVideo2, 1);
	});

	it('shows KVCVitrineGazetteHeading', function () {
		browser.assert.elements(KVCVitrineGazetteHeading, 1);
	});

	it('shows OLSKGazette', function () {
		browser.assert.elements('.OLSKGazette', 1);
	});

	it('shows KVCVitrineSupportHeading', function () {
		browser.assert.elements(KVCVitrineSupportHeading, 1);
	});

	it('shows KVCVitrineSupportBlurb', function () {
		browser.assert.elements(KVCVitrineSupportBlurb, 1);
	});

	it('shows KVCVitrineAppringLink', function () {
		browser.assert.elements(KVCVitrineAppringLink, 1);
	});

	it('shows KVCVitrineAppringLinkImage', function () {
		browser.assert.elements(KVCVitrineAppringLinkImage, 1);
	});

	it('shows ROCORootLink', function() {
		browser.assert.elements('.ROCORootLink', 1);
	});

});
