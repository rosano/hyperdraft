const WKCVersionsMetal = typeof require === 'undefined' ? window.WKCVersionsMetal : require('./metal.js');
import * as ULIDPackage from 'ulid';

export const WKCVersionsActionCreate = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
	}

	return await WKCVersionsMetal.WKCVersionsMetalWrite(storageClient, Object.assign(inputData, {
		WKCVersionID: ULIDPackage.ulid(),
	}));
};

export const WKCVersionsActionDelete = async function(storageClient, inputData) {
	return await WKCVersionsMetal.WKCVersionsMetalDelete(storageClient, inputData);
};

export const WKCVersionsActionQuery = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
	}

	return Promise.resolve(Object.values(await WKCVersionsMetal.WKCVersionsMetalList(storageClient)).sort(function (a, b) {
		return b.WKCVersionDate - a.WKCVersionDate;
	}).filter(function(e) {
		if (!Object.keys(inputData).length) {
			return true;
		}

		if (Object.keys(inputData).filter(function (key) {
			return e[key].match(inputData[key]);
		}).length) {
			return true;
		}

		return false;
	}));
};
