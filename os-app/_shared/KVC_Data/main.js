import OLSKRemoteStorage from 'OLSKRemoteStorage';

import KVCNoteAction from '../KVCNote/action.js';

const mod = {

	KVC_DataModuleName () {
		return 'wikiavec';
	},

	KVC_DataModule (inputData, options) {
		return OLSKRemoteStorage.OLSKRemoteStorageDataModuleGenerator(mod.KVC_DataModuleName(), options)(inputData);
	},

	KVC_DataImport (storageClient, inputData) {
		if (!Array.isArray(inputData)) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (!inputData.length) {
			throw new Error('KVCErrorInputNotValid');
		}

		return Promise.all(inputData.map(async function (e) {
			const item = await KVCNoteAction.KVCNoteActionCreate(storageClient, e);

			if (item.KVCErrors) {
				return Promise.reject(new Error('KVCErrorInputNotValid'));
			}

			return item;
		}));
	},

	KVC_DataExport (storageClient, inputData) {
		if (!Array.isArray(inputData)) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (!inputData.length) {
			throw new Error('KVCErrorInputNotValid');
		}

		return inputData.map(OLSKRemoteStorage.OLSKRemoteStorageSafeCopy);
	},

};

export default mod;
