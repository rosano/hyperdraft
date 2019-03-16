(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCWriteBehaviour = global.WKCWriteBehaviour || {})));
}(this, (function (exports) { 'use strict';

	let moi = {};

	let storageClient;

	let WCKWriteBehaviourPropertyNoteObjects;
	let WCKWriteBehaviourPropertyCurrentFilter;
	let WCKWriteBehaviourPropertySelectedNote;
	let WCKWriteBehaviourPropertyEditor;
	let WCKWriteBehaviourPropertyNotesThrottleMap = {};

	//# CONSTANTS

	//_ kDefaultFocusNode

	moi.kDefaultFocusNode = function () {
		return document.getElementById('WKCWriteMasterToolbarFilterInput');
	};

	//# DATA

	//_ dataNoteObjectsFiltered

	moi.dataNoteObjectsFiltered = function () {
		if (!moi.propertiesCurrentFilter()) {
			return moi.propertiesNoteObjects();
		}

		return moi.propertiesNoteObjects().filter(function (e) {
			return e.WKCNoteBody.toLowerCase().match(moi.propertiesCurrentFilter().toLowerCase());
		});
	};

	//_ dataNoteObjectPreparedFor

	moi.dataNoteObjectPreparedFor = function (inputData) {
		return Object.assign(inputData, {
			WKCNoteCreationDate: new Date(inputData.WKCNoteCreationDate),
			WKCNoteModificationDate: new Date(inputData.WKCNoteModificationDate),
		});
	};

	//# PROPERTIES

	//_ propertiesNoteObjects

	moi.propertiesNoteObjects = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WCKWriteBehaviourPropertyNoteObjects.slice();
		}

		WCKWriteBehaviourPropertyNoteObjects = inputData.sort(WKCWriteLogic.WKCWriteLogicListSort);

		moi.reactNoteObjects(moi.dataNoteObjectsFiltered());
	};

	//_ propertiesCurrentFilter

	moi.propertiesCurrentFilter = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WCKWriteBehaviourPropertyCurrentFilter;
		}

		WCKWriteBehaviourPropertyCurrentFilter = inputData === null ? undefined : inputData;

		moi.propertiesNoteObjects(moi.propertiesNoteObjects());
	};

	//_ propertiesSelectedNote

	moi.propertiesSelectedNote = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WCKWriteBehaviourPropertySelectedNote;
		}

		WCKWriteBehaviourPropertySelectedNote = inputData === null ? undefined : inputData;

		moi.reactSelectedNote(WCKWriteBehaviourPropertySelectedNote);
	};

	//# DATA

	//_ dataNewNoteObject

	moi.dataNewNoteObject = function () {
		return {
			WKCNoteBody: '',
		};
	};

	//# INTERFACE

	//_ interfaceLoginButtonDidClick

	moi.interfaceLoginButtonDidClick = function () {
		storageClient.remoteStorage.connect(window.prompt(OLSKLocalized('WKCLoginPromptUserAddressText')), window.prompt(OLSKLocalized('WKCLoginPromptUserTokenText')));
	};

	//_ interfaceNotesMasterToolbarFilterInputDidInput

	moi.interfaceNotesMasterToolbarFilterInputDidInput = function () {
		moi.commandsNotesFilter(document.getElementById('WKCWriteMasterToolbarFilterInput').value);
		
		setTimeout(function () {
			document.getElementById('WKCWriteMasterToolbarFilterInput').focus()
		});
	};

	//_ interfaceNotesMasterToolbarCreateButtonDidClick

	moi.interfaceNotesMasterToolbarCreateButtonDidClick = function () {
		moi.goNotesCreate();
	};

	//_ interfaceBackButtonDidClick

	moi.interfaceBackButtonDidClick = function () {
		moi.reactFocusMaster();
	};

	//_ interfaceDeleteButtonDidClick

	moi.interfaceDeleteButtonDidClick = function () {
		moi.commandsDeleteNoteWithConfirmation(moi.propertiesSelectedNote());
	};

	//_ interfacePublishButtonDidClick

	moi.interfacePublishButtonDidClick = function () {
		moi.commandsPublishNote(moi.propertiesSelectedNote());
	};

	//_ interfaceUnpublishButtonDidClick

	moi.interfaceUnpublishButtonDidClick = function () {
		moi.commandsUnpublishNote(moi.propertiesSelectedNote());
	};

	//_ interfaceClearInputShortcutDidInvoke

	moi.interfaceClearInputShortcutDidInvoke = function (event) {
		moi.commandsNotesFilterManual('');
	};

	//_ interfaceToggleTabFocusShortcutDidInvoke

	moi.interfaceToggleTabFocusShortcutDidInvoke = function (event) {
		moi.commandsToggleTabFocus(event);
	};

	//_ interfaceSelectPreviousShortcutDidInvoke

	moi.interfaceSelectPreviousShortcutDidInvoke = function () {
		moi.commandsNotesSelectPrevious();
		
		event.preventDefault();
	};

	//_ interfaceSelectNextShortcutDidInvoke

	moi.interfaceSelectNextShortcutDidInvoke = function () {
		moi.commandsNotesSelectNext();

		event.preventDefault();
	};

	//# COMMANDS

	//_ commandsAlertNotesUnavailable

	moi.commandsAlertNotesUnavailable = function () {
		window.alert(OLSKLocalized('WKCWriteErrorNotesUnavailable'));

		throw new Error('WKCWriteErrorNotesUnavailable');
	};

	//_ goNotesCreate

	moi.goNotesCreate = async function () {
		moi.propertiesNoteObjects(moi.propertiesNoteObjects().concat(await WKCNotesAction.WKCNotesActionCreate(storageClient, moi.dataNewNoteObject())));

		moi.reactFocusDetail();

		moi.commandsNotesSelect(moi.propertiesNoteObjects().shift());

		WCKWriteBehaviourPropertyEditor.focus();
	};

	//_ commandsNotesSelect

	moi.commandsNotesSelect = function (item) {
		moi.propertiesSelectedNote(item);

		if (!item) {
			moi.kDefaultFocusNode().focus();
		}
	};

	//_ commandsNotesSelectPrevious

	moi.commandsNotesSelectPrevious = function () {
		let items = moi.dataNoteObjectsFiltered();
		moi.commandsNotesSelect(items[Math.max(items.indexOf(moi.propertiesSelectedNote()) - 1, 0)]);
	};

	//_ commandsNotesSelectNext

	moi.commandsNotesSelectNext = function () {
		let items = moi.dataNoteObjectsFiltered();
		moi.commandsNotesSelect(items[Math.min(items.indexOf(moi.propertiesSelectedNote()) + 1, items.length - 1)]);
	};

	//_ commandsSelectedNoteUpdateBody

	moi.commandsSelectedNoteUpdateBody = async function (inputData) {
		(async function(noteObject) {
			if (WCKWriteBehaviourPropertyNotesThrottleMap[noteObject.WKCNoteID]) {
				return OLSKThrottle.OLSKThrottleTimeoutFor(WCKWriteBehaviourPropertyNotesThrottleMap[noteObject.WKCNoteID]);
			}

			WCKWriteBehaviourPropertyNotesThrottleMap[noteObject.WKCNoteID] = {
				OLSKThrottleDuration: 3000,
				OLSKThrottleCallback: function () {
					delete WCKWriteBehaviourPropertyNotesThrottleMap[noteObject.WKCNoteID]
				},
			};

			if (!noteObject.WKCNoteCreationDate) {
				return;
			}

			await WKCVersionsAction.WKCVersionsActionCreate(storageClient, {
				WKCVersionNoteID: noteObject.WKCNoteID,
				WKCVersionBody: noteObject.WKCNoteBody,
				WKCVersionDate: noteObject.WKCNoteModificationDate,
			});
		})(Object.assign({}, moi.propertiesSelectedNote()));

		await WKCNotesAction.WKCNotesActionUpdate(storageClient, Object.assign(moi.propertiesSelectedNote(), {
			WKCNoteBody: inputData,
		}));

		moi.reactNoteObjects(moi.dataNoteObjectsFiltered());
	};

	//_ commandsSelectedNoteLogVersions

	moi.commandsSelectedNoteLogVersions = async function () {
		(await WKCVersionsAction.WKCVersionsActionQuery(storageClient, {
			WKCVersionNoteID: moi.propertiesSelectedNote().WKCNoteID,
		})).slice(0, 5).forEach(function (e) {
			console.log(e)
			console.log(e.WKCVersionBody);
		});
	};

	//_ commandsPersistNote #pendext

	moi.commandsPersistNote = function (inputData) {
		(new Promise(function(resolve, reject) {
			if (!inputData.WKCNoteID) {
				return moi._commandsPersistNoteCreate(inputData, resolve, reject);
			}

			return moi._commandsPersistNoteVersion(inputData, resolve, reject);
			
		})).then(function() {
			delete inputData._WKCWriteThrottleObject;

			moi.reactNoteObjects(moi.dataNoteObjectsFiltered());
		}, function(error) {
			if (window.confirm(OLSKLocalized('WKCWriteErrorPersistenceSaveDidFail'))) {
				return moi.commandsPersistNote(inputData);
			};

			throw error;
		});
	};

	//_ _commandsPersistNoteCreate #pendext

	moi._commandsPersistNoteCreate = function (inputData, resolve, reject) {
		let item = Object.assign({}, inputData);

		delete item._WKCWriteThrottleObject;

		return resolve(d3.json(OLSKCanonicalFor('WKCRouteAPINotesCreate'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify(item),
		}).then(function(responseJSON) {
			Object.assign(inputData, moi.dataNoteObjectPreparedFor(responseJSON));
		}, reject));
	};

	//_ _commandsPersistNoteVersion #pendext

	moi._commandsPersistNoteVersion = function (inputData, resolve, reject) {
		let item = Object.assign({}, inputData);

		delete item._WKCWriteThrottleObject;

		return resolve(d3.json(OLSKCanonicalFor('WKCRouteAPINotesVersion', {
			wkc_note_id: inputData.WKCNoteID,
		}), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify({
				WKCVersionNoteID: item.WKCNoteID,
				WKCVersionBody: item.WKCNoteBody,
				WKCVersionDate: item.WKCNoteModificationDate,
			}),
		}));
	};

	//_ commandsNotesFilter

	moi.commandsNotesFilter = function (inputData) {
		moi.propertiesCurrentFilter(inputData);

		if (!inputData.length) {
			return moi.commandsNotesSelect(null);
		}

		if (!moi.dataNoteObjectsFiltered().length) {
			return moi.commandsNotesSelect(null);
		}

		let item = moi.dataNoteObjectsFiltered().filter(function (e) {
			return WKCParser.WKCParserTitleForPlaintext(e.WKCNoteBody).toLowerCase().match(inputData.toLowerCase());
		}).shift();

		if (item) {
			return moi.commandsNotesSelect(item);
		}
	};

	//_ commandsNotesFilterManual

	moi.commandsNotesFilterManual = function (inputData) {
		moi.commandsNotesFilter(inputData);

		moi.reactCurrentFilterManual(inputData);
	};

	//_ commandsPublishNote

	moi.commandsPublishNote = async function (inputData) {
		d3.select('#WKCWriteDetailToolbarPublishStatus').text(OLSKLocalized('WKCWriteDetailToolbarPublishStatusPublishing'));

		try {
			moi.reactPublishStatus(await WKCNotesAction.WKCNotesActionPublish(storageClient, inputData));
		} catch(error) {
			if (window.confirm(OLSKLocalized('WKCWriteErrorPublishDidFail'))) {
				return moi.commandsPublishNote(inputData);
			};

			d3.select('#WKCWriteDetailToolbarPublishStatus').text(OLSKLocalized('WKCWriteDetailToolbarPublishStatusUnableToPublish'));

			throw error;
		}
	};

	//_ commandsUnpublishNote

	moi.commandsUnpublishNote = async function (inputData) {
		d3.select('#WKCWriteDetailToolbarPublishStatus').text(OLSKLocalized('WKCWriteDetailToolbarPublishStatusUnpublishing'));

		try {
			moi.reactPublishStatus(await WKCNotesAction.WKCNotesActionUnpublish(storageClient, inputData));
		} catch(error) {
			if (window.confirm(OLSKLocalized('WKCWriteErrorUnpublishDidFail'))) {
				return moi.commandsUnpublishNote(inputData);
			};

			d3.select('#WKCWriteDetailToolbarPublishStatus').text(OLSKLocalized('WKCWriteDetailToolbarPublishStatusUnableToUnpublish'));

			throw error;
		}
	};

	//_ commandsDeleteNoteWithConfirmation

	moi.commandsDeleteNoteWithConfirmation = function (inputData) {
		if (!window.confirm(OLSKLocalized('WKCWriteNotesDeleteAlertText'))) {
			return;
		};

		moi._goNotesDeleteWithoutConfirmation(inputData);
	};

	//_ _goNotesDeleteWithoutConfirmation

	moi._goNotesDeleteWithoutConfirmation = async function (inputData) {
		await WKCNotesAction.WKCNotesActionDelete(storageClient, inputData.WKCNoteID);

		moi.propertiesNoteObjects(moi.propertiesNoteObjects().filter(function(e) {
			return e !== inputData;
		}));

		moi.commandsNotesSelect(null);
	};

	//_ _commandsOpenCursorObject

	moi._commandsOpenCursorObject = function (inputData) {
		let cursor = WCKWriteBehaviourPropertyEditor.getCursor();

  	let currentObject = WKCWriteLogic.WKCWriteLineObjectsFor(WCKWriteBehaviourPropertyEditor.getLineTokens(cursor.line)).filter(function (e) {
  		return Math.max(e.start, Math.min(e.end, cursor.ch)) === cursor.ch;
  	}).shift();

  	if (!currentObject.type.match('link')) {
  		return;
  	}

  	moi._commandsOpenTextObject(currentObject.string);
	};

	//_ _commandsOpenTextObject

	moi._commandsOpenTextObject = function (inputData) {
		if (!!URLParse(inputData, {}).protocol) {
			return window.open(inputData, '_blank');
		}

		let matches = inputData.match(/\[\[(.*)\]\]/);
		if (!matches) {
			return;
		}

		event.preventDefault();
		return moi.commandsNotesFilterManual(matches.pop());
	};

	//_ commandsToggleTabFocus

	moi.commandsToggleTabFocus = function (event) {
		event.preventDefault();

		if (WCKWriteBehaviourPropertyEditor.hasFocus()) {
			return moi.kDefaultFocusNode().focus();
		}

		return WCKWriteBehaviourPropertyEditor.focus();
	};

	//# REACT

	//_ reactNoteObjects

	moi.reactNoteObjects = function (inputData) {
		var selection = d3.select('#WKCWriteMasterContentList')
			.selectAll('.WKCWriteMasterContentListItem').data(inputData);
		
		var parentElement = selection.enter().append('div')
			.attr('class', 'WKCWriteMasterContentListItem')
			.classed('WKCSharedElementTappable', true);

		var contextElement = parentElement.append('div')
			.attr('class', 'WKCWriteMasterContentListItemContext');

		contextElement.append('span')
			.attr('class', 'WKCWriteMasterContentListItemContextTitle');

		parentElement.append('span')
			.attr('class', 'WKCWriteMasterContentListItemSnippet');

		parentElement = parentElement.merge(selection);

		parentElement
			.on('click', function(obj) {
				moi.reactFocusDetail();

				moi.commandsNotesSelect(obj);

				if (d3.select('#WKCWrite').classed('WKCSharedMobile')) {
					return;
				}
				
				WCKWriteBehaviourPropertyEditor.focus();
			});

		parentElement.select('.WKCWriteMasterContentListItemContextTitle')
			.text(function (e) {
				return WKCParser.WKCParserTitleForPlaintext(e.WKCNoteBody);
			});

		parentElement.select('.WKCWriteMasterContentListItemSnippet').text(function(obj) {
			return WKCParser.WKCParserSnippetForPlaintext(WKCParser.WKCParserBodyForPlaintext(obj.WKCNoteBody));
		});

		_reactSharedSelectedNote(moi.propertiesSelectedNote())

		selection.exit().remove();
	};

	//_ reactCurrentFilterManual

	moi.reactCurrentFilterManual = function (inputData) {
		document.getElementById('WKCWriteMasterToolbarFilterInput').value = inputData;

		setTimeout(function () {
			moi.kDefaultFocusNode().focus()
		});
	};

	//_ reactSelectedNote

	moi.reactSelectedNote = function (inputData) {
		_reactSharedSelectedNote(inputData);

		d3.select('#WKCWriteDetailToolbarDiscardButton').attr('disabled', inputData ? null : undefined);

		d3.select('#WKCWriteDetail').classed('WKCWriteDetailInactive', !inputData);

		WCKWriteBehaviourPropertyEditor.setValue(inputData ? inputData.WKCNoteBody : '');

		moi.reactPublishStatus(inputData);
	};

	//_ _reactSharedSelectedNote

	let _reactSharedSelectedNote = function (inputData) {
		d3.selectAll('.WKCWriteMasterContentListItem').classed('WKCWriteMasterContentListItemSelected', function(d) {
			return d === inputData;
		});
	};

	//_ reactPublishStatus

	moi.reactPublishStatus = function (inputData) {
		d3.select('#WKCWriteDetailToolbarPublishStatus').html(inputData && inputData.WKCNotePublishStatusIsPublished ? OLSKLocalized('WKCWriteDetailToolbarPublishStatusPublished') : null);

		d3.select('#WKCWriteDetailToolbarVisitButton')
			.classed('WKCSharedHidden', inputData ? !inputData.WKCNotePublishStatusIsPublished : false)
			.attr('href', inputData && inputData.WKCNotePublishStatusIsPublished ? OLSKCanonicalFor('WKCRouteRefsRead', {
				wkc_note_public_id: inputData.WKCNotePublicID,
			}) : undefined);

		d3.select('#WKCWriteDetailToolbarPublishButton')
			.classed('WKCSharedHidden', inputData ? inputData.WKCNotePublishStatusIsPublished : false);
		d3.select('#WKCWriteDetailToolbarUnpublishButton')
			.classed('WKCSharedHidden', inputData ? !inputData.WKCNotePublishStatusIsPublished : false);
	};

	//_ reactFocusMaster

	moi.reactFocusMaster = function () {
		d3.selectAll('.WKC_ContextMobileView').classed('WKC_ContextMobileViewActive', function () {
			return this.id === 'WKCWriteMaster';
		}).classed('WKC_ContextMobileViewInactive', function () {
			return this.id !== 'WKCWriteMaster';
		});
	};

	//_ reactFocusDetail

	moi.reactFocusDetail = function () {
		d3.selectAll('.WKC_ContextMobileView').classed('WKC_ContextMobileViewActive', function () {
			return this.id === 'WKCWriteDetail';
		}).classed('WKC_ContextMobileViewInactive', function () {
			return this.id !== 'WKCWriteDetail';
		});
	};

	//# SETUP

	//_ setupEverything

	let setupEverything = function () {
		moi.setupNoteObjects();
		setupStorageClient();
		moi.setupEditor();
		moi.setupShortcuts();
		setupMobile();
	};

	//_ setupNoteObjects

	moi.setupNoteObjects = function () {
		moi.propertiesNoteObjects([]);
	};

	//_ setupStorageClient

	let setupStorageClient = function () {
		storageClient = WKCStorageClient.WKCStorageClientForChangeDelegateMap({
			wkc_settings: null,
			wkc_versions: null,
			wkc_notes: {
				OLSKChangeDelegateAdd: function (inputData) {
					// console.log('OLSKChangeDelegateAdd', inputData);
					return moi.propertiesNoteObjects(moi.propertiesNoteObjects().concat(inputData));
				},
				OLSKChangeDelegateRemove: function (inputData) {
					console.log('OLSKChangeDelegateRemove', inputData);
					return moi.propertiesNoteObjects(moi.propertiesNoteObjects().filter(function (e) {
						return e.WKCNoteID !== inputData.WKCNoteID;
					}))
				},
				OLSKChangeDelegateUpdate: function (inputData) {
					console.log('OLSKChangeDelegateUpdate', inputData);
					return moi.propertiesNoteObjects(moi.propertiesNoteObjects().map(function (e) {
						return Object.assign(e, e.WKCNoteID === inputData.WKCNoteID ? inputData : {});
					}));
				},
			},
		});

		let remoteStorage = storageClient.remoteStorage;

		const widget = new Widget(remoteStorage);
		widget.attach('WKCStorageWidget');

		remoteStorage.on('ready', async () => {
			console.debug('ready');

			await remoteStorage.wkc_notes.init();

			setupFinalize();
		});

		remoteStorage.on('not-connected', (a, b, c) => {
			d3.select('#WKCLoginButton').classed('WKCSharedHidden', false);
		});

		remoteStorage.on('disconnected', (a, b, c) => {
			console.debug(`disconnected`, a, b, c);
		});

		remoteStorage.on('error', (a, b, c) => {
			console.debug(`error`, a, b, c);
		});

		remoteStorage.on('connected', () => {
			// console.log(remoteStorage.remote.userAddress);
			// console.log(remoteStorage.remote.token);
			d3.select('#WKCLoginButton').classed('WKCSharedHidden', true);
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

	//_ setupEditor

	moi.setupEditor = function () {
		WCKWriteBehaviourPropertyEditor = CodeMirror.fromTextArea(document.getElementById('WKCWriteDetailContentTextarea'), {
		  mode: {
		    name: 'gfm',
		    gitHubSpice: false,
		    emoji: false,
		  },
		  lineNumbers: false,
		  lineWrapping: true,
		  extraKeys: {
		    Enter: 'newlineAndIndentContinueMarkdownList',
		    'Cmd-Enter': moi._commandsOpenCursorObject,
		    'Ctrl-Enter': moi._commandsOpenCursorObject,
		    Esc: function () {
		      return moi.kDefaultFocusNode().focus();
		    },
		    Tab: false,
		  },
		  theme: 'wkc',
		  keyMap: 'sublime',
		});

		WCKWriteBehaviourPropertyEditor.on('change', function (instance, changeObject) {
			if (changeObject.origin === 'setValue') {
				return;
			}

			moi.commandsSelectedNoteUpdateBody(instance.getValue());
		});

		WCKWriteBehaviourPropertyEditor.on('keydown', function (instance, event) {
			if (!navigator.platform.match(/mac/i)) {
				return;
			}

			if (!navigator.userAgent.match(/^((?!chrome|android).)*safari/i)) {
				return;
			}

			if (!event.altKey || !event.ctrlKey) {
				return;
			}

			let elements = document.querySelectorAll('[accesskey]');

			if (!elements.length) {
				return;
			}

			let match = [].slice.call(elements).filter(function (e) {
				return e.getAttribute('accesskey') === event.key;
			}).shift();

			if (!match) {
				return;
			}

			event.preventDefault();

			setTimeout(function () {
				match.focus();
			});
		});

		WCKWriteBehaviourPropertyEditor.on('mousedown', function (instance, event) {
			if (!event.target.className.match('cm-link'))  {
				return;
			}

			event.preventDefault();
		});

		document.querySelector('.CodeMirror').addEventListener('mouseup', function (event) {
			if (!event.target.className.match('cm-link'))  {
				return;
			}

			moi._commandsOpenTextObject(event.target.textContent);
		});
	};

	//_ setupShortcuts

	moi.setupShortcuts = function () {
		window.addEventListener('keydown', function (event) {
			if (event.key === 'Tab') {
				return moi.interfaceToggleTabFocusShortcutDidInvoke(event);
			};

			if (event.key === 'Escape') {
				return moi.interfaceClearInputShortcutDidInvoke(event);
			};

			if (document.activeElement !== moi.kDefaultFocusNode()) {
				return;
			}

			if (event.key === 'ArrowUp') {
				return moi.interfaceSelectPreviousShortcutDidInvoke(event);
			}

			if (event.key === 'ArrowDown') {
				return moi.interfaceSelectNextShortcutDidInvoke(event);
			}
		});
	};

	//_ setupMobile

	let setupMobile = function () {
		d3.select('#WKCWrite').classed('WKCSharedMobile', window.innerWidth <= 760);
	};

	//_ setupFinalize

	let setupFinalize = function () {
		d3.select('#WKCWrite').classed('WKCWriteLoading', false);

		moi.kDefaultFocusNode().focus();
	};

	//# LIFECYCLE

	//_ lifecyclePageWillLoad

	moi.lifecyclePageWillLoad = function () {
		setupEverything();
	};

	Object.assign(exports, moi);

	Object.defineProperty(exports, '__esModule', { value: true });

})));
