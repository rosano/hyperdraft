const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const uLocalized = function (inputData) {
	return OLSKTestingLocalized(inputData, 'en');
};

describe('KVCFeatures_Misc', function () {

	before(function () {
		return browser.OLSKVisit(kDefaultRoute);
	});

	uLocalized('KVCFeaturesArray').forEach(function (e, i) {

		describe('KVCFeaturesItem', function test_KVCFeaturesItem () {
			
			it('classes OLSKCommonCard', function () {
				browser.assert.hasClass(`${ KVCFeaturesItem }:nth-child(${ i + 1 })`, 'OLSKCommonCard');
			});

			it('classes OLSKCommonFeatureCard', function () {
				browser.assert.hasClass(`${ KVCFeaturesItem }:nth-child(${ i + 1 })`, 'OLSKCommonFeatureCard');
			});

		});

		describe('KVCFeaturesItemIdentity', function test_KVCFeaturesItemIdentity () {
			
			it('sets src', function () {
				browser.assert.attribute(`${ KVCFeaturesItem }:nth-child(${ i + 1 }) ${ KVCFeaturesItemIdentity }`, 'src', [
						'/_shared/__external/OLSKUIAssets/_OLSKSharedFeatureBrackets.svg',
						'/_shared/__external/OLSKUIAssets/_OLSKSharedFeaturePublish.svg',
						'/_shared/__external/OLSKUIAssets/_OLSKSharedFeatureJump.svg',
						'/_shared/__external/OLSKUIAssets/_OLSKSharedFeatureArchive.svg',
					][i]);
			});
			
			it('sets role', function () {
				browser.assert.attribute(`${ KVCFeaturesItem }:nth-child(${ i + 1 }) ${ KVCFeaturesItemIdentity }`, 'role', 'presentation');
			});

		});
		
	});

});
