import { factory, detectPrng } from 'ulid';
const uniqueID = typeof require === 'undefined' && navigator.appName === 'Zombie' ? factory(detectPrng(true)) : factory();

import KVCNoteMetal from './metal.js';
import KVCNoteModel from './model.js';
import KVCNoteStorage from './storage.js';
import KVCSettingAction from '../KVCSetting/action.js';
import KVCVersionAction from '../KVCVersion/action.js';
import * as KVCParserPackage from '../KVCParser/main.js';
const KVCParser = KVCParserPackage.default || KVCParserPackage;
import * as OLSKStringPackage from 'OLSKString';
const OLSKString = OLSKStringPackage.default || OLSKStringPackage;
import * as KVCTemplatePackage from '../KVCTemplate/main.js';
const KVCTemplate = KVCTemplatePackage.default || KVCTemplatePackage;
import * as showdownPackage from 'showdown';
const showdown = showdownPackage.default || showdownPackage;

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

	async KVCNoteActionPublicTitlePathMap (storageClient, inputData, FakeConnected = false) {
		return Promise.resolve((await mod.KVCNoteActionQuery(storageClient, {
			KVCNoteIsPublic: true,
		})).map(function (e) {
			return [KVCParser.KVCParserTitleForPlaintext(e.KVCNoteBody), (function() {
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

	async KVCNoteActionPublish (storageClient, param1, param2, param3, param4) {
		if (KVCNoteModel.KVCNoteModelErrorsFor(param1)) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		if (typeof param2 !== 'string') {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		if (typeof param3 !== 'object' || param3 === null) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		if (typeof param4 !== 'boolean') {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		if (!param1.KVCNotePublicID) {
			param1.KVCNotePublicID = uniqueID().toLowerCase();
		}

		if (!param1.KVCNotePublishDate) {
			param1.KVCNotePublishDate = new Date();
		}

		await (async function(inputData) {
			await KVCNoteStorage.KVCNoteStoragePublicWrite(storageClient, mod.KVCNoteActionPublishPath(param1, false), inputData);

			if (param4) {
				await KVCNoteStorage.KVCNoteStoragePublicWrite(storageClient, mod.KVCNoteActionPublishPath(param1, true), inputData);
			}
		})(OLSKString.OLSKStringReplaceTokens(param2, KVCTemplate.KVCTemplateReplaceTokens(showdown, KVCTemplate.KVCTemplateRemappedLinks(param1.KVCNoteBody, param3), {})));

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
