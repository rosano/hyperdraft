const { rejects, throws, deepEqual, strictEqual, notStrictEqual } = require('assert');

const mod = require('./main.js').default;

const OLSKObject = require('OLSKObject').default;

describe('KVCNoteErrors', function test_KVCNoteErrors() {

	it('throws error if not object', function() {
		throws(function() {
			mod.KVCNoteErrors(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns object if KVCNoteID not string', function() {
		deepEqual(mod.KVCNoteErrors(StubNoteObjectValid({
			KVCNoteID: null,
		})), {
			KVCNoteID: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns object if KVCNoteID not filled', function() {
		deepEqual(mod.KVCNoteErrors(StubNoteObjectValid({
			KVCNoteID: ' ',
		})), {
			KVCNoteID: [
				'KVCErrorNotFilled',
			],
		});
	});

	it('returns object if KVCNoteBody not string', function() {
		deepEqual(mod.KVCNoteErrors(StubNoteObjectValid({
			KVCNoteBody: null,
		})), {
			KVCNoteBody: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns object if KVCNoteCreationDate not date', function() {
		deepEqual(mod.KVCNoteErrors(StubNoteObjectValid({
			KVCNoteCreationDate: new Date('alfa'),
		})), {
			KVCNoteCreationDate: [
				'KVCErrorNotDate',
			],
		});
	});

	it('returns object if KVCNoteModificationDate not date', function() {
		deepEqual(mod.KVCNoteErrors(StubNoteObjectValid({
			KVCNoteModificationDate: new Date('alfa'),
		})), {
			KVCNoteModificationDate: [
				'KVCErrorNotDate',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mod.KVCNoteErrors(StubNoteObjectValid()), null);
	});

	context('KVCNoteIsArchived', function () {

		it('returns object if not boolean', function () {
			deepEqual(mod.KVCNoteErrors(StubNoteObjectValid({
				KVCNoteIsArchived: null,
			})), {
				KVCNoteIsArchived: [
					'KVCErrorNotBoolean',
				],
			});
		});

		it('returns null', function () {
			deepEqual(mod.KVCNoteErrors(StubNoteObjectValid({
				KVCNoteIsArchived: true,
			})), null);
		});

	});

	context('KVCNoteIsPublic', function () {

		it('returns object if not boolean', function () {
			deepEqual(mod.KVCNoteErrors(StubNoteObjectValid({
				KVCNoteIsPublic: null,
			})), {
				KVCNoteIsPublic: [
					'KVCErrorNotBoolean',
				],
			});
		});

		it('returns null', function () {
			deepEqual(mod.KVCNoteErrors(StubNoteObjectValid({
				KVCNoteIsPublic: true,
			})), null);
		});

	});

	context('KVCNotePublishDate', function() {

		it('returns object if date', function() {
			deepEqual(mod.KVCNoteErrors(StubNoteObjectValid({
				KVCNotePublishDate: new Date('alfa'),
			})), {
				KVCNotePublishDate: [
					'KVCErrorNotDate',
				],
			});
		});

		it('returns null', function() {
			deepEqual(mod.KVCNoteErrors(StubNoteObjectValid({
				KVCNotePublishDate: new Date(),
			})), null);
		});

	});

	context('KVCNotePublicID', function() {

		it('returns object if string', function() {
			deepEqual(mod.KVCNoteErrors(StubNoteObjectValid({
				KVCNotePublicID: null,
			})), {
				KVCNotePublicID: [
					'KVCErrorNotString',
				],
			});
		});

		it('returns object if filled', function() {
			deepEqual(mod.KVCNoteErrors(StubNoteObjectValid({
				KVCNotePublicID: ' ',
			})), {
				KVCNotePublicID: [
					'KVCErrorNotFilled',
				],
			});
		});

		it('returns null', function() {
			deepEqual(mod.KVCNoteErrors(StubNoteObjectValid({
				KVCNotePublicID: 'alfa',
			})), null);
		});

	});

});

describe('KVCNoteIsMarkedPublic', function test_KVCNoteIsMarkedPublic() {

	it('throws error if not valid', function() {
		throws(function() {
			mod.KVCNoteIsMarkedPublic({});
		}, /KVCErrorInputNotValid/);
	});

	it('returns false if KVCNoteIsPublic not true', function() {
		deepEqual(mod.KVCNoteIsMarkedPublic(StubNoteObjectPublic({
			KVCNoteIsPublic: false,
		})), false);
	});

	it('returns false if no KVCNotePublishDate', function() {
		deepEqual(mod.KVCNoteIsMarkedPublic(StubNoteObjectPublic({
			KVCNotePublishDate: undefined,
		})), false);
	});

	it('returns false if no KVCNotePublicID', function() {
		deepEqual(mod.KVCNoteIsMarkedPublic(StubNoteObjectPublic({
			KVCNotePublicID: undefined,
		})), false);
	});

	it('returns true', function() {
		deepEqual(mod.KVCNoteIsMarkedPublic(StubNoteObjectPublic()), true);
	});

});


describe('KVCNoteDirectory', function test_KVCNoteDirectory() {

	it('returns string', function() {
		deepEqual(mod.KVCNoteDirectory(), 'kvc_notes');
	});

});

describe('KVCNoteFolderPath', function test_KVCNoteFolderPath() {

	it('returns string', function() {
		const item = StubNoteObjectValid();
		deepEqual(mod.KVCNoteFolderPath(item), [
			mod.KVCNoteDirectory(),
			item.KVCNoteCreationDate.toJSON().split('T').shift(),
			item.KVCNoteID,
			].join('/') + '/');
	});

});

describe('KVCNoteObjectPath', function test_KVCNoteObjectPath() {

	it('returns string', function () {
		const item = StubNoteObjectValid();
		deepEqual(mod.KVCNoteObjectPath(item), mod.KVCNoteFolderPath(item) + 'main');
	});

});

describe('KVCNoteStub', function test_KVCNoteStub() {

	it('returns string', function() {
		const item = StubNoteObjectValid({
			KVCNoteCreationDate: new Date((new Date()).toJSON().slice(0, 10)),
		});
		deepEqual(mod.KVCNoteStub([
			mod.KVCNoteDirectory(),
			item.KVCNoteCreationDate.toJSON().slice(0, 10),
			item.KVCNoteID,
			'main',
			].join('/')), {
			KVCNoteID: item.KVCNoteID,
			KVCNoteCreationDate: item.KVCNoteCreationDate,
		});
	});

});

describe('KVCNotePublicRootPagePath', function test_KVCNotePublicRootPagePath() {

	it('returns string', function() {
		deepEqual(mod.KVCNotePublicRootPagePath(), 'index.html');
	});

});

describe('KVCNotePublicChildPagePath', function test_KVCNotePublicChildPagePath() {

	it('throws if not valid', function() {
		throws(function() {
			mod.KVCNotePublicChildPagePath({});
		}, /KVCErrorInputNotValid/);
	});

	it('throws if no KVCNotePublicID', function() {
		throws(function() {
			mod.KVCNotePublicChildPagePath(StubNoteObjectValid());
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const KVCNotePublicID = Math.random().toString();
		deepEqual(mod.KVCNotePublicChildPagePath(StubNoteObjectValid({
			KVCNotePublicID,
		})), KVCNotePublicID);
	});

});

describe('KVCNoteActionPublishPath', function test_KVCNoteActionPublishPath() {

	const item = StubNoteObjectValid({
		KVCNotePublicID: 'charlie',
	});

	it('throws if param1 not valid', function() {
		throws(function() {
			mod.KVCNoteActionPublishPath({}, false);
		}, /KVCErrorInputNotValid/);
	});

	it('throws if param2 not boolean', function() {
		throws(function() {
			mod.KVCNoteActionPublishPath(item, 'true');
		}, /KVCErrorInputNotValid/);
	});

	it('returns KVCNoteStoragePublicObjectPath', function() {
		deepEqual(mod.KVCNoteActionPublishPath(item, false), mod.KVCNotePublicChildPagePath(item));
	});

	it('returns KVCNoteStoragePublicRootPagePath if param2 true', function() {
		deepEqual(mod.KVCNoteActionPublishPath(item, true), mod.KVCNotePublicRootPagePath());
	});

});

describe('KVCNoteActionPublicPath', function test_KVCNoteActionPublicPath() {

	const item = StubNoteObjectValid({
		KVCNotePublicID: 'charlie',
	});

	it('throws if param1 not valid', function() {
		throws(function() {
			mod.KVCNoteActionPublicPath({}, false);
		}, /KVCErrorInputNotValid/);
	});

	it('throws if param2 not boolean', function() {
		throws(function() {
			mod.KVCNoteActionPublicPath(item, 'true');
		}, /KVCErrorInputNotValid/);
	});

	it('returns KVCNoteStoragePublicObjectPath', function() {
		deepEqual(mod.KVCNoteActionPublicPath(item, false), mod.KVCNotePublicChildPagePath(item));
	});

	it('returns / if param2 true', function() {
		deepEqual(mod.KVCNoteActionPublicPath(item, true), '/');
	});

});

describe('KVCNoteCreate', function test_KVCNoteCreate() {

	it('throws if not object', function () {
		throws(function () {
			ZDRTestingWrap.App.KVCNote.KVCNoteCreate(null)
		}, /KVCErrorInputNotValid/);
	});

	it('rejects with errors if not valid', async function() {
		await rejects(ZDRTestingWrap.App.KVCNote.KVCNoteCreate(StubNoteObject({
			KVCNoteBody: null,
		})), {
			KVCNoteBody: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns inputData', async function() {
		const item = StubNoteObjectValid();
		strictEqual(await ZDRTestingWrap.App.KVCNote.KVCNoteCreate(item), item);
	});

	it('sets KVCNoteID to unique value', async function() {
		const items = await uSerial(Array.from(Array(10)).map(async function (e) {
			return (await ZDRTestingWrap.App.KVCNote.KVCNoteCreate(StubNoteObject())).KVCNoteID;
		}));
		deepEqual([...(new Set(items))], items);
	});

	it('sets KVCNoteCreationDate', async function() {
		deepEqual(new Date() - (await ZDRTestingWrap.App.KVCNote.KVCNoteCreate(StubNoteObject())).KVCNoteCreationDate < 100, true);
	});

	it('sets KVCNoteModificationDate', async function() {
		deepEqual(new Date() - (await ZDRTestingWrap.App.KVCNote.KVCNoteCreate(StubNoteObject())).KVCNoteModificationDate < 100, true);
	});

	it('allows overwrite by input', async function() {
		const item = StubNoteObjectValid();
		deepEqual(await ZDRTestingWrap.App.KVCNote.KVCNoteCreate(Object.assign({}, item)), item);
	});

});

describe('KVCNoteUpdate', function test_KVCNoteUpdate() {

	it('throws if not object', function () {
		throws(function () {
			ZDRTestingWrap.App.KVCNote.KVCNoteUpdate(null)
		}, /KVCErrorInputNotValid/);
	});

	it('rejects with errors if not valid', async function() {
		await rejects(ZDRTestingWrap.App.KVCNote.KVCNoteUpdate(Object.assign(await ZDRTestingWrap.App.KVCNote.KVCNoteCreate(StubNoteObject()), {
			KVCNoteID: null,
		})), {
			KVCNoteID: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns inputData', async function() {
		const item = await ZDRTestingWrap.App.KVCNote.KVCNoteCreate(StubNoteObject());
		strictEqual(await ZDRTestingWrap.App.KVCNote.KVCNoteUpdate(item), item);
	});

	it('sets KVCNoteModificationDate', async function() {
		const item = await ZDRTestingWrap.App.KVCNote.KVCNoteCreate(StubNoteObject());
		const date = item.KVCNoteModificationDate;

		await ZDRTestingWrap.App.KVCNote.KVCNoteUpdate(item);
		
		notStrictEqual(item.KVCNoteModificationDate, date);
		deepEqual(new Date() - item.KVCNoteModificationDate < 100, true);
	});

	it('writes inputData if not found', async function() {
		const item = await ZDRTestingWrap.App.KVCNote.KVCNoteUpdate(StubNoteObjectValid());
		deepEqual(await ZDRTestingWrap.App.KVCNote.KVCNoteList(), [item]);
	});

});

describe('KVCNoteList', function test_KVCNoteList() {

	it('returns array', async function() {
		deepEqual(await ZDRTestingWrap.App.KVCNote.KVCNoteList(), []);
	});

	it('returns array with existing items', async function() {
		const item = await ZDRTestingWrap.App.KVCNote.KVCNoteCreate(StubNoteObjectValid());

		deepEqual(await ZDRTestingWrap.App.KVCNote.KVCNoteList(), [item]);
	});

});

describe('KVCNoteMarkPublic', function test_KVCNoteMarkPublic() {

	it('throws if not object', function () {
		throws(function () {
			ZDRTestingWrap.App.KVCNote.KVCNoteMarkPublic(null)
		}, /KVCErrorInputNotValid/);
	});

	it('rejects with errors if not valid', async function() {
		await rejects(ZDRTestingWrap.App.KVCNote.KVCNoteMarkPublic(StubNoteObjectValid({
			KVCNoteID: null,
		})), {
			KVCNoteID: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns inputData', async function() {
		const item = StubNoteObjectValid();
		strictEqual(await ZDRTestingWrap.App.KVCNote.KVCNoteMarkPublic(item), item);
	});

	it('sets KVCNoteIsPublic', async function() {
		deepEqual((await ZDRTestingWrap.App.KVCNote.KVCNoteMarkPublic(StubNoteObjectValid())).KVCNoteIsPublic, true);
	});

	it('sets KVCNotePublishDate', async function() {
		deepEqual(new Date() - (await ZDRTestingWrap.App.KVCNote.KVCNoteMarkPublic(StubNoteObjectValid())).KVCNotePublishDate < 100, true);
	});

	it('sets KVCNotePublicID to string', async function() {
		deepEqual(typeof ((await ZDRTestingWrap.App.KVCNote.KVCNoteMarkPublic(StubNoteObjectValid()))).KVCNotePublicID, 'string');
	});

	it('sets KVCNotePublicID to lowercase', async function() {
		const item = (await ZDRTestingWrap.App.KVCNote.KVCNoteMarkPublic(StubNoteObjectValid())).KVCNotePublicID;
		deepEqual(item, item.toLowerCase());
	});

	it('sets KVCNotePublicID', async function() {
		const items = await uSerial(Array.from(Array(10)).map(async function (e) {
			return (await ZDRTestingWrap.App.KVCNote.KVCNoteMarkPublic(StubNoteObjectValid())).KVCNotePublicID;
		}));
		deepEqual([...(new Set(items))], items);
	});

	it('maintains KVCNotePublishDate', async function() {
		const item = StubNoteObjectPublic();
		const date = item.KVCNotePublishDate;

		strictEqual((await ZDRTestingWrap.App.KVCNote.KVCNoteMarkPublic(item)).KVCNotePublishDate, date);
	});

	it('maintains KVCNotePublicID', async function() {
		const item = StubNoteObjectPublic();
		const id = item.KVCNotePublicID;
		strictEqual((await ZDRTestingWrap.App.KVCNote.KVCNoteMarkPublic(item)).KVCNotePublicID, id);
	});

});

describe('KVCNotePublicFilesUpload', function test_KVCNotePublicFilesUpload() {

	it('rejects if param1 not valid', async function () {
		await rejects(ZDRTestingWrap.App.KVCNote.KVCNotePublicFilesUpload(StubNoteObjectValid(), Math.random().toString(), uRandomElement(true, false)), /KVCErrorInputNotValid/);
	});

	it('rejects if param2 not string', async function () {
		await rejects(ZDRTestingWrap.App.KVCNote.KVCNotePublicFilesUpload(StubNoteObjectPublic(), null), /KVCErrorInputNotValid/);
	});

	it('rejects if param3 not boolean', async function () {
		await rejects(ZDRTestingWrap.App.KVCNote.KVCNotePublicFilesUpload(StubNoteObjectPublic(), Math.random().toString(), null), /KVCErrorInputNotValid/);
	});

	it('returns param1', async function() {
		const item = StubNoteObjectPublic();
		strictEqual(await ZDRTestingWrap.App.KVCNote.KVCNotePublicFilesUpload(item, Math.random().toString(), uRandomElement(true, false)), item);
	});

	it('writes to public folder', async function() {
		const item = StubNoteObjectPublic();
		const content = Math.random().toString();
		const root = uRandomElement(true, false);

		await ZDRTestingWrap.App.KVCNote.KVCNotePublicFilesUpload(item, content, root);

		deepEqual(await ZDRTestingWrap.Public.ZDRStorageReadFile(mod.KVCNotePublicChildPagePath(item)), content);
		deepEqual(await ZDRTestingWrap.Public.ZDRStorageReadFile(mod.KVCNotePublicRootPagePath(item)), root ? content : undefined);
	});

});

describe('KVCNoteMarkNotPublic', function test_KVCNoteMarkNotPublic() {

	it('throws if not object', function () {
		throws(function () {
			ZDRTestingWrap.App.KVCNote.KVCNoteMarkNotPublic(null)
		}, /KVCErrorInputNotValid/);
	});

	it('rejects with errors if not valid', async function() {
		await rejects(ZDRTestingWrap.App.KVCNote.KVCNoteMarkNotPublic(StubNoteObjectValid({
			KVCNoteID: null,
		})), {
			KVCNoteID: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns inputData', async function() {
		const item = StubNoteObjectValid();
		strictEqual(await ZDRTestingWrap.App.KVCNote.KVCNoteMarkNotPublic(item), item);
	});

	it('sets KVCNoteIsPublic', async function() {
		deepEqual((await ZDRTestingWrap.App.KVCNote.KVCNoteMarkNotPublic(StubNoteObjectValid())).KVCNoteIsPublic, false);
	});

});

describe('KVCNotePublicFilesRetract', function test_KVCNotePublicFilesRetract() {

	it('rejects if param1 not valid', async function () {
		await rejects(ZDRTestingWrap.App.KVCNote.KVCNotePublicFilesRetract(StubNoteObjectValid(), uRandomElement(true, false)), /KVCErrorInputNotValid/);
	});

	it('rejects if param1 not valid', async function () {
		await rejects(ZDRTestingWrap.App.KVCNote.KVCNotePublicFilesRetract({}), /KVCErrorInputNotValid/);
	});

	it('rejects if param2 not boolean', async function () {
		await rejects(ZDRTestingWrap.App.KVCNote.KVCNotePublicFilesRetract(StubNoteObjectPublic(), null), /KVCErrorInputNotValid/);
	});

	it('returns param1', async function() {
		const item = StubNoteObjectPublic();
		strictEqual(await ZDRTestingWrap.App.KVCNote.KVCNotePublicFilesRetract(await ZDRTestingWrap.App.KVCNote.KVCNotePublicFilesUpload(item, Math.random().toString(), uRandomElement(true, false)), uRandomElement(true, false)), item);
	});

	it('deletes from public folder', async function() {
		const item = StubNoteObjectPublic();
		const root = uRandomElement(true, false);

		await ZDRTestingWrap.App.KVCNote.KVCNotePublicFilesUpload(item, Math.random().toString(), root);
		await ZDRTestingWrap.App.KVCNote.KVCNotePublicFilesRetract(item, root);

		deepEqual(await ZDRTestingWrap.Public.ZDRStorageReadFile(mod.KVCNotePublicChildPagePath(item)), undefined);
		deepEqual(await ZDRTestingWrap.Public.ZDRStorageReadFile(mod.KVCNotePublicRootPagePath(item)), undefined);
	});

});

describe('KVCNotePermalinkMap', function test_KVCNotePermalinkMap() {

	it('rejects if param1 not array', async function () {
		await rejects(ZDRTestingWrap.App.KVCNote.KVCNotePermalinkMap(null, Math.random().toString()), /KVCErrorInputNotValid/);
	});

	it('rejects if param2 not string', async function () {
		await rejects(ZDRTestingWrap.App.KVCNote.KVCNotePermalinkMap([], null), /KVCErrorInputNotValid/);
	});

	it('returns object', async function() {
		deepEqual(await ZDRTestingWrap.App.KVCNote.KVCNotePermalinkMap([], Math.random().toString()), {});
	});

	it('excludes if not public', async function() {
		deepEqual(await ZDRTestingWrap.App.KVCNote.KVCNotePermalinkMap([StubNoteObjectValid()], Math.random().toString()), {});
	});

	it('includes if public', async function() {
		const item = StubNoteObjectPublic();
		deepEqual(await ZDRTestingWrap.App.KVCNote.KVCNotePermalinkMap([item], Math.random().toString()), {
			[item.KVCNoteBody]: await ZDRTestingWrap.Public.ZDRStorageURL(mod.KVCNotePublicChildPagePath(item)),
		});
	});

	it('selects last updated note if duplicate title', async function() {
		const KVCNoteBody = Math.random().toString();
		const item = StubNoteObjectPublic({
			KVCNoteBody,
		});
		deepEqual(await ZDRTestingWrap.App.KVCNote.KVCNotePermalinkMap([item, StubNoteObjectPublic({
			KVCNoteBody,
		})], Math.random().toString()), {
			[item.KVCNoteBody]: await ZDRTestingWrap.Public.ZDRStorageURL(mod.KVCNotePublicChildPagePath(item)),
		});
	});

	it('links to KVCNotePublicRootPagePath if KVCNoteID param1', async function() {
		const KVCNoteID = Math.random().toString();
		const item = StubNoteObjectPublic({
			KVCNoteID,
		});
		deepEqual(await ZDRTestingWrap.App.KVCNote.KVCNotePermalinkMap([item], KVCNoteID), {
			[item.KVCNoteBody]: await ZDRTestingWrap.Public.ZDRStorageURL(mod.KVCNotePublicRootPagePath(item)),
		});
	});

});

describe('KVCNoteDelete', function test_KVCNoteDelete() {

	it('rejects if not valid', async function () {
		await rejects(ZDRTestingWrap.App.KVCNote.KVCNoteDelete({}), /KVCErrorInputNotValid/);
	});

	it('returns inputData', async function () {
		const item = await ZDRTestingWrap.App.KVCNote.KVCNoteCreate(StubNoteObject());
		strictEqual(await ZDRTestingWrap.App.KVCNote.KVCNoteDelete(item), item);
	});

	it('deletes KVCNote', async function () {
		await ZDRTestingWrap.App.KVCNote.KVCNoteDelete(await ZDRTestingWrap.App.KVCNote.KVCNoteCreate(StubNoteObject()))
		deepEqual(await ZDRTestingWrap.App.KVCNote.KVCNoteList(), []);
	});

	it('deletes KVCNoteFolder recursively', async function () {
		const item = await ZDRTestingWrap.App.KVCNote.KVCNoteCreate(StubNoteObject());

		await ZDRTestingWrap.App.ZDRStorageWriteObject(mod.KVCNoteFolderPath(item) + Math.random().toString() + '/' + Math.random().toString(), {
			[Math.random().toString()]: Math.random().toString(),
		});

		await ZDRTestingWrap.App.KVCNote.KVCNoteDelete(item);

		deepEqual(await ZDRTestingWrap.App.ZDRStoragePathsRecursive(mod.KVCNoteFolderPath(item)), []);
	});

	it('deletes public file', async function() {
		const item = await ZDRTestingWrap.App.KVCNote.KVCNoteCreate(StubNoteObject({
			KVCNotePublicID: Math.random().toString(),
		}));

		await ZDRTestingWrap.Public.ZDRStorageWriteFile(mod.KVCNotePublicChildPagePath(item), Math.random().toString(), 'text/html');

		await ZDRTestingWrap.App.KVCNote.KVCNoteDelete(item);

		deepEqual(await ZDRTestingWrap.Public.ZDRStorageReadFile(mod.KVCNotePublicChildPagePath(item)), undefined);
	});

});

describe('ZDRSchemaDispatchValidate', function () {

	it('returns function', function () {
		deepEqual(mod.ZDRSchemaDispatchValidate, mod.KVCNoteErrors);
	});

});

describe('ZDRSchemaPath', function () {

	it('returns function', function() {
		deepEqual(mod.ZDRSchemaPath, mod.KVCNoteObjectPath);
	});

});

describe('ZDRSchemaStub', function () {

	it('returns function', function() {
		deepEqual(mod.ZDRSchemaStub, mod.KVCNoteStub);
	});

});
