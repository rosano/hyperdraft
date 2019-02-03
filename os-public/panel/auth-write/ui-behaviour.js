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
	var WCKWriteBehaviourPropertySelectedNote;
	let WCKWriteBehaviourPropertyEditor;

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
			return d3.selectAll('.WKCWriteMasterContentListItem').data();
		}

		moi.reactNoteObjects(inputData.sort(WKCWriteLogic.WKCWriteLogicListSort));
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

	//_ interfaceNotesMasterToolbarCreateButtonDidClick

	moi.interfaceNotesMasterToolbarCreateButtonDidClick = function () {
		moi.commandsNotesCreate();
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

	//_ commandsSelectNote

	moi.commandsSelectNote = function (item) {
		moi.propertiesSelectedNote(item);
	};

	//_ commandsSelectedNoteUpdateBody

	moi.commandsSelectedNoteUpdateBody = function (inputData) {
		let item = Object.assign(moi.propertiesSelectedNote(), {
			WKCNoteBody: inputData,
			WKCNoteDateUpdated: new Date(),
		});

		if (!item._WKCWriteThrottleObject) {
			item._WKCWriteThrottleObject = {
				OLSKThrottleDuration: 2000,
				OLSKThrottleCallback: function () {
					moi.commandsPersistNote(item);
				},
			};
		}

		OLSKThrottle.OLSKThrottleTimeoutFor(item._WKCWriteThrottleObject);

		moi.reactNoteObjects(moi.propertiesNoteObjects());
	};

	//_ commandsPersistNote

	moi.commandsPersistNote = function (inputData) {
		(new Promise(function(resolve, reject) {
			if (inputData === moi.propertiesSelectedNote()) {
				moi.reactPersistenceStatus(OLSKLocalized('WKCWriteDetailToolbarPersistenceStatusSaving'));
			}

			if (!inputData.WKCNoteID) {
				return moi._commandsPersistNoteCreate(inputData, resolve, reject);
			}

			return moi._commandsPersistNoteUpdate(inputData, resolve, reject);
			
		})).then(function() {
			if (inputData === moi.propertiesSelectedNote()) {
				moi.reactPersistenceStatus(OLSKLocalized('WKCWriteDetailToolbarPersistenceStatusSaved'), true);
			}

			delete inputData._WKCWriteThrottleObject;

			moi.reactNoteObjects(moi.propertiesNoteObjects());
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
			Object.assign(inputData, responseJSON);
		}, reject));
	};

	//_ _commandsPersistNoteUpdate

	moi._commandsPersistNoteUpdate = function (inputData, resolve, reject) {
		let item = Object.assign({}, inputData);

		delete item._WKCWriteThrottleObject;

		return resolve(d3.json(OLSKCanonicalFor('WKCRouteAPINotesUpdate', {
			wkc_note_id: inputData.WKCNoteID,
		}), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify(item),
		}));
	};

	//_ commandsPublishNote

	moi.commandsPublishNote = function (inputData) {
		d3.select('#WKCWriteDetailToolbarPublishStatus').text(OLSKLocalized('WKCWriteDetailToolbarPublishStatusPublishing'));

		d3.json(OLSKCanonicalFor('WKCRouteAPINotesPublish', {
			wkc_note_id: inputData.WKCNoteID,
		}), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify({
				WKCNotePublishStatusIsPublished: true,
			}),
		}).then(function(responseJSON) {
			Object.assign(inputData, responseJSON);

			moi.reactPublishStatus();
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
			Object.assign(inputData, responseJSON);

			moi.reactPublishStatus();
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
			moi.propertiesNoteObjects(moi.propertiesNoteObjects().filter(function(e) {
				return e !== inputData;
			}));

			moi.commandsSelectNote(null);

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

	//# REACT

	//_ reactNoteObjects

	moi.reactNoteObjects = function (noteObjects) {
		var selection = d3.select('#WKCWriteMasterContentList')
			.selectAll('.WKCWriteMasterContentListItem').data(noteObjects);
		
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
				moi.commandsSelectNote(obj);
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

	//_ reactSelectedNote

	moi.reactSelectedNote = function (inputData) {
		d3.selectAll('.WKCWriteMasterContentListItem').classed('WKCWriteMasterContentListItemSelected', function(d) {
			return d === inputData;
		});

		d3.select('#WKCWriteDetailToolbarDiscardButton').attr('disabled', inputData ? null : undefined);

		d3.select('#WKCWriteDetail').classed('WKCWriteDetailInactive', !inputData);

		WCKWriteBehaviourPropertyEditor.setValue(inputData ? inputData.WKCNoteBody : null);
		
		if (inputData) {
			WCKWriteBehaviourPropertyEditor.focus();
		}

		if (!inputData) {
			return;
		}

		moi.reactPublishStatus();
	};

	//_ reactPublishStatus

	moi.reactPublishStatus = function () {
		d3.select('#WKCWriteDetailToolbarPublishStatus').html(moi.propertiesSelectedNote().WKCNotePublishStatusIsPublished ? OLSKLocalized('WKCWriteDetailToolbarPublishStatusPublished') : null);

		d3.select('#WKCWriteDetailToolbarVisitButton')
			.classed('WKCSharedHidden', moi.propertiesSelectedNote() ? !moi.propertiesSelectedNote().WKCNotePublishStatusIsPublished : false)
			.attr('href', moi.propertiesSelectedNote() && moi.propertiesSelectedNote().WKCNotePublishStatusIsPublished ? OLSKCanonicalFor('WKCRouteRefsRead', {
				wkc_note_public_id: moi.propertiesSelectedNote().WKCNotePublicID,
			}) : undefined);

		d3.select('#WKCWriteDetailToolbarPublishButton')
			.classed('WKCSharedHidden', moi.propertiesSelectedNote() ? moi.propertiesSelectedNote().WKCNotePublishStatusIsPublished : false);
		d3.select('#WKCWriteDetailToolbarUnpublishButton')
			.classed('WKCSharedHidden', moi.propertiesSelectedNote() ? !moi.propertiesSelectedNote().WKCNotePublishStatusIsPublished : false);
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
				moi.setupBeforeUnload();

				d3.select('#WKCWrite').classed('WKCWriteLoading', false);
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

			moi.propertiesNoteObjects(responseJSON.map(function(e) {
				return Object.assign(e, {
					WKCNoteDateCreated: new Date(e.WKCNoteDateCreated),
					WKCNoteDateUpdated: new Date(e.WKCNoteDateUpdated),
				});
			}));

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
		    Esc: function () {
		      return d3.select('#WKCWriteMasterToolbarCreateButton').node().focus();
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

		document.querySelector('.CodeMirror').addEventListener('mouseup', function (event) {
			if (!event.target.className.match('cm-link'))  {
				return;
			}

			if (!!URLParse(event.target.textContent, {}).protocol) {
				open(event.target.textContent);
			}
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
