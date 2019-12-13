import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWriteFooter_Misc', function () {


	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	describe('KVCWriteFooter', function testKVCWriteFooter () {

		it('sets class', function () {
			browser.assert.hasClass(KVCWriteFooter, 'OLSKMobileViewFooter');
		});

	});

	describe('KVCWriteFooterDonateLink', function testKVCWriteFooterDonateLink () {

		it('sets href', function () {
			browser.assert.attribute(KVCWriteFooterDonateLink, 'href', process.env.KVC_SHARED_DONATE_URL);
		});

		it('sets target', function () {
			browser.assert.attribute(KVCWriteFooterDonateLink, 'target', '_blank');
		});

	});

	describe('KVCWriteFooterStorageStatus', function testKVCWriteFooterStorageStatus () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteFooterStorageStatus: 'alfa',
			});
		});

		it('sets text', function () {
			browser.assert.text(KVCWriteFooterStorageStatus, 'alfa');
		});

	});

	describe('KVCWriteFooterStorageButton', function testKVCWriteFooterStorageButton () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});

		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteFooterStorageButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(KVCWriteFooterStorageButton, 'OLSKLayoutElementTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(KVCWriteFooterStorageButton, 'OLSKToolbarButton');
		});
	
		context('click', function () {

			before(function () {
				browser.assert.text('#TestKVCWriteFooterDispatchStorage', '0');
			});

			before(function () {
				browser.click(KVCWriteFooterStorageButton);
			});
	
			it('sends KVCWriteFooterDispatchStorage', function () {
				browser.assert.text('#TestKVCWriteFooterDispatchStorage', '1');
			});
	
		});

	});

	describe('KVCWriteFooterStorageButtonImage', function testKVCWriteFooterStorageButtonImage () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});
	
		it('sets src', function () {
			browser.assert.elements(`${ KVCWriteFooterStorageButtonImage } #_OLSKSharedCloud`, 1);
		});

	});

});
