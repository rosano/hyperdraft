import { WKCDocumentModelErrorsFor, WKCDocumentModelPostJSONParse } from './model.js';

export const WKCDocumentMetalWrite = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	let errors = WKCDocumentModelErrorsFor(inputData);

	if (errors) {
		return Promise.resolve({
			WKCErrors: errors,
		});
	}

	return await storageClient.wikiavec.wkc_documents.writeObject(inputData.WKCDocumentID, inputData);
};

export const WKCDocumentMetalRead = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return WKCDocumentModelPostJSONParse(await storageClient.wikiavec.wkc_documents.readObject(inputData));
};

export const WKCDocumentMetalList = async function(storageClient) {
	let outputData = await storageClient.wikiavec.wkc_documents.listObjects();

	for (let key in outputData) {
		WKCDocumentModelPostJSONParse(outputData[key]);
	}
	
	return outputData;
};

export const WKCDocumentMetalDelete = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return await storageClient.wikiavec.wkc_documents.deleteObject(inputData);
};
