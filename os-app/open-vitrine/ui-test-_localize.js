const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (OLSKRoutingLanguage) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, OLSKRoutingLanguage);
	};

	describe('KVCVitrine_Localize-' + OLSKRoutingLanguage, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage,
			});
		});

		it('localizes title', function() {
			browser.assert.text('title', uLocalized('KVCVitrineTitle'));
		});

		it('localizes meta[description]', function() {
			browser.assert.attribute('meta[name=description]', 'content', uLocalized('KVCVitrineDescription'));
		});

		it('localizes KVCVitrineFeaturesHeading', function () {
			browser.assert.text(KVCVitrineFeaturesHeading, uLocalized('OLSKWordingFeatures'));
		});

		it('localizes KVCVitrineGuideButton', function () {
			browser.assert.text(KVCVitrineGuideButton, uLocalized('OLSKWordingOpenGuide'));
		});

		it('localizes KVCVitrineDeeperHeading', function () {
			browser.assert.text(KVCVitrineDeeperHeading, uLocalized('OLSKWordingDeeperHeading'));
		});

		it('localizes KVCVitrineGlossaryWritingHeading', function () {
			browser.assert.text(KVCVitrineGlossaryWritingHeading, uLocalized('KVCVitrineGlossaryWritingHeadingText'));
		});

		it('localizes KVCVitrineGlossaryWritingUsingLink', function () {
			browser.assert.text(KVCVitrineGlossaryWritingUsingLink, uLocalized('KVCVitrineGlossaryWritingUsingLinkText'));
		});

		it('localizes KVCVitrineGlossaryWritingAnswerLink', function () {
			browser.assert.text(KVCVitrineGlossaryWritingAnswerLink, uLocalized('KVCVitrineGlossaryWritingAnswerLinkText'));
		});

		it('localizes KVCVitrineGlossaryWritingListsLink', function () {
			browser.assert.text(KVCVitrineGlossaryWritingListsLink, uLocalized('KVCVitrineGlossaryWritingListsLinkText'));
		});

		it('localizes KVCVitrineGlossaryWritingDiscussionLink', function () {
			browser.assert.text(KVCVitrineGlossaryWritingDiscussionLink, uLocalized('KVCVitrineGlossaryWritingDiscussionLinkText'));
		});

		it('localizes KVCVitrineGlossaryPublicHeading', function () {
			browser.assert.text(KVCVitrineGlossaryPublicHeading, uLocalized('KVCVitrineGlossaryPublicHeadingText'));
		});

		it('localizes KVCVitrineGlossaryPublicRefLink', function () {
			browser.assert.text(KVCVitrineGlossaryPublicRefLink, uLocalized('KVCVitrineGlossaryPublicRefLinkText'));
		});

		it('localizes KVCVitrineGlossaryPublicRefBlurb', function () {
			browser.assert.text(KVCVitrineGlossaryPublicRefBlurb, uLocalized('KVCVitrineGlossaryPublicRefBlurbText'));
		});

		it('localizes KVCVitrineGlossaryPublicGardensLink', function () {
			browser.assert.text(KVCVitrineGlossaryPublicGardensLink, uLocalized('KVCVitrineGlossaryPublicGardensLinkText'));
		});

		it('localizes KVCVitrineGlossaryPublicGardensBlurb', function () {
			browser.assert.text(KVCVitrineGlossaryPublicGardensBlurb, uLocalized('KVCVitrineGlossaryPublicGardensBlurbText'));
		});

		it('localizes KVCVitrineGlossaryCompareHeading', function () {
			browser.assert.text(KVCVitrineGlossaryCompareHeading, uLocalized('KVCVitrineGlossaryCompareHeadingText'));
		});

		it('localizes KVCVitrineGlossaryCompareSimplenoteLink', function () {
			browser.assert.text(KVCVitrineGlossaryCompareSimplenoteLink, uLocalized('KVCVitrineGlossaryCompareSimplenoteLinkText'));
		});

		it('localizes KVCVitrineVideoHeading', function () {
			browser.assert.text(KVCVitrineVideoHeading, uLocalized('OLSKWordingVideo'));
		});

		it('localizes KVCVitrineSupportHeading', function () {
			browser.assert.text(KVCVitrineSupportHeading, uLocalized('OLSKWordingFeedbackHeading'));
		});

		it('localizes KVCVitrineSupportBlurb', function () {
			browser.assert.text(KVCVitrineSupportBlurb, uLocalized('OLSKWordingFeedbackBlurb'));
		});

		context('OLSKCrown', function test_OLSKCrown () {

			it('localizes OLSKCrownCardName', function () {
				browser.assert.text('.OLSKCrownCardName', uLocalized('KVCVitrineTitle'));
			});
		
		});

		context('OLSKLanding', function test_OLSKLanding () {

			it('localizes OLSKLandingHeadingText', function () {
				browser.assert.text('.OLSKLandingHeading', uLocalized('KVCVitrineDescription'));
			});

			it('localizes OLSKLandingBlurbText', function () {
				browser.assert.text('.OLSKLandingBlurb', uLocalized('OLSKLandingBlurbText'));
			});

			it('localizes OLSKLandingActionText', function () {
				browser.assert.text('.OLSKLandingAction', uLocalized('OLSKWordingOpenApp'));
			});

			it('localizes OLSKLandingActionHref', function () {
				browser.assert.attribute('.OLSKLandingAction', 'href', OLSKTestingCanonical(require('../open-write/controller.js').OLSKControllerRoutes().shift(), {
					OLSKRoutingLanguage,
				}));
			});
		
		});

		context('KVCVitrineGlossaryCompareSimplenoteLink', function test_KVCVitrineGlossaryCompareSimplenoteLink () {

			it('localizes href', function () {
				browser.assert.attribute(KVCVitrineGlossaryCompareSimplenoteLink, 'href', OLSKTestingCanonical(require('../open-compare-simplenote/controller.js').OLSKControllerRoutes().shift(), {
				}));
			});
		
		});

	});

});
