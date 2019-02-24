(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.RSNotesMetal = global.RSNotesMetal || {})));
}(this, (function (exports) { 'use strict';	

	const RSNotesModel = typeof require === 'undefined' ? window.RSNotesModel : require('./model.js');

	//_ RSNotesMetalWrite

	exports.RSNotesMetalWrite = async function(storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('RSErrorInputInvalid'));
		}

		let errors = RSNotesModel.RSNotesModelErrorsFor(inputData);
		if (errors) {
			return Promise.resolve({
				RSErrors: errors,
			});
		}

		return await storageClient.rsp_notes.writeObject(inputData.WKCNoteID, inputData);
	};

	//_ RSNotesMetalRead

	exports.RSNotesMetalRead = async function(storageClient, inputData) {
		if (typeof inputData !== 'string') {
			return Promise.reject(new Error('RSErrorInputInvalid'));
		}

		return RSNotesModel.RSNotesModelPostJSONParse(await storageClient.rsp_notes.readObject(inputData));
	};

	//_ RSNotesMetalList

	exports.RSNotesMetalList = async function(storageClient) {
		let outputData = await storageClient.rsp_notes.listObjects();

		for (let key in outputData) {
			RSNotesModel.RSNotesModelPostJSONParse(outputData[key]);
		}
		
		return outputData;
	};

	//_ RSNotesMetalDelete

	exports.RSNotesMetalDelete = async function(storageClient, inputData) {
		if (typeof inputData !== 'string') {
			return Promise.reject(new Error('RSErrorInputInvalid'));
		}

		return await storageClient.rsp_notes.deleteObject(inputData);
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
