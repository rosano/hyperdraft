(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCVersionsModel = global.WKCVersionsModel || {})));
}(this, (function (exports) { 'use strict';

	//_ WKCVersionsModelErrorsFor

	exports.WKCVersionsModelErrorsFor = function(inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('WKCErrorInputInvalid');
		}

		var errors = {};

		if (typeof inputData.WKCVersionID !== 'string') {
			errors.WKCVersionID = [
				'WKCErrorNotString',
			];
		} else if (inputData.WKCVersionID.trim() === '') {
			errors.WKCVersionID = [
				'WKCErrorNotFilled',
			];
		}

		if (typeof inputData.WKCVersionNoteID !== 'string') {
			errors.WKCVersionNoteID = [
				'WKCErrorNotString',
			];
		} else if (inputData.WKCVersionNoteID.trim() === '') {
			errors.WKCVersionNoteID = [
				'WKCErrorNotFilled',
			];
		}

		if (typeof inputData.WKCVersionBody !== 'string') {
			errors.WKCVersionBody = [
				'WKCErrorNotString',
			];
		}

		if (!(inputData.WKCVersionDate instanceof Date) || Number.isNaN(inputData.WKCVersionDate.getTime())) {
			errors.WKCVersionDate = [
				'WKCErrorNotDate',
			];
		}

		return Object.entries(errors).length ? errors : null;
	};

	//_ WKCVersionsModelPreJSONSchemaValidate

	exports.WKCVersionsModelPreJSONSchemaValidate = function(inputData) {
		if (inputData.WKCVersionDate) {
			inputData.WKCVersionDate = inputData.WKCVersionDate.toISOString();
		}

		return inputData;
	};

	//_ WKCVersionsModelPostJSONParse

	exports.WKCVersionsModelPostJSONParse = function(inputData) {
		if (!inputData) {
			return inputData;
		}
		
		if (inputData.WKCVersionDate) {
			inputData.WKCVersionDate = new Date(inputData.WKCVersionDate);
		}

		return inputData;
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
