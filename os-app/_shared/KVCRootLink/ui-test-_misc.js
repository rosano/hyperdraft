const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCRootLink_Misc', function () {

	before(function () {
		return browser.OLSKVisit(kDefaultRoute);
	});

	describe('OLSKRootLink', function () {
		
		it('sets OLSKRootLinkImageURL', function () {
			browser.assert.attribute('.OLSKRootLinkImage', 'src', process.env.OLSK_LAYOUT_TOUCH_ICON_URL);
		});
	
	});

});
