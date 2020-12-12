const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const uLocalized = function (inputData) {
	return OLSKTestingLocalized(inputData, 'en');
};

describe('KVCFeatureList_Misc', function () {

	before(function () {
		return browser.OLSKVisit(kDefaultRoute);
	});

	uLocalized('KVCFeatureListArray').forEach(function (e, i) {

		describe('KVCFeatureListItemIdentity', function test_KVCFeatureListItemIdentity () {
			
			it('sets src', function () {
				browser.assert.attribute(`.OLSKFeatureListItem:nth-child(${ i + 1 }) .OLSKFeatureListItemIcon`, 'src', [
						'/_shared/__external/OLSKUIAssets/_OLSKSharedFeatureBrackets.svg',
						'/_shared/__external/OLSKUIAssets/_OLSKSharedFeaturePublish.svg',
					][i]);
			});
			
			it('sets role', function () {
				browser.assert.attribute(`.OLSKFeatureListItem:nth-child(${ i + 1 }) .OLSKFeatureListItemIcon`, 'role', 'presentation');
			});

		});
		
	});

});
