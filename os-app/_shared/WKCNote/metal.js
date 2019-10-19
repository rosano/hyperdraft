import { WKCNoteModelErrorsFor, WKCNoteModelPostJSONParse } from './model.js';

export const WKCNoteMetalWrite = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	let errors = WKCNoteModelErrorsFor(inputData);

	if (errors) {
		return Promise.resolve({
			WKCErrors: errors,
		});
	}

	return await storageClient.wikiavec.wkc_notes.writeObject(inputData.WKCNoteID, inputData);
};

export const WKCNoteMetalRead = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return WKCNoteModelPostJSONParse(await storageClient.wikiavec.wkc_notes.readObject(inputData));
};

export const WKCNoteMetalList = async function(storageClient) {
	let outputData = await storageClient.wikiavec.wkc_notes.listObjects();

	for (let key in outputData) {
		WKCNoteModelPostJSONParse(outputData[key]);
	}
	
	return outputData;
};

export const WKCNoteMetalDelete = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return await storageClient.wikiavec.wkc_notes.deleteObject(inputData);
};
