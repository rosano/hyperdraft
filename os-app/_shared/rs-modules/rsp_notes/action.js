(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.RSNotesAction = global.RSNotesAction || {})));
}(this, (function (exports) { 'use strict';	

	const RSNotesMetal = typeof require === 'undefined' ? window.RSNotesMetal : require('./metal.js');

	//_ RSNotesActionUpdate

	const ULIDPackage = typeof require === 'undefined' ? window.ULID : require('ulid');

	exports.RSNotesActionCreate = async function(storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('RSErrorInputInvalid'));
		}

		let creationDate = new Date();

		return await RSNotesMetal.RSNotesMetalWrite(storageClient, Object.assign(inputData, {
			RSNoteID: ULIDPackage.ulid(),
			WKCNoteDateCreated: creationDate,
			RSNoteModificationDate: creationDate,
		}));
	};

	//_ RSNotesActionUpdate

	exports.RSNotesActionUpdate = async function(storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('RSErrorInputInvalid'));
		}

		return await RSNotesMetal.RSNotesMetalWrite(storageClient, Object.assign(inputData, {
			RSNoteModificationDate: new Date(),
		}));
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
