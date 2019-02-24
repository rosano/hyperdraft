(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCNotesAction = global.WKCNotesAction || {})));
}(this, (function (exports) { 'use strict';	

	const WKCNotesMetal = typeof require === 'undefined' ? window.WKCNotesMetal : require('./metal.js');

	//_ WKCNotesActionUpdate

	const ULIDPackage = typeof require === 'undefined' ? window.ULID : require('ulid');

	exports.WKCNotesActionCreate = async function(storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		let creationDate = new Date();

		return await WKCNotesMetal.WKCNotesMetalWrite(storageClient, Object.assign(inputData, {
			WKCNoteID: ULIDPackage.ulid(),
			WKCNoteDateCreated: creationDate,
			WKCNoteModificationDate: creationDate,
		}));
	};

	//_ WKCNotesActionUpdate

	exports.WKCNotesActionUpdate = async function(storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		return await WKCNotesMetal.WKCNotesMetalWrite(storageClient, Object.assign(inputData, {
			WKCNoteModificationDate: new Date(),
		}));
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
