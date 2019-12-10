import { KVCNoteModelErrorsFor, KVCNoteModelPostJSONParse } from './model.js';

export const KVCNoteMetalWrite = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	let errors = KVCNoteModelErrorsFor(inputData);

	if (errors) {
		return Promise.resolve({
			KVCErrors: errors,
		});
	}

	return await storageClient.wikiavec.kvc_notes.writeObject(inputData.KVCNoteID, inputData);
};

export const KVCNoteMetalRead = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	return KVCNoteModelPostJSONParse(await storageClient.wikiavec.kvc_notes.readObject(inputData));
};

export const KVCNoteMetalList = async function(storageClient) {
	let outputData = await storageClient.wikiavec.kvc_notes.listObjects();

	for (let key in outputData) {
		KVCNoteModelPostJSONParse(outputData[key]);
	}
	
	return outputData;
};

export const KVCNoteMetalDelete = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	return await storageClient.wikiavec.kvc_notes.deleteObject(inputData);
};
