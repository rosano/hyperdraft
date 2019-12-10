import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCWriteDetail: '.KVCWriteDetail',
	
	KVCWriteDetailPlaceholder: '.KVCWriteDetailPlaceholder',

	KVCWriteDetailToolbar: '.KVCWriteDetailToolbar',
	KVCWriteDetailToolbarBackButton: '.KVCWriteDetailToolbarBackButton',
	KVCWriteDetailToolbarJumpButton: '.KVCWriteDetailToolbarJumpButton',
	KVCWriteDetailToolbarPublishButton: '.KVCWriteDetailToolbarPublishButton',
	KVCWriteDetailToolbarPublicLink: '.KVCWriteDetailToolbarPublicLink',
	KVCWriteDetailToolbarRetractButton: '.KVCWriteDetailToolbarRetractButton',
	KVCWriteDetailToolbarVersionsButton: '.KVCWriteDetailToolbarVersionsButton',
	KVCWriteDetailToolbarDiscardButton: '.KVCWriteDetailToolbarDiscardButton',	
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

	it('shows KVCWriteDetailPlaceholder', function () {
		browser.assert.elements(KVCWriteDetailPlaceholder, 1);
	});

	it('hides KVCWriteDetailToolbar', function () {
		browser.assert.elements(KVCWriteDetailToolbar, 0);
	});

	it('hides KVCWriteEditor', function () {
		browser.assert.elements('.KVCWriteEditor', 0);
	});

	context('KVCWriteDetailItem', function() {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify({
					KVCNoteBody: 'alfa',
				}),
			});
		});

		it('hides KVCWriteDetailPlaceholder', function () {
			browser.assert.elements(KVCWriteDetailPlaceholder, 0);
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

		it('shows KVCWriteDetailToolbarJumpButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarJumpButton, 1);
		});

		it('shows KVCWriteDetailToolbarPublishButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarPublishButton, 1);
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

		it('shows KVCWriteDetailToolbarDiscardButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarDiscardButton, 1);
		});

		it('shows KVCWriteEditor', function () {
			browser.assert.elements('.KVCWriteEditor', 1);
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

	});

});
