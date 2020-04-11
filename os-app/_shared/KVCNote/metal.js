import { KVCNoteModelErrorsFor, KVCNoteModelPostJSONParse } from './model.js';

const mod = {

	async KVCNoteMetalWrite (storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		let errors = KVCNoteModelErrorsFor(inputData);

		if (errors) {
			return Promise.resolve({
				KVCErrors: errors,
			});
		}

		return await storageClient.wikiavec.kvc_notes.KVCStorageWrite(inputData.KVCNoteID, inputData);
	},

	async KVCNoteMetalRead (storageClient, inputData) {
		if (typeof inputData !== 'string') {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		return KVCNoteModelPostJSONParse(await storageClient.wikiavec.kvc_notes.readObject(inputData));
	},

	async KVCNoteMetalList (storageClient) {
		let outputData = await storageClient.wikiavec.kvc_notes.KVCStorageList();

		for (let key in outputData) {
			KVCNoteModelPostJSONParse(outputData[key]);
		}
		
		return outputData;
	},

	async KVCNoteMetalDelete (storageClient, inputData) {
		if (typeof inputData !== 'string') {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		return await storageClient.wikiavec.kvc_notes.KVCStorageDelete(inputData);
	},

};

export default mod;
