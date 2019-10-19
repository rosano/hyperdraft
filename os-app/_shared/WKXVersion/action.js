import * as WKXVersionMetal from './metal.js';
import { factory, detectPrng } from 'ulid';
const uniqueID = typeof require === 'undefined' && navigator.appName === 'Zombie' ? factory(detectPrng(true)) : factory();

export const WKXVersionActionCreate = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return await WKXVersionMetal.WKXVersionMetalWrite(storageClient, Object.assign(inputData, {
		WKXVersionID: uniqueID(),
	}));
};

export const WKXVersionActionDelete = async function(storageClient, inputData) {
	return await WKXVersionMetal.WKXVersionMetalDelete(storageClient, inputData);
};

export const WKXVersionActionQuery = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return Promise.resolve(Object.values(await WKXVersionMetal.WKXVersionMetalList(storageClient)).sort(function (a, b) {
		return b.WKXVersionDate - a.WKXVersionDate;
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

