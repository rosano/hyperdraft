(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.RSPHomeBehaviour = global.RSPHomeBehaviour || {})));
}(this, (function (exports) { 'use strict';

	let moi = {};

	let storageClient;

	//# PROPERTIES

	//_ propertiesViewItems

	let propertiesViewItems = function (inputData) {
		if (typeof inputData === 'undefined') {
			return d3.selectAll('.RSProofListItem').data();
		}

		reactItems(inputData);
	};

	//# INTERFACE

	//_ interfaceCreateButtonDidClick

	moi.interfaceCreateButtonDidClick = function () {
		moi.goItemsCreate();
	};

	//# COMMANDS

	//_ goItemsCreate

	moi.goItemsCreate = async function () {
		propertiesViewItems(propertiesViewItems().concat(await RSNotesAction.RSNotesActionCreate(storageClient, {
			RSNoteBody: 'alfa',
		})));
	};

	//_ goItemsRead

	moi.goItemsRead = async function (inputData, parentElement) {
		d3.select(parentElement).select('.RSProofListItemJSON')
			.html(JSON.stringify(await RSNotesMetal.RSNotesMetalRead(storageClient, inputData.RSNoteID)))
	};

	//_ goItemsUpdate

	moi.goItemsUpdate = async function (inputData) {
		await RSNotesAction.RSNotesActionUpdate(storageClient, Object.assign(inputData, {
			RSNoteBody: `${ inputData.RSNoteBody }-${ inputData.RSNoteBody.length }`,
		}));

		propertiesViewItems(propertiesViewItems());
	};

	//_ goItemsDelete

	moi.goItemsDelete = async function (inputData) {
		await RSNotesMetal.RSNotesMetalDelete(storageClient, inputData.RSNoteID);

		propertiesViewItems(propertiesViewItems().filter(function (e) {
			return e !== inputData;
		}));
	};

	//# REACT

	//_ reactItems

	let reactItems = function (inputData) {
		let selection = d3.select('#RSProofList').selectAll('.RSProofListItem').data(inputData);

		let parentElement = selection.enter().append('li')
			.attr('class', 'RSProofListItem');

		parentElement.append('button')
			.attr('class', 'RSProofListItemReadButton')
			.html('Read');

		parentElement.append('button')
			.attr('class', 'RSProofListItemUpdateButton')
			.html('Update');

		parentElement.append('button')
			.attr('class', 'RSProofListItemDeleteButton')
			.html('Delete');

		parentElement.append('span')
			.attr('class', 'RSProofListItemContent');

		parentElement.append('code')
			.attr('class', 'RSProofListItemJSON');

		parentElement = parentElement.merge(selection);

		parentElement.select('.RSProofListItemContent')
			.html(function (obj) {
			return `${ obj.RSNoteID } ${ obj.RSNoteBody }`;
		});

		parentElement.select('.RSProofListItemReadButton')
			.on('click', function (obj) {
				moi.goItemsRead(obj, this.parentElement);
			});

		parentElement.select('.RSProofListItemUpdateButton')
			.on('click', function (obj) {
				moi.goItemsUpdate(obj);
			});

		parentElement.select('.RSProofListItemDeleteButton')
			.on('click', function (obj) {
				moi.goItemsDelete(obj);
			});

		selection.exit().remove();

	};

	//# SETUP

	//_ setupEverything

	let setupEverything = function () {
		setupStorageClient();
	};

	//_ setupStorageClient

	let setupStorageClient = function () {
		storageClient = RSStorageClient.RSStorageClientForChangeDelegateMap({
			rsp_notes: {
				RSChangeDelegateAdd: function (inputData) {
					return propertiesViewItems(propertiesViewItems().concat(inputData));
				},
				RSChangeDelegateRemove: function (inputData) {
					propertiesViewItems(propertiesViewItems().filter(function (e) {
						return e.RSNoteID !== inputData.RSNoteID;
					}))
				},
				RSChangeDelegateUpdate: function (inputData) {
					propertiesViewItems(propertiesViewItems().map(function (e) {
						return Object.assign(e, e.RSNoteID === inputData.RSNoteID ? inputData : {});
					}));
				},
			},
		});

		let remoteStorage = storageClient.remoteStorage;

		const widget = new Widget(remoteStorage);
		widget.attach('RSProofConnectWidget');

		remoteStorage.on('ready', async () => {
			console.debug('ready');

			await remoteStorage.rsp_notes.init();
		});

		remoteStorage.on('not-connected', (a, b, c) => {
			console.debug(`not-connected`, a, b, c);
		});

		remoteStorage.on('disconnected', (a, b, c) => {
			console.debug(`disconnected`, a, b, c);
		});

		remoteStorage.on('error', (a, b, c) => {
			console.debug(`error`, a, b, c);
		});

		remoteStorage.on('connected', () => {
			// console.log(remoteStorage.remote.token);
			console.debug('connected', remoteStorage.remote.userAddress);
		});

		remoteStorage.on('network-offline', () => {
			console.debug('network-offline');
		});

		remoteStorage.on('network-online', () => {
			console.debug('network-online');
		});

		remoteStorage.on('sync-done', () => {
			console.debug('sync-done');
		});
	};

	//# LIFECYCLE

	//_ lifecyclePageWillLoad

	moi.lifecyclePageWillLoad = function () {
		setupEverything();
	};

	Object.assign(exports, moi);

	Object.defineProperty(exports, '__esModule', { value: true });

})));
