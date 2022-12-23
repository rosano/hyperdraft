const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCVitrine: '.KVCVitrine',
	
	KVCVitrineFeaturesHeading: '.KVCVitrineFeaturesHeading',

	KVCVitrineGuideButton: '.KVCVitrineGuideButton',

	KVCVitrineDeeperHeading: '.KVCVitrineDeeperHeading',
	KVCVitrineGlossary: '.KVCVitrineGlossary',
	KVCVitrineGlossaryWritingHeading: '.KVCVitrineGlossaryWritingHeading',
	KVCVitrineGlossaryWritingUsingLink: '.KVCVitrineGlossaryWritingUsingLink',
	KVCVitrineGlossaryWritingAnswerLink: '.KVCVitrineGlossaryWritingAnswerLink',
	KVCVitrineGlossaryWritingListsLink: '.KVCVitrineGlossaryWritingListsLink',
	KVCVitrineGlossaryWritingDiscussionLink: '.KVCVitrineGlossaryWritingDiscussionLink',
	KVCVitrineGlossaryPublicHeading: '.KVCVitrineGlossaryPublicHeading',
	KVCVitrineGlossaryPublicRefLink: '.KVCVitrineGlossaryPublicRefLink',
	KVCVitrineGlossaryPublicRefBlurb: '.KVCVitrineGlossaryPublicRefBlurb',
	KVCVitrineGlossaryPublicGardensLink: '.KVCVitrineGlossaryPublicGardensLink',
	KVCVitrineGlossaryPublicGardensBlurb: '.KVCVitrineGlossaryPublicGardensBlurb',
	KVCVitrineGlossaryCompareHeading: '.KVCVitrineGlossaryCompareHeading',
	KVCVitrineGlossaryCompareSimplenoteLink: '.KVCVitrineGlossaryCompareSimplenoteLink',

	KVCVitrineVideoHeading: '.KVCVitrineVideoHeading',
	KVCVitrineVideo1: '.OLSKCommonVideoList .OLSKCommonVideoListItem.KVCVitrineVideo1 iframe',
	KVCVitrineVideo2: '.OLSKCommonVideoList .OLSKCommonVideoListItem.KVCVitrineVideo2 iframe',

	KVCVitrineSupportHeading: '.KVCVitrineSupportHeading',
	KVCVitrineSupportBlurb: '.KVCVitrineSupportBlurb',
}).map(function (e) {
	return global[e.shift()] = e.pop();
});

describe('KVCVitrine_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});
	
	it('shows KVCVitrine', function() {
		browser.assert.elements(KVCVitrine, 1);
	});

	it('shows OLSKCrown', function() {
		browser.assert.elements('.OLSKCrown', 1);
	});
	
	it('shows OLSKLanding', function() {
		browser.assert.elements('.OLSKLanding', 1);
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

	it('shows KVCVitrineDeeperHeading', function () {
		browser.assert.elements(KVCVitrineDeeperHeading, 1);
	});

	it('shows KVCVitrineGlossary', function () {
		browser.assert.elements(KVCVitrineGlossary, 1);
	});

	it('shows KVCVitrineGlossaryWritingHeading', function () {
		browser.assert.elements(KVCVitrineGlossaryWritingHeading, 1);
	});

	it('shows KVCVitrineGlossaryWritingUsingLink', function () {
		browser.assert.elements(KVCVitrineGlossaryWritingUsingLink, 1);
	});

	it('shows KVCVitrineGlossaryWritingAnswerLink', function () {
		browser.assert.elements(KVCVitrineGlossaryWritingAnswerLink, 1);
	});

	it('shows KVCVitrineGlossaryWritingListsLink', function () {
		browser.assert.elements(KVCVitrineGlossaryWritingListsLink, 1);
	});

	it('shows KVCVitrineGlossaryWritingDiscussionLink', function () {
		browser.assert.elements(KVCVitrineGlossaryWritingDiscussionLink, 1);
	});

	it('shows KVCVitrineGlossaryPublicHeading', function () {
		browser.assert.elements(KVCVitrineGlossaryPublicHeading, 1);
	});

	it('shows KVCVitrineGlossaryPublicRefLink', function () {
		browser.assert.elements(KVCVitrineGlossaryPublicRefLink, 1);
	});

	it('shows KVCVitrineGlossaryPublicRefBlurb', function () {
		browser.assert.elements(KVCVitrineGlossaryPublicRefBlurb, 1);
	});

	it('shows KVCVitrineGlossaryPublicGardensLink', function () {
		browser.assert.elements(KVCVitrineGlossaryPublicGardensLink, 1);
	});

	it('shows KVCVitrineGlossaryPublicGardensBlurb', function () {
		browser.assert.elements(KVCVitrineGlossaryPublicGardensBlurb, 1);
	});

	it('shows KVCVitrineGlossaryCompareSimplenoteLink', function () {
		browser.assert.elements(KVCVitrineGlossaryCompareSimplenoteLink, 1);
	});

	it('shows ROCOGlossary', function () {
		browser.assert.elements('.ROCOGlossary', 1);
	});

	it('shows ROCOGlossaryHeading', function () {
		browser.assert.elements('.ROCOGlossaryHeading', 1);
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

	it('shows ROCOGazette', function () {
		browser.assert.elements('.ROCOGazette', 1);
	});

	it('shows OLSKEdit', function () {
		browser.assert.elements('.OLSKEdit', 1);
	});

	it('shows KVCVitrineSupportHeading', function () {
		browser.assert.elements(KVCVitrineSupportHeading, 1);
	});

	it('shows KVCVitrineSupportBlurb', function () {
		browser.assert.elements(KVCVitrineSupportBlurb, 1);
	});

	it('shows SWARLink', function() {
		browser.assert.elements('.SWARLink', 1);
	});

	it('shows ROCORootLink', function() {
		browser.assert.elements('.ROCORootLink', 1);
	});

});
