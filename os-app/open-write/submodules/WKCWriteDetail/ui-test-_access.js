import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	WKCWriteDetail: '.WKCWriteDetail',
	
	WKCWriteDetailPlaceholder: '.WKCWriteDetailPlaceholder',

	WKCWriteDetailToolbar: '.WKCWriteDetailToolbar',
	WKCWriteDetailToolbarBackButton: '.WKCWriteDetailToolbarBackButton',
	WKCWriteDetailToolbarJumpButton: '.WKCWriteDetailToolbarJumpButton',
	WKCWriteDetailToolbarPublishButton: '.WKCWriteDetailToolbarPublishButton',
	WKCWriteDetailToolbarPublicLink: '.WKCWriteDetailToolbarPublicLink',
	WKCWriteDetailToolbarRetractButton: '.WKCWriteDetailToolbarRetractButton',
	WKCWriteDetailToolbarVersionsButton: '.WKCWriteDetailToolbarVersionsButton',
	WKCWriteDetailToolbarDiscardButton: '.WKCWriteDetailToolbarDiscardButton',	
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('WKCWriteDetail_Access', function () {
	
	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	it('shows WKCWriteDetail', function () {
		browser.assert.elements(WKCWriteDetail, 1);
	});

	it('shows WKCWriteDetailPlaceholder', function () {
		browser.assert.elements(WKCWriteDetailPlaceholder, 1);
	});

	it('hides WKCWriteDetailToolbar', function () {
		browser.assert.elements(WKCWriteDetailToolbar, 0);
	});

	it('hides WKCWriteEditor', function () {
		browser.assert.elements('.WKCWriteEditor', 0);
	});

	context('WKCWriteDetailItem', function() {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WKCWriteDetailItem: JSON.stringify({
					WKCNoteBody: 'alfa',
				}),
			});
		});

		it('hides WKCWriteDetailPlaceholder', function () {
			browser.assert.elements(WKCWriteDetailPlaceholder, 0);
		});

		it('shows OLSKToolbar', function () {
			browser.assert.elements('.OLSKToolbar', 1);
		});

		it('shows WKCWriteDetailToolbar', function () {
			browser.assert.elements(WKCWriteDetailToolbar, 1);
		});

		it('shows WKCWriteDetailToolbarBackButton', function () {
			browser.assert.elements(WKCWriteDetailToolbarBackButton, 1);
		});

		it('shows WKCWriteDetailToolbarJumpButton', function () {
			browser.assert.elements(WKCWriteDetailToolbarJumpButton, 1);
		});

		it('shows WKCWriteDetailToolbarPublishButton', function () {
			browser.assert.elements(WKCWriteDetailToolbarPublishButton, 1);
		});

		it('hides WKCWriteDetailToolbarPublicLink', function () {
			browser.assert.elements(WKCWriteDetailToolbarPublicLink, 0);
		});

		it('hides WKCWriteDetailToolbarRetractButton', function () {
			browser.assert.elements(WKCWriteDetailToolbarRetractButton, 0);
		});

		it('shows WKCWriteDetailToolbarVersionsButton', function () {
			browser.assert.elements(WKCWriteDetailToolbarVersionsButton, 1);
		});

		it('shows WKCWriteDetailToolbarDiscardButton', function () {
			browser.assert.elements(WKCWriteDetailToolbarDiscardButton, 1);
		});

		it('shows WKCWriteEditor', function () {
			browser.assert.elements('.WKCWriteEditor', 1);
		});
		
	});

	context('WKCNotePublishStatusIsPublished', function() {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WKCWriteDetailItem: JSON.stringify({
					WKCNoteBody: 'alfa',
					WKCNotePublishStatusIsPublished: true,
					WKCNotePublicID: 'bravo',
				}),
			});
		});

		it('hides WKCWriteDetailToolbarPublishButton', function () {
			browser.assert.elements(WKCWriteDetailToolbarPublishButton, 0);
		});

		it('shows WKCWriteDetailToolbarPublicLink', function () {
			browser.assert.elements(WKCWriteDetailToolbarPublicLink, 1);
		});

		it('shows WKCWriteDetailToolbarRetractButton', function () {
			browser.assert.elements(WKCWriteDetailToolbarRetractButton, 1);
		});

	});

});
