/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCWriteBehaviour = global.WKCWriteBehaviour || {})));
}(this, (function (exports) { 'use strict';

	var moi = {};

	var WCKWriteBehaviourPropertyAPIToken;
	let WCKWriteBehaviourPropertyNoteObjects;
	let WCKWriteBehaviourPropertyCurrentFilter;
	var WCKWriteBehaviourPropertySelectedNote;
	let WCKWriteBehaviourPropertyEditor;

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
			WKCNoteDateCreated: new Date(inputData.WKCNoteDateCreated),
			WKCNoteDateUpdated: new Date(inputData.WKCNoteDateUpdated),
		});
	};

	//# PROPERTIES

	//_ propertiesAPIToken

	moi.propertiesAPIToken = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WCKWriteBehaviourPropertyAPIToken;
		}

		WCKWriteBehaviourPropertyAPIToken = inputData;
	};

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
			WKCNoteDateCreated: new Date(),
			WKCNoteBody: '',
		};
	};

	//# INTERFACE

	//_ interfaceNotesMasterToolbarFilterInputDidInput

	moi.interfaceNotesMasterToolbarFilterInputDidInput = function () {
		moi.commandsNotesFilter(document.getElementById('WKCWriteMasterToolbarFilterInput').value);
		
		setTimeout(function () {
			document.getElementById('WKCWriteMasterToolbarFilterInput').focus()
		});
	};

	//_ interfaceNotesMasterToolbarCreateButtonDidClick

	moi.interfaceNotesMasterToolbarCreateButtonDidClick = function () {
		moi.commandsNotesCreate();

		WCKWriteBehaviourPropertyEditor.focus();
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

	//_ commandsAlertConnectionError

	moi.commandsAlertConnectionError = function (error) {
		window.alert(OLSKLocalized('WKSharedErrorServiceUnavailable'));

		throw error;
	};

	//_ commandsAlertTokenUnavailable

	moi.commandsAlertTokenUnavailable = function () {
		window.alert(OLSKLocalized('WKSharedErrorTokenUnavailable'));

		throw new Error('WKCAppErrorTokenUnavailable');
	};

	//_ commandsAlertNotesUnavailable

	moi.commandsAlertNotesUnavailable = function () {
		window.alert(OLSKLocalized('WKCWriteErrorNotesUnavailable'));

		throw new Error('WKCWriteErrorNotesUnavailable');
	};

	//_ commandsNotesCreate

	moi.commandsNotesCreate = function () {
		moi.propertiesNoteObjects(moi.propertiesNoteObjects().concat(moi.dataNewNoteObject()));

		moi.propertiesSelectedNote(moi.propertiesNoteObjects().shift());
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

	moi.commandsSelectedNoteUpdateBody = function (inputData) {
		let item = Object.assign(moi.propertiesSelectedNote(), {
			WKCNoteBody: inputData,
			WKCNoteDateUpdated: new Date(),
		});

		if (!item._WKCWriteThrottleObject) {
			item._WKCWriteThrottleObject = {
				OLSKThrottleDuration: 3000,
				OLSKThrottleCallback: function () {
					moi.commandsPersistNote(item);
				},
			};
		}

		OLSKThrottle.OLSKThrottleTimeoutFor(item._WKCWriteThrottleObject);

		moi.reactNoteObjects(moi.dataNoteObjectsFiltered());
	};

	//_ commandsPersistNote

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

			if (inputData === moi.propertiesSelectedNote()) {
				moi.reactPersistenceStatus(OLSKLocalized('WKCWriteDetailToolbarPersistenceStatusUnableToSave'));
			}

			throw error;
		});
	};

	//_ _commandsPersistNoteCreate

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

	//_ _commandsPersistNoteVersion

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
				WKCVersionDate: item.WKCNoteDateUpdated,
			}),
		}));
	};

	//_ commandsNotesFilter

	moi.commandsNotesFilter = function (inputData) {
		moi.propertiesCurrentFilter(inputData);

		if (!inputData.length) {
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

	moi.commandsPublishNote = function (inputData) {
		d3.select('#WKCWriteDetailToolbarPublishStatus').text(OLSKLocalized('WKCWriteDetailToolbarPublishStatusPublishing'));

		d3.json(OLSKCanonicalFor('WKCRouteAPINotesPublish', {
			wkc_note_id: inputData.WKCNoteID,
		}), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
		}).then(function(responseJSON) {
			moi.reactPublishStatus(Object.assign(inputData, moi.dataNoteObjectPreparedFor(responseJSON)));
		}, function(error) {
			if (window.confirm(OLSKLocalized('WKCWriteErrorPublishDidFail'))) {
				return moi.commandsPublishNote(inputData);
			};

			d3.select('#WKCWriteDetailToolbarPublishStatus').text(OLSKLocalized('WKCWriteDetailToolbarPublishStatusUnableToPublish'));

			throw error;
		});
	};

	//_ commandsUnpublishNote

	moi.commandsUnpublishNote = function (inputData) {
		d3.select('#WKCWriteDetailToolbarPublishStatus').text(OLSKLocalized('WKCWriteDetailToolbarPublishStatusUnpublishing'));

		d3.json(OLSKCanonicalFor('WKCRouteAPINotesUnpublish', {
			wkc_note_id: inputData.WKCNoteID,
		}), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
		}).then(function(responseJSON) {
			moi.reactPublishStatus(Object.assign(inputData, moi.dataNoteObjectPreparedFor(responseJSON)));
		}, function(error) {
			if (window.confirm(OLSKLocalized('WKCWriteErrorUnpublishDidFail'))) {
				return moi.commandsUnpublishNote(inputData);
			};

			d3.select('#WKCWriteDetailToolbarPublishStatus').text(OLSKLocalized('WKCWriteDetailToolbarPublishStatusUnableToUnpublish'));

			throw error;
		});
	};

	//_ commandsDeleteNoteWithConfirmation

	moi.commandsDeleteNoteWithConfirmation = function (inputData) {
		if (inputData._WKCWriteThrottleObject) {
			clearInterval(inputData._WKCWriteThrottleObject._OLSKThrottleTimeoutID);
		}

		if (!window.confirm(OLSKLocalized('WKCWriteNotesDeleteAlertText'))) {
			if (inputData._WKCWriteThrottleObject) {
				OLSKThrottle.OLSKThrottleTimeoutFor(inputData._WKCWriteThrottleObject);
			}

			return;
		};

		moi._commandsDeleteNoteWithoutConfirmation(inputData);
	};

	//_ _commandsDeleteNoteWithoutConfirmation

	moi._commandsDeleteNoteWithoutConfirmation = function (inputData) {
		if (inputData._WKCWriteThrottleObject) {
			clearInterval(inputData._WKCWriteThrottleObject._OLSKThrottleTimeoutID);
		}

		moi.reactPersistenceStatus(OLSKLocalized('WKCWriteDetailToolbarPersistenceStatusDeleting'));

		d3.json(OLSKCanonicalFor('WKCRouteAPINotesDelete', {
			wkc_note_id: inputData.WKCNoteID,
		}), {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
		}).then(function(responseJSON) {
			moi.propertiesNoteObjects(moi.dataNoteObjectsFiltered().filter(function(e) {
				return e !== inputData;
			}));

			moi.commandsNotesSelect(null);

			moi.reactPersistenceStatus(OLSKLocalized('WKCWriteDetailToolbarPersistenceStatusDeleted'), true);
		}, function(error) {
			if (window.confirm(OLSKLocalized('WKCWriteErrorPersistenceDeleteDidFail'))) {
				return moi._commandsDeleteNoteWithoutConfirmation(inputData);
			};

			moi.reactPersistenceStatus(OLSKLocalized('WKCWriteDetailToolbarPersistenceStatusUnableToDelete'));

			if (inputData._WKCWriteThrottleObject) {
				OLSKThrottle.OLSKThrottleTimeoutFor(inputData._WKCWriteThrottleObject);
			}

			throw error;
		});
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
		if (WCKWriteBehaviourPropertyEditor.hasFocus()) {
			return moi.kDefaultFocusNode().focus();
		}

		if (document.activeElement === moi.kDefaultFocusNode()) {
			event.preventDefault();
			return WCKWriteBehaviourPropertyEditor.focus();
		}
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
			.attr('class', 'WKCWriteMasterContentListItemContextUnpersistedStatus').text('⦿');
		contextElement.append('span')
			.attr('class', 'WKCWriteMasterContentListItemContextTitle');

		parentElement.append('span')
			.attr('class', 'WKCWriteMasterContentListItemSnippet');

		parentElement = parentElement.merge(selection);

		parentElement
			.on('click', function(obj) {
				moi.commandsNotesSelect(obj);
				
				WCKWriteBehaviourPropertyEditor.focus();
			});

		parentElement.classed('WKCWriteMasterContentListItemUnpersisted', function (obj) {
			return obj._WKCWriteThrottleObject;
		});
		parentElement.select('.WKCWriteMasterContentListItemContextTitle')
			.text(function (e) {
				return WKCParser.WKCParserTitleForPlaintext(e.WKCNoteBody);
			});

		parentElement.select('.WKCWriteMasterContentListItemSnippet').text(function(obj) {
			return WKCParser.WKCParserSnippetForPlaintext(WKCParser.WKCParserBodyForPlaintext(obj.WKCNoteBody));
		});

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
		d3.selectAll('.WKCWriteMasterContentListItem').classed('WKCWriteMasterContentListItemSelected', function(d) {
			return d === inputData;
		});

		d3.select('#WKCWriteDetailToolbarDiscardButton').attr('disabled', inputData ? null : undefined);

		d3.select('#WKCWriteDetail').classed('WKCWriteDetailInactive', !inputData);

		WCKWriteBehaviourPropertyEditor.setValue(inputData ? inputData.WKCNoteBody : '');

		moi.reactPublishStatus(inputData);
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

	//_ reactPersistenceStatus

	moi.reactPersistenceStatus = function (inputData, shouldClear) {
		d3.select('#WKCWriteDetailToolbarPersistenceStatus').text(inputData);

		if (!shouldClear) {
			return;
		}

		setTimeout(function() {
			d3.select('#WKCWriteDetailToolbarPersistenceStatus').text(null);
		}, 1000);
	};

	//# SETUP

	//_ setupEverything

	moi.setupEverything = function () {
		moi.setupAPIToken(function () {
			moi.setupNoteObjects(function() {
				moi.setupEditor();
				moi.setupShortcuts();
				moi.setupBeforeUnload();

				d3.select('#WKCWrite').classed('WKCWriteLoading', false);

				moi.kDefaultFocusNode().focus();
			});
		});
	};

	//_ setupAPIToken

	moi.setupAPIToken = function (completionHandler) {
		d3.json(OLSKCanonicalFor('WKCRouteAPIToken'), {
			method: 'GET',
		}).then(function(responseJSON) {
			if (!responseJSON.WKCAPIToken) {
				return moi.commandsAlertTokenUnavailable();
			}

			moi.propertiesAPIToken(responseJSON.WKCAPIToken);

			completionHandler();
		}, moi.commandsAlertConnectionError);
	};

	//_ setupNoteObjects

	moi.setupNoteObjects = function (completionHandler) {
		d3.json(OLSKCanonicalFor('WKCRouteAPINotesSearch'), {
			method: 'GET',
			headers: {
				'x-client-key': moi.propertiesAPIToken(),
			},
		}).then(function(responseJSON) {
			if (!Array.isArray(responseJSON)) {
				return moi.commandsAlertNotesUnavailable();
			}

			moi.propertiesNoteObjects(responseJSON.map(moi.dataNoteObjectPreparedFor));

			completionHandler();
		}, moi.commandsAlertConnectionError);
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
		  },
		  theme: 'wkv',
		});

		WCKWriteBehaviourPropertyEditor.on('change', function (instance, changeObject) {
			if (changeObject.origin === 'setValue') {
				return;
			}

			moi.commandsSelectedNoteUpdateBody(instance.getValue());
		});

		WCKWriteBehaviourPropertyEditor.on('keydown', function (instance, event) {
			if (!event.altKey) {
				return;
			}

			if (event.key.length > 1) {
				return;
			}

			if (event.key.match(/\W/)) {
				return;
			}

			event.codemirrorIgnore = true;

			event.preventDefault();

			setTimeout(function () {
				// moi.kDefaultFocusNode().focus()
				// moi.kDefaultFocusNode().dispatchEvent(new KeyboardEvent('keydown', {
				// 	altKey: true,
				// 	ctrlKey: true,
				// 	key: 'f',
				// }))
			}, 100);
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
			if (moi.propertiesSelectedNote() && event.shiftKey && (event.key === 'Tab')) {
				return moi.interfaceToggleTabFocusShortcutDidInvoke(event);
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

			if (event.key === 'Tab') {
				return moi.interfaceToggleTabFocusShortcutDidInvoke(event);
			};

			if (event.key === 'Escape') {
				return moi.interfaceClearInputShortcutDidInvoke(event);
			};
		});
	};

	//_ setupBeforeUnload

	moi.setupBeforeUnload = function () {
		window.addEventListener('beforeunload', function (event) {
			if (!moi.propertiesNoteObjects().filter(function (e) {
				return e._WKCWriteThrottleObject;
			}).length) {
				return;
			}

		  return 'true';
		});
	};

	//# LIFECYCLE

	//_ lifecyclePageWillLoad

	moi.lifecyclePageWillLoad = function () {
		moi.setupEverything();
	};

	Object.assign(exports, moi);

	Object.defineProperty(exports, '__esModule', { value: true });

})));
