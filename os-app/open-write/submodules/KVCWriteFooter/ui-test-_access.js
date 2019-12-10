import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCWriteFooter: '.KVCWriteFooter',
	
	KVCWriteFooterDonateLink: '.KVCWriteFooterDonateLink',
	
	KVCWriteFooterStorageStatus: '.KVCWriteFooterStorageStatus',
	KVCWriteFooterStorageButton: '.KVCWriteFooterStorageButton',
	KVCWriteFooterStorageButtonImage: '.KVCWriteFooterStorageButtonImage',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('KVCWriteFooter_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	it('shows KVCWriteFooter', function () {
		browser.assert.elements(KVCWriteFooter, 1);
	});

	it('shows OLSKReloadButton', function () {
		browser.assert.elements('.OLSKReloadButton', 1);
	});

	it('shows RCSLanguageSwitcher', function () {
		browser.assert.elements('#RCSLanguageSwitcher', 1);
	});

	it('shows KVCWriteFooterDonateLink', function () {
		browser.assert.elements(KVCWriteFooterDonateLink, 1);
	});

	it('shows KVCWriteFooterStorageStatus', function () {
		browser.assert.elements(KVCWriteFooterStorageStatus, 1);
	});

	it('shows KVCWriteFooterStorageButton', function () {
		browser.assert.elements(KVCWriteFooterStorageButton, 1);
	});

	it('shows KVCWriteFooterStorageButtonImage', function () {
		browser.assert.elements(KVCWriteFooterStorageButtonImage, 1);
	});

});
