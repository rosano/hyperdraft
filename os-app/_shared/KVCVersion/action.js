import { factory } from 'ulid';
const uniqueID = factory();

import KVCVersionStorage from './storage.js';

const mod = {

	async KVCVersionActionCreate (storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		return await KVCVersionStorage.KVCVersionStorageWrite(storageClient, Object.assign(inputData, {
			KVCVersionID: uniqueID(),
		}));
	},

	async KVCVersionActionDelete (storageClient, inputData) {
		return await KVCVersionStorage.KVCVersionStorageDelete(storageClient, inputData);
	},

	async KVCVersionActionQuery (storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		return Promise.resolve(Object.values(await KVCVersionStorage.KVCVersionStorageList(storageClient)).sort(function (a, b) {
			return b.KVCVersionDate - a.KVCVersionDate;
		}).filter(function(e) {
			if (!Object.keys(inputData).length) {
				return true;
			}

			if (Object.keys(inputData).filter(function (key) {
				return e[key] && e[key].match(inputData[key]);
			}).length) {
				return true;
			}

			return false;
		}));
	},
	
};
	
export default mod;
