import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	WKCWriteFooter: '.WKCWriteFooter',
	
	WKCWriteFooterDonateLink: '.WKCWriteFooterDonateLink',
	
	WKCWriteFooterStorageStatus: '.WKCWriteFooterStorageStatus',
	WKCWriteFooterStorageButton: '.WKCWriteFooterStorageButton',
	WKCWriteFooterStorageButtonImage: '.WKCWriteFooterStorageButtonImage',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('WKCWriteFooter_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	it('shows WKCWriteFooter', function () {
		browser.assert.elements(WKCWriteFooter, 1);
	});

	it('shows OLSKReloadButton', function () {
		browser.assert.elements('.OLSKReloadButton', 1);
	});

	it('shows RCSLanguageSwitcher', function () {
		browser.assert.elements('#RCSLanguageSwitcher', 1);
	});

	it('shows WKCWriteFooterDonateLink', function () {
		browser.assert.elements(WKCWriteFooterDonateLink, 1);
	});

	it('shows WKCWriteFooterStorageStatus', function () {
		browser.assert.elements(WKCWriteFooterStorageStatus, 1);
	});

	it('shows WKCWriteFooterStorageButton', function () {
		browser.assert.elements(WKCWriteFooterStorageButton, 1);
	});

	it('shows WKCWriteFooterStorageButtonImage', function () {
		browser.assert.elements(WKCWriteFooterStorageButtonImage, 1);
	});

});
