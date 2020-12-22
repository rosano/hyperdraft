const kDefaultRoutePath = require('./controller.js').OLSKControllerRoutes().shift().OLSKRoutePath;

Object.entries({
	KVCVitrine: '.KVCVitrine',
	
	KVCVitrineCrown: '.KVCVitrineCrown',
	KVCVitrineCrownIcon: '.KVCVitrineCrownIcon',
	KVCVitrineCrownName: '.KVCVitrineCrownName',
	KVCVitrineCrownBlurb: '.KVCVitrineCrownBlurb',

	KVCVitrineAppButton: '.KVCVitrineAppButton',

	KVCVitrineFeaturesHeading: '.KVCVitrineFeaturesHeading',

	KVCVitrineVideoHeading: '.KVCVitrineVideoHeading',
	KVCVitrineVideo1: '.OLSKCommonVideoList .OLSKCommonVideoListItem.KVCVitrineVideo1 iframe',
	KVCVitrineVideo2: '.OLSKCommonVideoList .OLSKCommonVideoListItem.KVCVitrineVideo2 iframe',

	KVCVitrineSupportHeading: '.KVCVitrineSupportHeading',
	KVCVitrineSupportBlurb: '.KVCVitrineSupportBlurb',
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

	it('shows KVCVitrineCrown', function () {
		browser.assert.elements(KVCVitrineCrown, 1);
	});

	it('shows KVCVitrineCrownIcon', function () {
		browser.assert.elements(KVCVitrineCrownIcon, 1);
	});

	it('shows KVCVitrineCrownName', function () {
		browser.assert.elements(KVCVitrineCrownName, 1);
	});

	it('shows KVCVitrineCrownBlurb', function () {
		browser.assert.elements(KVCVitrineCrownBlurb, 1);
	});
	
	it('shows OLSKCommonWhatIsIt', function() {
		browser.assert.elements('.OLSKCommonWhatIsIt', 1);
	});

	it('shows KVCVitrineAppButton', function() {
		browser.assert.elements(KVCVitrineAppButton, 1);
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

	it('shows KVCVitrineVideoHeading', function () {
		browser.assert.elements(KVCVitrineVideoHeading, 1);
	});

	it('shows KVCVitrineVideo1', function () {
		browser.assert.elements(KVCVitrineVideo1, 1);
	});

	it('shows KVCVitrineVideo2', function () {
		browser.assert.elements(KVCVitrineVideo2, 1);
	});

	it('shows KVCVitrineSupportHeading', function () {
		browser.assert.elements(KVCVitrineSupportHeading, 1);
	});

	it('shows KVCVitrineSupportBlurb', function () {
		browser.assert.elements(KVCVitrineSupportBlurb, 1);
	});

	it('shows ROCORootLink', function() {
		browser.assert.elements('.ROCORootLink', 1);
	});

});
