import * as WKCVersionsModel from './model.js';

export const WKCVersionsMetalWrite = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
	}

	let errors = WKCVersionsModel.WKCVersionsModelErrorsFor(inputData);
	if (errors) {
		return Promise.resolve({
			WKCErrors: errors,
		});
	}

	return await storageClient.wkc_versions.writeObject(inputData.WKCVersionID, inputData);
};

export const WKCVersionsMetalRead = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
	}

	return WKCVersionsModel.WKCVersionsModelPostJSONParse(await storageClient.wkc_versions.readObject(inputData));
};

export const WKCVersionsMetalList = async function(storageClient) {
	let outputData = await storageClient.wkc_versions.listObjects();

	for (let key in outputData) {
		WKCVersionsModel.WKCVersionsModelPostJSONParse(outputData[key]);
	}
	
	return outputData;
};

export const WKCVersionsMetalDelete = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
	}

	return await storageClient.wkc_versions.deleteObject(inputData);
};
