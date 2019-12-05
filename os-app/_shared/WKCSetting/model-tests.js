const { throws, deepEqual } = require('assert');

const mainModule = require('./model.js');

const kTesting = {
	StubSettingObjectValid() {
		return {
			WKCSettingKey: 'alfa',
			WKCSettingValue: 'bravo',
		};
	},
};

describe('WKCSettingModelErrorsFor', function testWKCSettingModelErrorsFor() {

	it('throws error if not object', function() {
		throws(function() {
			mainModule.WKCSettingModelErrorsFor(null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns object if WKCSettingKey not string', function() {
		deepEqual(mainModule.WKCSettingModelErrorsFor(Object.assign(kTesting.StubSettingObjectValid(), {
			WKCSettingKey: null,
		})), {
			WKCSettingKey: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKCSettingKey not filled', function() {
		deepEqual(mainModule.WKCSettingModelErrorsFor(Object.assign(kTesting.StubSettingObjectValid(), {
			WKCSettingKey: ' ',
		})), {
			WKCSettingKey: [
				'WKCErrorNotFilled',
			],
		});
	});

	it('returns object if WKCSettingValue not string', function() {
		deepEqual(mainModule.WKCSettingModelErrorsFor(Object.assign(kTesting.StubSettingObjectValid(), {
			WKCSettingValue: null,
		})), {
			WKCSettingValue: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mainModule.WKCSettingModelErrorsFor(kTesting.StubSettingObjectValid()), null);
	});

});
