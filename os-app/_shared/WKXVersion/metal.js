import { WKXVersionModelErrorsFor, WKXVersionModelPostJSONParse } from './model.js';

export const WKXVersionMetalWrite = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	let errors = WKXVersionModelErrorsFor(inputData);
	if (errors) {
		return Promise.resolve({
			WKCErrors: errors,
		});
	}

	return await storageClient.wikiavec.wkc_versions.writeObject(inputData.WKXVersionID, inputData);
};

export const WKXVersionMetalRead = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return WKXVersionModelPostJSONParse(await storageClient.wikiavec.wkc_versions.readObject(inputData));
};

export const WKXVersionMetalList = async function(storageClient) {
	let outputData = await storageClient.wikiavec.wkc_versions.listObjects();

	for (let key in outputData) {
		WKXVersionModelPostJSONParse(outputData[key]);
	}
	
	return outputData;
};

export const WKXVersionMetalDelete = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return await storageClient.wikiavec.wkc_versions.deleteObject(inputData);
};
