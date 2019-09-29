const assert = require('assert');

const mainModule = require('./model.js');

const kTesting = {
	StubSettingObjectValid: function() {
		return {
			WKCSettingKey: 'alfa',
			WKCSettingValue: 'bravo',
		};
	},
};

describe('WKCSettingsModelErrorsFor', function testWKCSettingsModelErrorsFor() {

	it('throws error if not object', function() {
		assert.throws(function() {
			mainModule.WKCSettingsModelErrorsFor(null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns object if WKCSettingKey not string', function() {
		assert.deepEqual(mainModule.WKCSettingsModelErrorsFor(Object.assign(kTesting.StubSettingObjectValid(), {
			WKCSettingKey: null,
		})), {
			WKCSettingKey: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCSettingKey not filled', function() {
		assert.deepEqual(mainModule.WKCSettingsModelErrorsFor(Object.assign(kTesting.StubSettingObjectValid(), {
			WKCSettingKey: ' ',
		})), {
			WKCSettingKey: [
				'WKCErrorNotFilled',
			],
		});
	});

	it('returns object if WKCSettingValue not string', function() {
		assert.deepEqual(mainModule.WKCSettingsModelErrorsFor(Object.assign(kTesting.StubSettingObjectValid(), {
			WKCSettingValue: null,
		})), {
			WKCSettingValue: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns null', function() {
		assert.deepEqual(mainModule.WKCSettingsModelErrorsFor(kTesting.StubSettingObjectValid()), null);
	});

});
