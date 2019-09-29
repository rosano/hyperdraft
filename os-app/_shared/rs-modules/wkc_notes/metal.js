import * as WKCNotesModel from './model.js';

export const WKCNotesMetalWrite = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	let errors = WKCNotesModel.WKCNotesModelErrorsFor(inputData);
	if (errors) {
		return Promise.resolve({
			WKCErrors: errors,
		});
	}

	return await storageClient.wkc_notes.writeObject(inputData.WKCNoteID, inputData);
};

export const WKCNotesMetalRead = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return WKCNotesModel.WKCNotesModelPostJSONParse(await storageClient.wkc_notes.readObject(inputData));
};

export const WKCNotesMetalList = async function(storageClient) {
	let outputData = await storageClient.wkc_notes.listObjects();

	for (let key in outputData) {
		WKCNotesModel.WKCNotesModelPostJSONParse(outputData[key]);
	}
	
	return outputData;
};

export const WKCNotesMetalDelete = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return await storageClient.wkc_notes.deleteObject(inputData);
};
