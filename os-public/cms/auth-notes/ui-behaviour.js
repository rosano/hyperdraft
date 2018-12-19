/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKBehaviour = global.WKBehaviour || {})));
}(this, (function (exports) { 'use strict';

	var moi = exports;

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
			return d3.selectAll('.WKCAppNotesMasterContentListItem').data();
		}

		moi.reactNoteObjects(inputData.sort(WKLogic.WKLogicListSort));
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

	//_ interfaceAddButtonDidClick

	moi.interfaceAddButtonDidClick = function () {
		moi.commandsAddNote();
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
		window.alert(OLSKLocalized('WKCAppNotesErrorNotesUnavailable'));

		throw new Error('WKCAppNotesErrorNotesUnavailable');
	};

	//_ commandsAddNote

	moi.commandsAddNote = function () {
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
				moi.reactPersistenceStatus(OLSKLocalized('WKCAppNotesDetailToolbarPersistenceStatusSaving'));
			}

			if (!inputData.WKCNoteID) {
				return moi._commandsPersistNoteCreate(inputData, resolve, reject);
			}

			return moi._commandsPersistNoteUpdate(inputData, resolve, reject);
			
		})).then(function() {
			if (inputData === moi.propertiesSelectedNote()) {
				moi.reactPersistenceStatus(OLSKLocalized('WKCAppNotesDetailToolbarPersistenceStatusSaved'), true);
			}

			moi.propertiesUnsavedNotes().splice(moi.propertiesUnsavedNotes().indexOf(inputData), 1);
		}, function(error) {
			if (window.confirm(OLSKLocalized('WKCAppNotesErrorPersistenceSaveDidFail'))) {
				return moi.commandsPersistNote(inputData);
			};

			if (inputData === moi.propertiesSelectedNote()) {
				moi.reactPersistenceStatus(OLSKLocalized('WKCAppNotesDetailToolbarPersistenceStatusUnableToSave'));
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
		d3.select('#WKCAppNotesDetailToolbarPublishStatus').text(OLSKLocalized('WKCAppNotesDetailToolbarPublishStatusPublishing'));

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
			if (window.confirm(OLSKLocalized('WKCAppNotesErrorPublishDidFail'))) {
				return moi.commandsPublishNote(inputData);
			};

			d3.select('#WKCAppNotesDetailToolbarPublishStatus').text(OLSKLocalized('WKCAppNotesDetailToolbarPublishStatusUnableToPublish'));

			throw error;
		});
	};

	//_ commandsDeleteNoteWithConfirmation

	moi.commandsDeleteNoteWithConfirmation = function (inputData) {
		var persistenceIsCued = !!moi.propertiesPersistenceTask()._OLSKTaskTimerID;

		moi.commandsPersistenceTaskStop();

		if (!window.confirm(OLSKLocalized('WKCAppNotesDeleteConfirmation'))) {
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

		moi.reactPersistenceStatus(OLSKLocalized('WKCAppNotesDetailToolbarPersistenceStatusDeleting'));

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

			moi.reactPersistenceStatus(OLSKLocalized('WKCAppNotesDetailToolbarPersistenceStatusDeleted'), true);
		}, function(error) {
			if (window.confirm(OLSKLocalized('WKCAppNotesErrorPersistenceDeleteDidFail'))) {
				return moi._commandsDeleteNoteWithoutConfirmation(inputData);
			};

			moi.reactPersistenceStatus(OLSKLocalized('WKCAppNotesDetailToolbarPersistenceStatusUnableToDelete'));

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
		var selection = d3.select('#WKCAppNotesMasterContent')
			.selectAll('.WKCAppNotesMasterContentListItem').data(noteObjects);
		
		var parentElement = selection.enter()
			.append('div')
				.attr('class', 'WKCAppNotesMasterContentListItem')
				.classed('WKCSharedElementTappable', true);
		parentElement.append('pre').attr('class', 'WKCAppNotesMasterContentListItemSnippet');
		parentElement = parentElement.merge(selection);

		parentElement
			.on('click', function(obj) {
				moi.commandsSelectNote(obj);
			});
		parentElement.select('.WKCAppNotesMasterContentListItemSnippet').text(function(obj) {
			return (obj.WKCNoteBody || '').split('\n').slice(0, 3).join('\n');
		});

		selection.exit().remove();
	};

	//_ reactSelectedNote

	moi.reactSelectedNote = function () {
		d3.select('#WKCNotesAppEditorTextarea').node().value = moi.propertiesSelectedNote() ? moi.propertiesSelectedNote().WKCNoteBody : null;
		d3.select('#WKCNotesAppEditorTextarea').attr('disabled', moi.propertiesSelectedNote() ? null : true);

		if (moi.propertiesSelectedNote()) {
			d3.select('#WKCNotesAppEditorTextarea').node().focus();
		}

		d3.selectAll('.WKCAppNotesMasterContentListItem').classed('WKCAppNotesMasterContentListItemSelected', function(d) {
			return d === moi.propertiesSelectedNote();
		});

		d3.select('#WKCAppNotesDetailToolbarDiscardButton').attr('disabled', moi.propertiesSelectedNote() ? null : undefined);
		d3.select('#WKCAppNotesDetailToolbarPublishButton').attr('disabled', moi.propertiesSelectedNote() ? null : undefined);

		if (!moi.propertiesSelectedNote()) {
			return;
		}

		moi.reactPublishStatus();
	};

	//_ reactPublishStatus

	moi.reactPublishStatus = function () {
		d3.select('#WKCAppNotesDetailToolbarPublishStatus').html(moi.propertiesSelectedNote().WKCNoteIsPublished ? OLSKLocalized('WKCAppNotesDetailToolbarPublishStatusPublished') + '<a href="/' + moi.propertiesSelectedNote().WKCNotePublicID + '" target="_blank">/' + moi.propertiesSelectedNote().WKCNotePublicID + '</a>': null);
	};

	//_ reactPersistenceStatus

	moi.reactPersistenceStatus = function (inputData, shouldClear) {
		d3.select('#WKCAppNotesDetailToolbarPersistenceStatus').text(inputData);

		if (!shouldClear) {
			return;
		}

		setTimeout(function() {
			d3.select('#WKCAppNotesDetailToolbarPersistenceStatus').text(null);
		}, 1000);
	};

	//# SETUP

	//_ setupEverything

	moi.setupEverything = function () {
		moi.setupAPIToken(function () {
			moi.setupNoteObjects(function() {
				moi.setupPersistenceTask();

				d3.select('#WKCAppNotes').classed('WKCAppNotesLoading', false);
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

	Object.defineProperty(exports, '__esModule', { value: true });

})));
