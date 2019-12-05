import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('WKCWriteFooter_Misc', function () {


	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	describe('WKCWriteFooter', function testWKCWriteFooter () {

		it('sets class', function () {
			browser.assert.hasClass(WKCWriteFooter, 'OLSKMobileViewFooter');
		});

	});

	describe('WKCWriteFooterDonateLink', function testWKCWriteFooterDonateLink () {

		it('sets href', function () {
			browser.assert.attribute(WKCWriteFooterDonateLink, 'href', process.env.WKC_SHARED_DONATE_URL);
		});

		it('sets target', function () {
			browser.assert.attribute(WKCWriteFooterDonateLink, 'target', '_blank');
		});

	});

	describe('WKCWriteFooterStorageStatus', function testWKCWriteFooterStorageStatus () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WKCWriteFooterStorageStatus: 'alfa',
			});
		});

		it('sets text', function () {
			browser.assert.text(WKCWriteFooterStorageStatus, 'alfa');
		});

	});

	describe('WKCWriteFooterStorageButton', function testWKCWriteFooterStorageButton () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});
	
		it('sets class', function () {
			browser.assert.hasClass(WKCWriteFooterStorageButton, 'OLSKLayoutButtonNoStyle');
			browser.assert.hasClass(WKCWriteFooterStorageButton, 'OLSKLayoutElementTappable');
		});

		context('click', function () {

			before(function () {
				browser.assert.text('#TestWKCWriteFooterDispatchStorage', '0');
			});

			before(function () {
				browser.click(WKCWriteFooterStorageButton);
			});
	
			it('sends WKCWriteFooterDispatchStorage', function () {
				browser.assert.text('#TestWKCWriteFooterDispatchStorage', '1');
			});
	
		});

	});

	describe('WKCWriteFooterStorageButtonImage', function testWKCWriteFooterStorageButtonImage () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});
	
		it('sets role', function () {
			browser.assert.attribute(WKCWriteFooterStorageButtonImage, 'role', 'img');
		});
	
		it('sets src', function () {
			browser.assert.attribute(WKCWriteFooterStorageButtonImage, 'src', '/open-track/submodules/WKCWriteFooter/ui-images/WKCWriteFooterStorageButton.svg');
		});

	});

});
