(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCSettingsModel = global.WKCSettingsModel || {})));
}(this, (function (exports) { 'use strict';

	//_ WKCSettingsModelErrorsFor

	exports.WKCSettingsModelErrorsFor = function(inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('WKCErrorInputInvalid');
		}

		var errors = {};

		if (typeof inputData.WKCSettingKey !== 'string') {
			errors.WKCSettingKey = [
				'WKCErrorNotString',
			];
		} else if (inputData.WKCSettingKey.trim() === '') {
			errors.WKCSettingKey = [
				'WKCErrorNotFilled',
			];
		}

		if (typeof inputData.WKCSettingValue !== 'string') {
			errors.WKCSettingValue = [
				'WKCErrorNotString',
			];
		}

		return Object.entries(errors).length ? errors : null;
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
