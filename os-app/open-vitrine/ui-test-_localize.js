const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (OLSKRoutingLanguage) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, OLSKRoutingLanguage);
	};

	describe(`KVCVitrine_Localize-${ OLSKRoutingLanguage }`, function () {

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

		it('localizes KVCVitrineCrownName', function () {
			browser.assert.text(KVCVitrineCrownName, uLocalized('KVCVitrineTitle'));
		});

		it('localizes KVCVitrineCrownBlurb', function () {
			browser.assert.text(KVCVitrineCrownBlurb, uLocalized('KVCVitrineDescription'));
		});

		it('localizes OLSKCommonWhatIsIt', function () {
			browser.assert.text('.OLSKCommonWhatIsIt', uLocalized('OLSKCommonWhatIsItText'));
		});

		it('localizes KVCVitrineContentAppButton', function () {
			browser.assert.text(KVCVitrineContentAppButton, uLocalized('OLSKWordingOpenApp'));
		});

		it('localizes KVCVitrineFeaturesHeading', function () {
			browser.assert.text(KVCVitrineFeaturesHeading, uLocalized('OLSKWordingFeatures'));
		});

		it('localizes KVCVitrineVideoHeading', function () {
			browser.assert.text(KVCVitrineVideoHeading, uLocalized('OLSKWordingVideo'));
		});

		it('localizes KVCVitrineSupportHeading', function () {
			browser.assert.text(KVCVitrineSupportHeading, uLocalized('OLSKWordingSupportHeading'));
		});

		it('localizes KVCVitrineSupportBlurb', function () {
			browser.assert.text(KVCVitrineSupportBlurb, uLocalized('OLSKWordingSupportBlurb'));
		});

		context('KVCVitrineContentAppButton', function test_KVCVitrineContentAppButton () {

			it('classes OLSKCommonButton', function () {
				browser.assert.hasClass(KVCVitrineContentAppButton, 'OLSKCommonButton');
			});
			
			it('classes OLSKCommonButtonPrimary', function () {
				browser.assert.hasClass(KVCVitrineContentAppButton, 'OLSKCommonButtonPrimary');
			});
			
			it('sets href', function () {
				browser.assert.attribute(KVCVitrineContentAppButton, 'href', OLSKTestingCanonical(require('../open-write/controller.js').OLSKControllerRoutes().shift()));
			});
		
		});

	});

});
