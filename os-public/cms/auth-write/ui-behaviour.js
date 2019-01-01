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

	var WKBehaviourPropertyAPIToken;
	var WKBehaviourPropertySelectedNote;
	var WKBehaviourPropertyPersistenceTask;
	var WKBehaviourPropertyUnsavedNotes;

	//# PROPERTIES

	//_ propertiesAPIToken

	moi.propertiesAPIToken = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKBehaviourPropertyAPIToken;
		}

		WKBehaviourPropertyAPIToken = inputData;
	};

	//_ propertiesNoteObjects

	moi.propertiesNoteObjects = function (inputData) {
		if (typeof inputData === 'undefined') {
			return d3.selectAll('.WKCNotesMasterContentListItem').data();
		}

		moi.reactNoteObjects(inputData.sort(WKCWriteLogic.WKCWriteLogicListSort));
	};

	//_ propertiesSelectedNote

	moi.propertiesSelectedNote = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKBehaviourPropertySelectedNote;
		}

		WKBehaviourPropertySelectedNote = inputData === null ? undefined : inputData;

		moi.reactSelectedNote();
	};

	//_ propertiesUnsavedNotes

	moi.propertiesUnsavedNotes = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKBehaviourPropertyUnsavedNotes;
		}

		WKBehaviourPropertyUnsavedNotes = inputData === null ? undefined : inputData;
	};

	//_ propertiesPersistenceTask

	moi.propertiesPersistenceTask = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKBehaviourPropertyPersistenceTask;
		}

		WKBehaviourPropertyPersistenceTask = inputData;
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

	//_ interfaceEditorTextareaDidReceiveInput

	moi.interfaceEditorTextareaDidReceiveInput = function () {
		moi.commandsUpdateText(this.value);
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
		window.alert(OLSKLocalized('WKCNotesErrorNotesUnavailable'));

		throw new Error('WKCNotesErrorNotesUnavailable');
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

	//_ commandsUpdateText

	moi.commandsUpdateText = function (inputData) {
		moi.commandsPersistenceTaskStop();
		moi.commandsPersistenceTaskStart();

		Object.assign(moi.propertiesSelectedNote(), {
			WKCNoteBody: inputData,
			WKCNoteDateUpdated: new Date(),
		});

		if (moi.propertiesUnsavedNotes().indexOf(moi.propertiesSelectedNote()) == -1) {
			moi.propertiesUnsavedNotes().push(moi.propertiesSelectedNote());
		}

		moi.reactNoteObjects(moi.propertiesNoteObjects());
	};

	//_ commandsPersistenceTaskStop

	moi.commandsPersistenceTaskStop = function () {
		clearInterval(moi.propertiesPersistenceTask()._OLSKTaskTimerID);
	};

	//_ commandsPersistenceTaskStart

	moi.commandsPersistenceTaskStart = function () {
		OLSKTasks.OLSKTasksTimeoutForTaskObject(moi.propertiesPersistenceTask());
	};

	//_ commandsPersistUnsavedNotes

	moi.commandsPersistUnsavedNotes = function () {
		moi.propertiesUnsavedNotes().forEach(function(obj) {
			moi.commandsPersistNote(obj);
		});
	};

	//_ commandsPersistNote

	moi.commandsPersistNote = function (inputData) {
		(new Promise(function(resolve, reject) {
			if (inputData === moi.propertiesSelectedNote()) {
				moi.reactPersistenceStatus(OLSKLocalized('WKCNotesDetailToolbarPersistenceStatusSaving'));
			}

			if (!inputData.WKCNoteID) {
				return moi._commandsPersistNoteCreate(inputData, resolve, reject);
			}

			return moi._commandsPersistNoteUpdate(inputData, resolve, reject);
			
		})).then(function() {
			if (inputData === moi.propertiesSelectedNote()) {
				moi.reactPersistenceStatus(OLSKLocalized('WKCNotesDetailToolbarPersistenceStatusSaved'), true);
			}

			moi.propertiesUnsavedNotes().splice(moi.propertiesUnsavedNotes().indexOf(inputData), 1);
		}, function(error) {
			if (window.confirm(OLSKLocalized('WKCNotesErrorPersistenceSaveDidFail'))) {
				return moi.commandsPersistNote(inputData);
			};

			if (inputData === moi.propertiesSelectedNote()) {
				moi.reactPersistenceStatus(OLSKLocalized('WKCNotesDetailToolbarPersistenceStatusUnableToSave'));
			}

			throw error;
		});
	};

	//_ _commandsPersistNoteCreate

	moi._commandsPersistNoteCreate = function (inputData, resolve, reject) {
		return resolve(d3.json(OLSKCanonicalFor('WKCRouteAPINotesCreate'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify(inputData),
		}).then(function(responseJSON) {
			Object.assign(inputData, responseJSON);
		}, reject));
	};

	//_ _commandsPersistNoteUpdate

	moi._commandsPersistNoteUpdate = function (inputData, resolve, reject) {
		return resolve(d3.json(OLSKCanonicalFor('WKCRouteAPINotesUpdate', {
			wkc_note_id: inputData.WKCNoteID,
		}), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify(inputData),
		}));
	};

	//_ commandsPublishNote

	moi.commandsPublishNote = function (inputData) {
		d3.select('#WKCNotesDetailToolbarPublishStatus').text(OLSKLocalized('WKCNotesDetailToolbarPublishStatusPublishing'));

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
			moi.reactPublishStatus();
		}, function(error) {
			if (window.confirm(OLSKLocalized('WKCNotesErrorPublishDidFail'))) {
				return moi.commandsPublishNote(inputData);
			};

			d3.select('#WKCNotesDetailToolbarPublishStatus').text(OLSKLocalized('WKCNotesDetailToolbarPublishStatusUnableToPublish'));

			throw error;
		});
	};

	//_ commandsDeleteNoteWithConfirmation

	moi.commandsDeleteNoteWithConfirmation = function (inputData) {
		var persistenceIsCued = !!moi.propertiesPersistenceTask()._OLSKTaskTimerID;

		moi.commandsPersistenceTaskStop();

		if (!window.confirm(OLSKLocalized('WKCNotesDeleteConfirmation'))) {
			if (persistenceIsCued) {
				moi.commandsPersistenceTaskStart();
			}

			return;
		};

		moi._commandsDeleteNoteWithoutConfirmation(inputData);
	};

	//_ _commandsDeleteNoteWithoutConfirmation

	moi._commandsDeleteNoteWithoutConfirmation = function (inputData) {
		var persistenceIsCued = !!moi.propertiesPersistenceTask()._OLSKTaskTimerID;

		moi.reactPersistenceStatus(OLSKLocalized('WKCNotesDetailToolbarPersistenceStatusDeleting'));

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

			moi.propertiesUnsavedNotes(moi.propertiesUnsavedNotes().filter(function(e) {
				return e !== inputData;
			}));

			moi.commandsSelectNote(null);

			moi.reactPersistenceStatus(OLSKLocalized('WKCNotesDetailToolbarPersistenceStatusDeleted'), true);
		}, function(error) {
			if (window.confirm(OLSKLocalized('WKCNotesErrorPersistenceDeleteDidFail'))) {
				return moi._commandsDeleteNoteWithoutConfirmation(inputData);
			};

			moi.reactPersistenceStatus(OLSKLocalized('WKCNotesDetailToolbarPersistenceStatusUnableToDelete'));

			throw error;
		}).finally(function() {
			if (persistenceIsCued) {
				moi.commandsPersistenceTaskStart();
			}
		});
	};

	//# REACT

	//_ reactNoteObjects

	moi.reactNoteObjects = function (noteObjects) {
		var selection = d3.select('#WKCNotesMasterContent')
			.selectAll('.WKCNotesMasterContentListItem').data(noteObjects);
		
		var parentElement = selection.enter()
			.append('div')
				.attr('class', 'WKCNotesMasterContentListItem')
				.classed('WKCSharedElementTappable', true);
		parentElement.append('pre').attr('class', 'WKCNotesMasterContentListItemSnippet');
		parentElement = parentElement.merge(selection);

		parentElement
			.on('click', function(obj) {
				moi.commandsSelectNote(obj);
			});
		parentElement.select('.WKCNotesMasterContentListItemSnippet').text(function(obj) {
			return (obj.WKCNoteBody || '').split('\n').slice(0, 3).join('\n');
		});

		selection.exit().remove();
	};

	//_ reactSelectedNote

	moi.reactSelectedNote = function () {
		d3.select('#WKCNotesDetailContentTextarea').node().value = moi.propertiesSelectedNote() ? moi.propertiesSelectedNote().WKCNoteBody : null;
		d3.select('#WKCNotesDetailContentTextarea').attr('disabled', moi.propertiesSelectedNote() ? null : true);

		d3.selectAll('.WKCNotesMasterContentListItem').classed('WKCNotesMasterContentListItemSelected', function(d) {
			return d === moi.propertiesSelectedNote();
		});

		d3.select('#WKCNotesDetailToolbarDiscardButton').attr('disabled', moi.propertiesSelectedNote() ? null : undefined);
		d3.select('#WKCNotesDetailToolbarPublishButton').attr('disabled', moi.propertiesSelectedNote() ? null : undefined);

		d3.select('#WKCNotesDetail').classed('WKCNotesDetailInactive', !moi.propertiesSelectedNote());
		
		if (moi.propertiesSelectedNote()) {
			d3.select('#WKCNotesDetailContentTextarea').node().focus();
		}

		if (!moi.propertiesSelectedNote()) {
			return;
		}

		moi.reactPublishStatus();
	};

	//_ reactPublishStatus

	moi.reactPublishStatus = function () {
		d3.select('#WKCNotesDetailToolbarPublishStatus').html(moi.propertiesSelectedNote().WKCNoteIsPublished ? OLSKLocalized('WKCNotesDetailToolbarPublishStatusPublished') + '<a href="/' + moi.propertiesSelectedNote().WKCNotePublicID + '" target="_blank">/' + moi.propertiesSelectedNote().WKCNotePublicID + '</a>': null);
	};

	//_ reactPersistenceStatus

	moi.reactPersistenceStatus = function (inputData, shouldClear) {
		d3.select('#WKCNotesDetailToolbarPersistenceStatus').text(inputData);

		if (!shouldClear) {
			return;
		}

		setTimeout(function() {
			d3.select('#WKCNotesDetailToolbarPersistenceStatus').text(null);
		}, 1000);
	};

	//# SETUP

	//_ setupEverything

	moi.setupEverything = function () {
		moi.setupAPIToken(function () {
			moi.setupNoteObjects(function() {
				moi.setupPersistenceTask();

				d3.select('#WKCNotes').classed('WKCNotesLoading', false);
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

	//_ setupPersistenceTask

	moi.setupPersistenceTask = function () {
		moi.propertiesUnsavedNotes([]);

		moi.propertiesPersistenceTask({
			OLSKTaskName: 'WKCTasksEditorPersistence',
			OLSKTaskFireTimeInterval: 3,
			OLSKTaskShouldBePerformed: function() {
				return true;
			},
			OLSKTaskFireLimit: 1,
			OLSKTaskCallback: function () {
				moi.commandsPersistUnsavedNotes();

				delete moi.propertiesPersistenceTask()._OLSKTaskTimerID;
			},
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
