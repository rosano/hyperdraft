import { throws, deepEqual } from 'assert';

import * as mainModule from './model.js';

const kTesting = {
	StubSettingObjectValid: function() {
		return {
			WKXSettingKey: 'alfa',
			WKXSettingValue: 'bravo',
		};
	},
};

describe('WKXSettingModelErrorsFor', function testWKXSettingModelErrorsFor() {

	it('throws error if not object', function() {
		throws(function() {
			mainModule.WKXSettingModelErrorsFor(null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns object if WKXSettingKey not string', function() {
		deepEqual(mainModule.WKXSettingModelErrorsFor(Object.assign(kTesting.StubSettingObjectValid(), {
			WKXSettingKey: null,
		})), {
			WKXSettingKey: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns object if WKXSettingKey not filled', function() {
		deepEqual(mainModule.WKXSettingModelErrorsFor(Object.assign(kTesting.StubSettingObjectValid(), {
			WKXSettingKey: ' ',
		})), {
			WKXSettingKey: [
				'WKCErrorNotFilled',
			],
		});
	});

	it('returns object if WKXSettingValue not string', function() {
		deepEqual(mainModule.WKXSettingModelErrorsFor(Object.assign(kTesting.StubSettingObjectValid(), {
			WKXSettingValue: null,
		})), {
			WKXSettingValue: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mainModule.WKXSettingModelErrorsFor(kTesting.StubSettingObjectValid()), null);
	});

});
