import { ulid } from 'ulid';
const uniqueID = ulid();
import OLSKRemoteStorage from 'OLSKRemoteStorage';
import KVCTemplate from '../KVCTemplate/main.js';

const mod = {

	KVCNoteErrors (inputData, options = {}) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		const errors = {};

		if (typeof inputData.KVCNoteID !== 'string') {
			errors.KVCNoteID = [
				'KVCErrorNotString',
			];
		} else if (!inputData.KVCNoteID.trim()) {
			errors.KVCNoteID = [
				'KVCErrorNotFilled',
			];
		}

		if (typeof inputData.KVCNoteBody !== 'string') {
			errors.KVCNoteBody = [
				'KVCErrorNotString',
			];
		}

		if (!(inputData.KVCNoteCreationDate instanceof Date) || Number.isNaN(inputData.KVCNoteCreationDate.getTime())) {
			errors.KVCNoteCreationDate = [
				'KVCErrorNotDate',
			];
		}

		if (!(inputData.KVCNoteModificationDate instanceof Date) || Number.isNaN(inputData.KVCNoteModificationDate.getTime())) {
			errors.KVCNoteModificationDate = [
				'KVCErrorNotDate',
			];
		}

		if (inputData.KVCNoteIsArchived !== undefined) {
			if (typeof inputData.KVCNoteIsArchived !== 'boolean') {
				errors.KVCNoteIsArchived = [
					'KVCErrorNotBoolean',
				];
			}
		}

		if (inputData.KVCNoteIsPublic !== undefined) {
			if (typeof inputData.KVCNoteIsPublic !== 'boolean') {
				errors.KVCNoteIsPublic = [
					'KVCErrorNotBoolean',
				];
			}
		}

		if (typeof inputData.KVCNotePublishDate !== 'undefined') {
			if (!(inputData.KVCNotePublishDate instanceof Date) || Number.isNaN(inputData.KVCNotePublishDate.getTime())) {
				errors.KVCNotePublishDate = [
					'KVCErrorNotDate',
				];
			}
		}

		if (typeof inputData.KVCNotePublicID !== 'undefined') {
			if (typeof inputData.KVCNotePublicID !== 'string') {
				errors.KVCNotePublicID = [
					'KVCErrorNotString',
				];
			} else if (!inputData.KVCNotePublicID.trim()) {
				errors.KVCNotePublicID = [
					'KVCErrorNotFilled',
				];
			}
		}

		return Object.entries(errors).length ? errors : null;
	},

	KVCNoteIsMarkedPublic (inputData) {
		if (mod.KVCNoteErrors(inputData)) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (!inputData.KVCNoteIsPublic) {
			return false;
		}

		if (!inputData.KVCNotePublishDate) {
			return false;
		}

		if (!inputData.KVCNotePublicID) {
			return false;
		}

		return true;
	},
	
	KVCNoteDirectory () {
		return 'kvc_notes';
	},

	KVCNoteFolderPath (inputData) {
		return [
			mod.KVCNoteDirectory(),
			inputData.KVCNoteCreationDate.toJSON().split('T').shift(),
			inputData.KVCNoteID,
		].join('/') + '/';
	},

	KVCNoteObjectPath (inputData) {
		return mod.KVCNoteFolderPath(inputData) + 'main';
	},

	KVCNoteStub (inputData) {
		const groups = (inputData.match(new RegExp(`${ mod.KVCNoteDirectory() }\/(?<date>[0-9]{4}-[0-9]{2}-[0-9]{2})\/(?<item>[\\w\.]+)\/main`)) || {}).groups || {};

		return {
			KVCNoteID: groups.item,
			KVCNoteCreationDate: new Date(groups.date || Date.now()),
		};
	},

	KVCNotePublicRootPagePath () {
		return 'index.html';
	},

	KVCNotePublicChildPagePath (inputData) {
		if (mod.KVCNoteErrors(inputData)) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (!inputData.KVCNotePublicID) {
			throw new Error('KVCErrorInputNotValid');
		}

		return inputData.KVCNotePublicID;
	},

	KVCNotePublicPath (param1, param2) {
		if (mod.KVCNoteErrors(param1)) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof param2 !== 'boolean') {
			throw new Error('KVCErrorInputNotValid');
		}

		return param2 ? '/' : mod.KVCNotePublicChildPagePath(param1);
	},

};

