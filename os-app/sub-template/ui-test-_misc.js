const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWriteTemplate_Misc', function () {

	const KVCWriteTemplateData = Math.random().toString();

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			KVCWriteTemplateData,			
		});
	});

	describe('KVCWriteTemplate', function test_KVCWriteTemplate () {

		it('classes OLSKDecor', function () {
			browser.assert.hasClass(KVCWriteTemplate, 'OLSKDecor');
		});

		it('classes OLSKDecorBigForm', function () {
			browser.assert.hasClass(KVCWriteTemplate, 'OLSKDecorBigForm');
		});

	});

	describe('KVCWriteTemplateDataField', function test_KVCWriteTemplateDataField () {

		it('binds KVCWriteTemplateData', function () {
			browser.assert.input(KVCWriteTemplateDataField, KVCWriteTemplateData);
		});
		
	});

	describe('KVCWriteTemplateUpdateButton', function test_KVCWriteTemplateUpdateButton () {

		context('click', function () {

			const item = Math.random().toString();
			
			before(function () {
				browser.fill(KVCWriteTemplateDataField, item);
			});

			before(function () {
				browser.assert.text('#TestKVCWriteTemplateDispatchUpdate', '0');
				browser.assert.text('#TestKVCWriteTemplateDispatchUpdateData', 'undefined');
			});
			
			before(function () {
				browser.pressButton(KVCWriteTemplateUpdateButton);
			});

			it('sends KVCWriteTemplateDispatchUpdate', function () {
				browser.assert.text('#TestKVCWriteTemplateDispatchUpdate', '1');
				browser.assert.text('#TestKVCWriteTemplateDispatchUpdateData', item);
			});
		
		});
		
	});

});
