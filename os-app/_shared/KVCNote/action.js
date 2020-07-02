import { factory, detectPrng } from 'ulid';
const uniqueID = typeof require === 'undefined' && navigator.appName === 'Zombie' ? factory(detectPrng(true)) : factory();

import KVCNoteMetal from './metal.js';
import KVCNoteModel from './model.js';
import KVCNoteStorage from './storage.js';
import KVCSettingAction from '../KVCSetting/action.js';
import KVCVersionAction from '../KVCVersion/action.js';
import KVCParser from '../KVCParser/main.js';
import * as OLSKRemoteStoragePackage from 'OLSKRemoteStorage';
const OLSKRemoteStorage = OLSKRemoteStoragePackage.default || OLSKRemoteStoragePackage;

const mod = {

	async KVCNoteActionCreate (storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		let creationDate = new Date();

		return await KVCNoteMetal.KVCNoteMetalWrite(storageClient, Object.assign(inputData, {
			KVCNoteID: uniqueID(),
			KVCNoteCreationDate: creationDate,
			KVCNoteModificationDate: creationDate,
		}));
	},

	async KVCNoteActionUpdate (storageClient, inputData) {
		if (KVCNoteModel.KVCNoteModelErrorsFor(inputData)) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		return await KVCNoteMetal.KVCNoteMetalWrite(storageClient, Object.assign(inputData, {
			KVCNoteModificationDate: new Date(),
		}));
	},

	async KVCNoteActionDelete (storageClient, inputData) {
		if (KVCNoteModel.KVCNoteModelErrorsFor(inputData)) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		await Promise.all((await KVCVersionAction.KVCVersionActionQuery(storageClient, {
			KVCVersionNoteID: inputData.KVCNoteID,
		})).map(function (e) {
			return KVCVersionAction.KVCVersionActionDelete(storageClient, e.KVCVersionID);
		}));
		
		return await KVCNoteMetal.KVCNoteMetalDelete(storageClient, inputData);
	},

	async KVCNoteActionQuery (storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		return Promise.resolve(Object.values(await KVCNoteMetal.KVCNoteMetalList(storageClient)).sort(function (a, b) {
			return b.KVCNoteModificationDate - a.KVCNoteModificationDate;
		}).filter(function(e) {
			if (!Object.keys(inputData).length) {
				return true;
			}

			if (Object.entries(inputData).map(function ([key, value]) {
				return value === e[key];
			}).filter(function (e) {
				return !e;
			}).length) {
				return false;
			}

			return true;
		}));
	},

	async KVCNoteActionPublish (storageClient, inputData) {
		if (KVCNoteModel.KVCNoteModelErrorsFor(inputData)) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		if (!inputData.KVCNotePublicID) {
			inputData.KVCNotePublicID = uniqueID().toLowerCase();
		}

		await KVCNoteStorage.KVCNoteStoragePublicWrite(storageClient, inputData, KVCNoteStorage.KVCNoteStorageObjectPathPublic(inputData));

		return await mod.KVCNoteActionUpdate(storageClient, Object.assign(inputData, {
			KVCNotePublishStatusIsPublished: true,
		}));
	},

	async KVCNoteActionRetract (storageClient, inputData) {
		if (KVCNoteModel.KVCNoteModelErrorsFor(inputData)) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		await KVCNoteStorage.KVCNoteStoragePublicDelete(storageClient, KVCNoteStorage.KVCNoteStorageObjectPathPublic(inputData));

		return await mod.KVCNoteActionUpdate(storageClient, Object.assign(inputData, {
			KVCNotePublishStatusIsPublished: false,
		}));
	},

	async KVCNoteActionGetPublicLinks (storageClient) {
		return Promise.resolve((await mod.KVCNoteActionQuery(storageClient, {
			KVCNotePublishStatusIsPublished: true,
		})).map(OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse).map(function (e) {
			return [KVCParser.KVCParserTitleForPlaintext(e.KVCNoteBody), e.KVCNotePublicID];
		}).reduce(function (coll, [key, val]) {
			if (typeof coll[key] === 'undefined') {
				coll[key] = val;
			}

			return coll;
		}, {}));
	},
	
};
	
export default mod;
