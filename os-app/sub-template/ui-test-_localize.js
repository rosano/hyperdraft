const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (OLSKRoutingLanguage) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, OLSKRoutingLanguage);
	};

	describe('KVCWriteTemplate_Localize-' + OLSKRoutingLanguage, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage,
			});
		});

		it('localizes KVCWriteTemplateDataField', function () {
			browser.assert.attribute(KVCWriteTemplateDataField, 'placeholder', uLocalized('KVCWriteTemplateDataFieldText'));
		});

		it('localizes KVCWriteTemplateUpdateButton', function () {
			browser.assert.text(KVCWriteTemplateUpdateButton, uLocalized('KVCWriteTemplateUpdateButtonText'));
		});

	});

});
