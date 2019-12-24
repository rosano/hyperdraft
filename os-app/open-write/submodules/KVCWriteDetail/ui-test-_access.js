import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCWriteDetail: '.KVCWriteDetail',
	
	KVCWriteDetailToolbar: '.KVCWriteDetailToolbar',
	KVCWriteDetailToolbarBackButton: '.KVCWriteDetailToolbarBackButton',
	KVCWriteDetailToolbarBackButtonImage: '.KVCWriteDetailToolbarBackButtonImage',
	KVCWriteDetailToolbarJumpButton: '.KVCWriteDetailToolbarJumpButton',
	KVCWriteDetailToolbarJumpButtonImage: '.KVCWriteDetailToolbarJumpButtonImage',
	KVCWriteDetailToolbarPublishButton: '.KVCWriteDetailToolbarPublishButton',
	KVCWriteDetailToolbarPublishButtonImage: '.KVCWriteDetailToolbarPublishButtonImage',
	KVCWriteDetailToolbarPublicLink: '.KVCWriteDetailToolbarPublicLink',
	KVCWriteDetailToolbarRetractButton: '.KVCWriteDetailToolbarRetractButton',
	KVCWriteDetailToolbarRetractButtonImage: '.KVCWriteDetailToolbarRetractButtonImage',
	KVCWriteDetailToolbarVersionsButton: '.KVCWriteDetailToolbarVersionsButton',
	KVCWriteDetailToolbarVersionsButtonImage: '.KVCWriteDetailToolbarVersionsButtonImage',
	KVCWriteDetailToolbarDiscardButton: '.KVCWriteDetailToolbarDiscardButton',	
	KVCWriteDetailToolbarDiscardButtonImage: '.KVCWriteDetailToolbarDiscardButtonImage',	
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('KVCWriteDetail_Access', function () {
	
	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	it('shows KVCWriteDetail', function () {
		browser.assert.elements(KVCWriteDetail, 1);
	});

	it('shows OLSKDetailPlaceholder', function () {
		browser.assert.elements('.OLSKDetailPlaceholder', 1);
	});

	it('hides KVCWriteDetailToolbar', function () {
		browser.assert.elements(KVCWriteDetailToolbar, 0);
	});

	it('hides KVCWriteInput', function () {
		browser.assert.elements('.KVCWriteInput', 0);
	});

	context('KVCWriteDetailItem', function() {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify({
					KVCNoteBody: 'alfa',
				}),
			});
		});

		it('hides OLSKDetailPlaceholder', function () {
			browser.assert.elements('.OLSKDetailPlaceholder', 0);
		});

		it('shows OLSKToolbar', function () {
			browser.assert.elements('.OLSKToolbar', 1);
		});

		it('shows KVCWriteDetailToolbar', function () {
			browser.assert.elements(KVCWriteDetailToolbar, 1);
		});

		it('shows KVCWriteDetailToolbarBackButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarBackButton, 1);
		});

		it('shows KVCWriteDetailToolbarBackButtonImage', function () {
			browser.assert.elements(KVCWriteDetailToolbarBackButtonImage, 1);
		});

		it('shows KVCWriteDetailToolbarJumpButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarJumpButton, 1);
		});

		it('shows KVCWriteDetailToolbarJumpButtonImage', function () {
			browser.assert.elements(KVCWriteDetailToolbarJumpButtonImage, 1);
		});

		it('shows KVCWriteDetailToolbarPublishButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarPublishButton, 1);
		});

		it('shows KVCWriteDetailToolbarPublishButtonImage', function () {
			browser.assert.elements(KVCWriteDetailToolbarPublishButtonImage, 1);
		});

		it('hides KVCWriteDetailToolbarPublicLink', function () {
			browser.assert.elements(KVCWriteDetailToolbarPublicLink, 0);
		});

		it('hides KVCWriteDetailToolbarRetractButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarRetractButton, 0);
		});

		it('shows KVCWriteDetailToolbarVersionsButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarVersionsButton, 1);
		});

		it('shows KVCWriteDetailToolbarVersionsButtonImage', function () {
			browser.assert.elements(KVCWriteDetailToolbarVersionsButtonImage, 1);
		});

		it('shows KVCWriteDetailToolbarDiscardButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarDiscardButton, 1);
		});

		it('shows KVCWriteDetailToolbarDiscardButtonImage', function () {
			browser.assert.elements(KVCWriteDetailToolbarDiscardButtonImage, 1);
		});

		it('shows KVCWriteInput', function () {
			browser.assert.elements('.KVCWriteInput', 1);
		});
		
	});

	context('KVCNotePublishStatusIsPublished', function() {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify({
					KVCNoteBody: 'alfa',
					KVCNotePublishStatusIsPublished: true,
					KVCNotePublicID: 'bravo',
				}),
			});
		});

		it('hides KVCWriteDetailToolbarPublishButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarPublishButton, 0);
		});

		it('shows KVCWriteDetailToolbarPublicLink', function () {
			browser.assert.elements(KVCWriteDetailToolbarPublicLink, 1);
		});

		it('shows KVCWriteDetailToolbarRetractButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarRetractButton, 1);
		});

		it('shows KVCWriteDetailToolbarRetractButtonImage', function () {
			browser.assert.elements(KVCWriteDetailToolbarRetractButtonImage, 1);
		});

	});

});
