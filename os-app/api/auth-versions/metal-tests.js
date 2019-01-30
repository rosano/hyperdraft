/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var mainModule = require('./metal');

const kTesting = {
	kTestingValidVersion: function() {
		return {
			WKCVersionNoteID: 'alfa',
			WKCVersionBody: 'bravo',
			WKCVersionDate: new Date('2019-01-30T18:10:00.000Z'),
		};
	},
};

describe('WKCVersionsMetalCreate', function testWKCVersionsMetalCreate() {

	it('throws error if not object', function() {
		assert.rejects(mainModule.WKCVersionsMetalCreate(WKCTestingMongoClient, null), /WKCErrorInvalidInput/);
	});

	it('returns inputData if not valid', async function() {
		assert.deepEqual((await mainModule.WKCVersionsMetalCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidVersion(), {
			WKCVersionBody: null,
		}))).WKCErrors, {
			WKCVersionBody: [
				'WKCErrorNotString',
			],
		})
	});

	it('returns object', async function() {
		let responseJSON = await mainModule.WKCVersionsMetalCreate(WKCTestingMongoClient, kTesting.kTestingValidVersion());
		
		assert.deepEqual(responseJSON, Object.assign(kTesting.kTestingValidVersion(), {
			WKCVersionID: responseJSON.WKCVersionID,
		}));
		assert.strictEqual(parseInt(responseJSON.WKCVersionID) - (new Date()) > -500, true);
	});

});
