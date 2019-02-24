(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.RSNotesModel = global.RSNotesModel || {})));
}(this, (function (exports) { 'use strict';

	//_ RSNotesModelErrorsFor

	exports.RSNotesModelErrorsFor = function(inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('RSErrorInputInvalid');
		}

		var errors = {};

		if (typeof inputData.RSNoteID !== 'string') {
			errors.RSNoteID = [
				'RSErrorNotString',
			];
		}

		if (typeof inputData.RSNoteBody !== 'string') {
			errors.RSNoteBody = [
				'RSErrorNotString',
			];
		}

		if (!(inputData.RSNoteCreationDate instanceof Date) || Number.isNaN(inputData.RSNoteCreationDate.getTime())) {
			errors.RSNoteCreationDate = [
				'RSErrorNotDate',
			];
		}

		if (!(inputData.RSNoteModificationDate instanceof Date) || Number.isNaN(inputData.RSNoteModificationDate.getTime())) {
			errors.RSNoteModificationDate = [
				'RSErrorNotDate',
			];
		}

		if (typeof inputData.RSNotePublishStatusIsPublished !== 'undefined') {
			if (typeof inputData.RSNotePublishStatusIsPublished !== 'boolean') {
				errors.RSNotePublishStatusIsPublished = [
					'RSErrorNotBoolean',
				];
			}
		}

		return Object.entries(errors).length ? errors : null;
	};

	//_ RSNotesModelPreJSONSchemaValidate

	exports.RSNotesModelPreJSONSchemaValidate = function(inputData) {
		if (inputData.RSNoteCreationDate) {
			inputData.RSNoteCreationDate = inputData.RSNoteCreationDate.toISOString();
		}

		if (inputData.RSNoteModificationDate) {
			inputData.RSNoteModificationDate = inputData.RSNoteModificationDate.toISOString();
		}

		return inputData;
	};

	//_ RSNotesModelPostJSONParse

	exports.RSNotesModelPostJSONParse = function(inputData) {
		if (!inputData) {
			return inputData;
		}
		
		if (inputData.RSNoteCreationDate) {
			inputData.RSNoteCreationDate = new Date(inputData.RSNoteCreationDate);
		}

		if (inputData.RSNoteModificationDate) {
			inputData.RSNoteModificationDate = new Date(inputData.RSNoteModificationDate);
		}

		return inputData;
	};

	//_ OLSKTypeJSONSchemaForErrors

	exports.OLSKTypeJSONSchemaForErrors = function(inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('RSErrorInputInvalid');
		}

		return {
			type: 'object',
			properties: Object.entries(inputData).reduce(function (coll, [key, val]) {
				coll[key] = {};

				coll[key].type = [...val].shift().replace('RSErrorNot', '').toLowerCase();

				if (coll[key].type === 'date') {
					coll[key].type = 'string';
					coll[key].format = 'date-time';
				}

				return coll;
			}, {}),
			required: Object.entries(inputData).filter(function ([key, val]) {
				return !val.includes('__RSOptional');
			}).map(function ([key, val]) {
				return key;
			}),
		};
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));