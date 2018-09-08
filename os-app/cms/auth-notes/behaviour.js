/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKControl = global.WKControl || {})));
}(this, (function (exports) { 'use strict';

	//# PROPERTIES

	//_ WKPropertiesNoteObjects

	exports.WKPropertiesNoteObjects = function (inputData, sharedData) {
		if (typeof inputData === 'undefined') {
			return d3.selectAll('.WKCAppNotesListItem').data();
		}

		exports.WKReactNoteObjects(inputData.sort(WKLogic.WKLogicListSort), sharedData);
	};

	//_ WKPropertiesSelectedNote

	exports.WKPropertiesSelectedNote = function (inputData, sharedData) {
		if (typeof inputData === 'undefined') {
			return sharedData.WKCAppNotesSharedSelectedItem;
		}

		sharedData.WKCAppNotesSharedSelectedItem = inputData;

		exports.WKReactSelectedNote(sharedData);
	};

	//# DATA

	//_ WKDataNewNoteObject

	exports.WKDataNewNoteObject = function () {
		return {
			WKCNoteDateCreated: new Date(),
			WKCNoteBody: '',
		};
	};

	//# COMMANDS

	//_ WKCommandsAlertTokenUnavailable

	exports.WKCommandsAlertTokenUnavailable = function () {
		window.alert('<%= OLSKLocalized('WKCNotesErrors').WKCAppErrorTokenUnavailable %>');
		throw new Error('WKCAppErrorTokenUnavailable');
	};

	//_ WKCommandsAlertNotesUnavailable

	exports.WKCommandsAlertNotesUnavailable = function () {
		window.alert('<%= OLSKLocalized('WKCNotesErrors').WKCAppErrorNotesUnavailable %>');
		throw new Error('WKCAppErrorNotesUnavailable');
	};

	//_ WKCommandsAddNote

	exports.WKCommandsAddNote = function (sharedData) {
		exports.WKPropertiesNoteObjects(exports.WKPropertiesNoteObjects(undefined, sharedData).concat(WKControl.WKDataNewNoteObject()), sharedData);

		exports.WKPropertiesSelectedNote(exports.WKPropertiesNoteObjects(undefined, sharedData).shift(), sharedData);
	};

	//_ WKCommandsSelectNote

	exports.WKCommandsSelectNote = function (item, sharedData) {
		exports.WKPropertiesSelectedNote(item, sharedData);
	};

	//_ WKCommandsDeleteWithConfirmation

	exports.WKCommandsDeleteWithConfirmation = function (sharedData) {
		var persistenceIsCued = !!sharedData.WKCAppNotesSharedPersistenceTask._OLSKTaskTimerID;

		clearInterval(sharedData.WKCAppNotesSharedPersistenceTask._OLSKTaskTimerID);

		if (!window.confirm('<%= OLSKLocalized('WKCAppNotesDeleteConfirmation') %>')) {
			if (persistenceIsCued) {
				OLSKTasks.OLSKTasksTimeoutForTaskObject(sharedData.WKCAppNotesSharedPersistenceTask);
			}

			return;
		};

		exports._WKCommandsDeleteWithoutConfirmation(sharedData);
	};

	//_ _WKCommandsDeleteWithoutConfirmation

	exports._WKCommandsDeleteWithoutConfirmation = function (sharedData) {
		d3.select('#WKCAppNotesPersistenceStatus').text('<%= OLSKLocalized('WKCAppNotesPersistenceStatusDeleting') %>');

		d3.json((<%- OLSKCanonicalSubstitutionFunctionFor('WKCRouteAPINotesDelete') %>)({
			wkc_note_id: sharedData.WKCAppNotesSharedSelectedItem.WKCNoteID,
		}), {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': sharedData.WKCAppNotesSharedAPIToken,
			},
		}).then(function(responseJSON) {
			WKControl.WKReactNoteObjects(d3.selectAll('.WKCAppNotesListItem').data().filter(function(e) {
				return e !== sharedData.WKCAppNotesSharedSelectedItem;
			}), sharedData);

			WKControl.WKCommandsSelectNote(d3.selectAll('.WKCAppNotesListItem').data()[0], sharedData);

			d3.select('#WKCAppNotesPersistenceStatus').text('<%= OLSKLocalized('WKCAppNotesPersistenceStatusDeleted') %>');

			setTimeout(function() {
				d3.select('#WKCAppNotesPersistenceStatus').text('');
			}, 1000);
		}, function(error) {
			d3.select('#WKCAppNotesPersistenceStatus').text('');
			
			exports.WKCommandsAlertUnableToDelete(error);
		});
	};

	//_ WKCommandsAlertUnableToDelete

	exports.WKCommandsAlertUnableToDelete = function (error) {
		window.alert('<%= OLSKLocalized('WKCAppNotesPersistenceStatusUnableToDelete') %>');

		throw error;
	};

	//# REACT

	//_ WKReactNoteObjects

	exports.WKReactNoteObjects = function (noteObjects, sharedData) {
		var selection = d3.select('#WKCAppNotesList')
			.selectAll('.WKCAppNotesListItem').data(noteObjects);
		
		selection.enter()
			.append('div')
				.attr('class', 'WKCAppNotesListItem')
				.on('click', function(obj) {
					d3.selectAll('.WKCAppNotesListItem').classed('WKCAppNotesListItemSelected', false);
					d3.select(this).classed('WKCAppNotesListItemSelected', true);

					return exports.WKCommandsSelectNote(obj, sharedData);
				})
				.merge(selection)
					.html(function(obj) {
						return [
							'<pre>',
							(obj.WKCNoteBody || '').split('\n').slice(0, 3).join('\n'),
							'</pre>',
						].join('');
					});

		selection.exit().remove();
	};

	//_ WKReactSelectedNote

	exports.WKReactSelectedNote = function (sharedData) {
		d3.select('#WKCNotesAppEditorTextarea').node().value = exports.WKPropertiesSelectedNote(undefined, sharedData) ? exports.WKPropertiesSelectedNote(undefined, sharedData).WKCNoteBody : null;
		d3.select('#WKCNotesAppEditorTextarea').attr('disabled', exports.WKPropertiesSelectedNote(undefined, sharedData) ? null : undefined);

		if (exports.WKPropertiesSelectedNote(undefined, sharedData)) {
			d3.select('#WKCNotesAppEditorTextarea').node().focus();
		}

		d3.selectAll('.WKCAppNotesListItem').classed('WKCAppNotesListItemSelected', function(d) {
			return d === exports.WKPropertiesSelectedNote(undefined, sharedData);
		});

		d3.select('#WKCAppNotesDeleteButton').attr('disabled', exports.WKPropertiesSelectedNote(undefined, sharedData) ? null : undefined);
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
