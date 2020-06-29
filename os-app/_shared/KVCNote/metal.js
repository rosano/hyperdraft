import KVCNoteModel from './model.js';
import * as OLSKRemoteStoragePackage from 'OLSKRemoteStorage';
const OLSKRemoteStorage = OLSKRemoteStoragePackage.default || OLSKRemoteStoragePackage;

const mod = {

	async KVCNoteMetalWrite (storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		let errors = KVCNoteModel.KVCNoteModelErrorsFor(inputData);

		if (errors) {
			return Promise.resolve({
				KVCErrors: errors,
			});
		}

		return await storageClient.wikiavec.kvc_notes.KVCStorageWrite(inputData);
	},

	async KVCNoteMetalList (storageClient) {
		let outputData = await storageClient.wikiavec.kvc_notes.KVCStorageList();

		for (let key in outputData) {
			OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(outputData[key]);
		}
		
		return outputData;
	},

	async KVCNoteMetalDelete (storageClient, inputData) {
		if (KVCNoteModel.KVCNoteModelErrorsFor(inputData)) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		return await storageClient.wikiavec.kvc_notes.KVCStorageDelete(inputData);
	},

	async KVCNoteMetalMigrateV1 (storageClient, inputData) {
		if (typeof inputData !== 'function') {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		return await storageClient.wikiavec.kvc_notes.KVCStorageMigrateNotesV1(inputData);
	},

};

export default mod;
