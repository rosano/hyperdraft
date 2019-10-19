import { WKXDocumentModelErrorsFor, WKXDocumentModelPostJSONParse } from './model.js';

export const WKXDocumentMetalWrite = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	let errors = WKXDocumentModelErrorsFor(inputData);

	if (errors) {
		return Promise.resolve({
			WKCErrors: errors,
		});
	}

	return await storageClient.wikiavec.wkc_documents.writeObject(inputData.WKXDocumentID, inputData);
};

export const WKXDocumentMetalRead = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return WKXDocumentModelPostJSONParse(await storageClient.wikiavec.wkc_documents.readObject(inputData));
};

export const WKXDocumentMetalList = async function(storageClient) {
	let outputData = await storageClient.wikiavec.wkc_documents.listObjects();

	for (let key in outputData) {
		WKXDocumentModelPostJSONParse(outputData[key]);
	}
	
	return outputData;
};

export const WKXDocumentMetalDelete = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return await storageClient.wikiavec.wkc_documents.deleteObject(inputData);
};
