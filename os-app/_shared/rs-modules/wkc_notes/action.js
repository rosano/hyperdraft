(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCNotesAction = global.WKCNotesAction || {})));
}(this, (function (exports) { 'use strict';	

	const WKCNotesMetal = typeof require === 'undefined' ? window.WKCNotesMetal : require('./metal.js');

	//_ WKCNotesActionCreate

	const ULIDPackage = typeof require === 'undefined' ? window.ULID : require('ulid');

	exports.WKCNotesActionCreate = async function(storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		let creationDate = new Date();

		return await WKCNotesMetal.WKCNotesMetalWrite(storageClient, Object.assign(inputData, {
			WKCNoteID: ULIDPackage.ulid(),
			WKCNoteCreationDate: creationDate,
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

	//_ WKCNotesActionQuery
	
	const d3Package = typeof require === 'undefined' ? window.d3 : require('d3');

	exports.WKCNotesActionQuery = async function(storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		return Promise.resolve(Object.values(await WKCNotesMetal.WKCNotesMetalList(storageClient)).sort(function (a, b) {
			return d3Package.descending(a.WKCNoteID, b.WKCNoteID)
		}).filter(function(e) {
			if (!Object.keys(inputData).length) {
				return true;
			}

			if (Object.keys(inputData).filter(function (key) {
				return e[key].match(inputData[key]);
			}).length) {
				return true;
			}

			return false;
		}));
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
