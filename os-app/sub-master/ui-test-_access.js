const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCWriteMaster: '.KVCWriteMaster',
	
	KVCWriteMasterRevealArchiveButton: '.KVCWriteMasterRevealArchiveButton',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('KVCWriteMaster_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	it('shows KVCWriteMaster', function () {
		browser.assert.elements(KVCWriteMaster, 1);
	});

	it('shows OLSKMasterList', function () {
		browser.assert.elements('.OLSKMasterList', 1);
	});

	it('hides KVCWriteMasterListItem', function () {
		browser.assert.elements('.KVCWriteMasterListItem', 0);
	});

	it('hides KVCWriteMasterRevealArchiveButton', function () {
		browser.assert.elements(KVCWriteMasterRevealArchiveButton, 0);
	});

	context('KVCWriteMasterListItems', function() {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteMasterListItems: JSON.stringify([{
					KVCNoteBody: 'alfa',
				}]),
			});
		});

		it('shows KVCWriteMasterListItem', function () {
			browser.assert.elements('.KVCWriteMasterListItem', 1);
		});
		
	});

	context('KVCWriteMasterRevealArchiveIsVisible', function() {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteMasterListItems: JSON.stringify([]),
				KVCWriteMasterRevealArchiveIsVisible: true,
			});
		});

		it('shows KVCWriteMasterRevealArchiveButton', function () {
			browser.assert.elements(KVCWriteMasterRevealArchiveButton, 1);
		});
		
	});

});
