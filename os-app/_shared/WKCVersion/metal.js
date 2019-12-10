import { WKCVersionModelErrorsFor, WKCVersionModelPostJSONParse } from './model.js';

export const WKCVersionMetalWrite = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	let errors = WKCVersionModelErrorsFor(inputData);
	if (errors) {
		return Promise.resolve({
			KVCErrors: errors,
		});
	}

	return await storageClient.wikiavec.kvc_versions.writeObject(inputData.WKCVersionID, inputData);
};

export const WKCVersionMetalRead = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	return WKCVersionModelPostJSONParse(await storageClient.wikiavec.kvc_versions.readObject(inputData));
};

export const WKCVersionMetalList = async function(storageClient) {
	let outputData = await storageClient.wikiavec.kvc_versions.listObjects();

	for (let key in outputData) {
		WKCVersionModelPostJSONParse(outputData[key]);
	}
	
	return outputData;
};

export const WKCVersionMetalDelete = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	return await storageClient.wikiavec.kvc_versions.deleteObject(inputData);
};