export default Object.assign(mod, {
	ZDRSchemaKey: 'KVCNote',
	ZDRSchemaDispatchValidate: mod.KVCNoteErrors,
	ZDRSchemaPath: mod.KVCNoteObjectPath,
	ZDRSchemaStub: mod.KVCNoteStub,
	ZDRSchemaMethods: {
		
		KVCNoteCreate (inputData) {
			if (typeof inputData !== 'object' || inputData === null) {
				throw new Error('KVCErrorInputNotValid');
			}

			const KVCNoteCreationDate = new Date();

			return this.App.KVCNote.ZDRModelWriteObject(Object.assign(inputData, Object.assign({
				KVCNoteID: uniqueID(),
				KVCNoteCreationDate,
				KVCNoteModificationDate: KVCNoteCreationDate,
			}, inputData)));
		},

		KVCNoteUpdate (inputData) {
			if (typeof inputData !== 'object' || inputData === null) {
				throw new Error('KVCErrorInputNotValid');
			}

			return this.App.KVCNote.ZDRModelWriteObject(Object.assign(inputData, {
				KVCNoteModificationDate: new Date(),
			}));
		},

		async KVCNoteList () {
			const _this = this;
			return (await Promise.all((await _this.App.ZDRStoragePathsRecursive(mod.KVCNoteDirectory())).filter(function (e) {
				return e === mod.KVCNoteObjectPath(mod.KVCNoteStub(e));
			}).map(async function (e) {
				return OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(await _this.App.ZDRStorageReadObject(e));
			}))).filter(function (e) {
				return e;
			});
		},

		KVCNoteMarkPublic (inputData) {
			if (typeof inputData !== 'object' || inputData === null) {
				throw new Error('KVCErrorInputNotValid');
			}

			if (!inputData.KVCNotePublicID) {
				inputData.KVCNotePublicID = uniqueID().toLowerCase();
			}

			if (!inputData.KVCNotePublishDate) {
				inputData.KVCNotePublishDate = new Date();
			}

			return this.App.KVCNote.KVCNoteUpdate(Object.assign(inputData, {
				KVCNoteIsPublic: true,
			}));
		},

		async KVCNotePublicFilesUpload (param1, param2, param3) {
			if (!mod.KVCNoteIsMarkedPublic(param1)) {
				throw new Error('KVCErrorInputNotValid');
			}

			if (typeof param2 !== 'string') {
				throw new Error('KVCErrorInputNotValid');
			}

			if (typeof param3 !== 'boolean') {
				throw new Error('KVCErrorInputNotValid');
			}

			await this.Public.ZDRStorageWriteFile(mod.KVCNotePublicChildPagePath(param1), param2, 'text/html');
			
			if (param3) {
				await this.Public.ZDRStorageWriteFile(mod.KVCNotePublicRootPagePath(param1), param2, 'text/html');
			}

			return param1;
		},

		KVCNoteMarkNotPublic (inputData) {
			if (typeof inputData !== 'object' || inputData === null) {
				throw new Error('KVCErrorInputNotValid');
			}

			return this.App.KVCNote.KVCNoteUpdate(Object.assign(inputData, {
				KVCNoteIsPublic: false,
			}));
		},

		async KVCNotePublicFilesRetract (param1, param2) {
			if (mod.KVCNoteErrors(param1)) {
				throw new Error('KVCErrorInputNotValid');
			}

			if (typeof param2 !== 'boolean') {
				throw new Error('KVCErrorInputNotValid');
			}

			await this.Public.ZDRStorageDeleteFile(mod.KVCNotePublicChildPagePath(param1));

			if (param2) {
				await this.Public.ZDRStorageDeleteFile(mod.KVCNotePublicRootPagePath(param1));
			}

			return param1;
		},

		KVCNotePermalinkMap (param1, param2) {
			if (!Array.isArray(param1)) {
				throw new Error('KVCErrorInputNotValid');
			}

			if (typeof param2 !== 'string') {
				throw new Error('KVCErrorInputNotValid');
			}

			const _this = this;
			return Object.fromEntries(param1.filter(mod.KVCNoteIsMarkedPublic).map(function (e) {
				return [KVCTemplate.KVCTemplatePlaintextTitle(e.KVCNoteBody), _this.Public.ZDRStoragePermalink(e.KVCNoteID === param2 ? mod.KVCNotePublicRootPagePath(e) : mod.KVCNotePublicChildPagePath(e))];
			}));
		},

		async KVCNoteDelete (inputData) {
			if (typeof inputData !== 'object' || inputData === null) {
				throw new Error('KVCErrorInputNotValid');
			}

			if (mod.KVCNoteErrors(inputData)) {
				throw new Error('KVCErrorInputNotValid');
			}

			if (inputData.KVCNotePublicID) {
				await this.Public.ZDRStorageDeleteFile(mod.KVCNotePublicChildPagePath(inputData));
			}

			await this.App.ZDRStorageDeleteFolderRecursive(mod.KVCNoteFolderPath(inputData));

			return inputData;
		},

	},
});
