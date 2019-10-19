import * as WKCVersionMetal from './metal.js';
import { factory, detectPrng } from 'ulid';
const uniqueID = typeof require === 'undefined' && navigator.appName === 'Zombie' ? factory(detectPrng(true)) : factory();

export const WKCVersionActionCreate = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return await WKCVersionMetal.WKCVersionMetalWrite(storageClient, Object.assign(inputData, {
		WKCVersionID: uniqueID(),
	}));
};

export const WKCVersionActionDelete = async function(storageClient, inputData) {
	return await WKCVersionMetal.WKCVersionMetalDelete(storageClient, inputData);
};

export const WKCVersionActionQuery = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return Promise.resolve(Object.values(await WKCVersionMetal.WKCVersionMetalList(storageClient)).sort(function (a, b) {
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

