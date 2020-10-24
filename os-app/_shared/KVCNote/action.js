import { factory, detectPrng } from 'ulid';
const uniqueID = typeof require === 'undefined' && navigator.appName === 'Zombie' ? factory(detectPrng(true)) : factory();

import KVCNoteStorage from './storage.js';
import KVCNoteModel from './model.js';
import KVCSettingAction from '../KVCSetting/action.js';
import KVCVersionAction from '../KVCVersion/action.js';
import OLSKString from 'OLSKString';
import KVCTemplate from '../KVCTemplate/main.js';

const mod = {

	async KVCNoteActionCreate (storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		let creationDate = new Date();

		return await KVCNoteStorage.KVCNoteStorageWrite(storageClient, Object.assign(inputData, {
			KVCNoteID: uniqueID(),
			KVCNoteCreationDate: creationDate,
			KVCNoteModificationDate: creationDate,
		}));
	},

	async KVCNoteActionUpdate (storageClient, inputData) {
		if (KVCNoteModel.KVCNoteModelErrorsFor(inputData)) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		return await KVCNoteStorage.KVCNoteStorageWrite(storageClient, Object.assign(inputData, {
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
		
		return await KVCNoteStorage.KVCNoteStorageDelete(storageClient, inputData);
	},

	async KVCNoteActionQuery (storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		return Promise.resolve(Object.values(await KVCNoteStorage.KVCNoteStorageList(storageClient)).sort(function (a, b) {
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

	KVCNoteActionPublishPath (param1, param2) {
		if (KVCNoteModel.KVCNoteModelErrorsFor(param1)) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof param2 !== 'boolean') {
			throw new Error('KVCErrorInputNotValid');
		}

		return param2 ? KVCNoteStorage.KVCNoteStoragePublicRootPagePath() : KVCNoteStorage.KVCNoteStoragePublicObjectPath(param1);
	},

	KVCNoteActionPublicPath (param1, param2) {
		if (KVCNoteModel.KVCNoteModelErrorsFor(param1)) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof param2 !== 'boolean') {
			throw new Error('KVCErrorInputNotValid');
		}

		return param2 ? '/' : KVCNoteStorage.KVCNoteStoragePublicObjectPath(param1);
	},

	async KVCNoteActionPermalinkMap (storageClient, inputData, FakeConnected = false) {
		return Promise.resolve((await mod.KVCNoteActionQuery(storageClient, {
			KVCNoteIsPublic: true,
		})).map(function (e) {
			return [KVCTemplate.KVCTemplatePlaintextTitle(e.KVCNoteBody), (function() {
				const outputData = mod.KVCNoteActionPublicPath(e, e.KVCNoteID === inputData);

				if (FakeConnected) {
					return outputData;
				}

				return KVCNoteStorage.KVCNoteStoragePublicURL(storageClient, outputData);
			})()];
		}).reduce(function (coll, [key, val]) {
			if (typeof coll[key] === 'undefined') {
				coll[key] = val;
			}

			return coll;
		}, {}));
	},

	async KVCNoteActionPublish (storageClient, param1, param2, options) {
		if (KVCNoteModel.KVCNoteModelErrorsFor(param1)) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		if (typeof param2 !== 'string') {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		if (typeof options !== 'object' || options === null) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		if (!param1.KVCNotePublicID) {
			param1.KVCNotePublicID = uniqueID().toLowerCase();
		}

		if (!param1.KVCNotePublishDate) {
			param1.KVCNotePublishDate = new Date();
		}

		await KVCNoteStorage.KVCNoteStoragePublicWrite(storageClient, mod.KVCNoteActionPublishPath(param1, false), param2);

		if (options.KVCOptionIsRoot) {
			await KVCNoteStorage.KVCNoteStoragePublicWrite(storageClient, mod.KVCNoteActionPublishPath(param1, true), param2);
		}

		return await mod.KVCNoteActionUpdate(storageClient, Object.assign(param1, {
			KVCNoteIsPublic: true,
		}));
	},

	async KVCNoteActionRetract (storageClient, param1, param2) {
		if (KVCNoteModel.KVCNoteModelErrorsFor(param1)) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		if (typeof param2 !== 'boolean') {
			throw new Error('KVCErrorInputNotValid');
		}

		await KVCNoteStorage.KVCNoteStoragePublicDelete(storageClient, mod.KVCNoteActionPublishPath(param1, false));

		if (param2) {
			await KVCNoteStorage.KVCNoteStoragePublicDelete(storageClient, mod.KVCNoteActionPublishPath(param1, true));
		}

		return await mod.KVCNoteActionUpdate(storageClient, Object.assign(param1, {
			KVCNoteIsPublic: false,
		}));
	},
	
};
	
export default mod;
