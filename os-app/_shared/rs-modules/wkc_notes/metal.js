(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCNotesMetal = global.WKCNotesMetal || {})));
}(this, (function (exports) { 'use strict';

	const WKCNotesModel = typeof require === 'undefined' ? window.WKCNotesModel : require('./model.js');

	//_ WKCNotesMetalWrite

	exports.WKCNotesMetalWrite = async function(storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		let errors = WKCNotesModel.WKCNotesModelErrorsFor(inputData);
		if (errors) {
			return Promise.resolve({
				WKCErrors: errors,
			});
		}

		return await storageClient.wkc_notes.writeObject(inputData.WKCNoteID, inputData);
	};

	//_ WKCNotesMetalRead

	exports.WKCNotesMetalRead = async function(storageClient, inputData) {
		if (typeof inputData !== 'string') {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		return WKCNotesModel.WKCNotesModelPostJSONParse(await storageClient.wkc_notes.readObject(inputData));
	};

	//_ WKCNotesMetalList

	exports.WKCNotesMetalList = async function(storageClient) {
		let outputData = await storageClient.wkc_notes.listObjects();

		for (let key in outputData) {
			WKCNotesModel.WKCNotesModelPostJSONParse(outputData[key]);
		}
		
		return outputData;
	};

	//_ WKCNotesMetalDelete

	exports.WKCNotesMetalDelete = async function(storageClient, inputData) {
		if (typeof inputData !== 'string') {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		return await storageClient.wkc_notes.deleteObject(inputData);
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
