const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const uLocalized = function (inputData) {
	return OLSKTestingLocalized(inputData, 'en');
};

describe('KVCFeatures_Misc', function () {

	before(function () {
		return browser.OLSKVisit(kDefaultRoute);
	});

	uLocalized('KVCFeaturesArray').forEach(function (e, i) {

		describe('KVCFeaturesItemIdentity', function test_KVCFeaturesItemIdentity () {
			
			it('sets src', function () {
				browser.assert.attribute(`.OLSKFeatureListItem:nth-child(${ i + 1 }) .OLSKFeatureListItemImage`, 'src', [
						'/_shared/__external/OLSKUIAssets/_OLSKSharedFeatureBrackets.svg',
						'/_shared/__external/OLSKUIAssets/_OLSKSharedFeaturePublish.svg',
					][i]);
			});
			
			it('sets role', function () {
				browser.assert.attribute(`.OLSKFeatureListItem:nth-child(${ i + 1 }) .OLSKFeatureListItemImage`, 'role', 'presentation');
			});

		});
		
	});

});
