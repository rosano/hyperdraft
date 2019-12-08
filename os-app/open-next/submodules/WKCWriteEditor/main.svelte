<script>
export let WKCWriteEditorInitialValue;
export let WKCWriteEditorDispatchUpdate;
export let WKCWriteEditorDispatchOpen;
export let WKCWriteEditorDispatchReady;

export const WKCWriteEditorFocus = function () {
	mod.ControlConfigureEditor(function (inputData) {
		inputData.focus();
	});
};

export const WKCWriteEditorSetDocument = function (inputData) {
	mod._ValueEditorInstance.setValue(inputData);
	mod._ValueEditorInstance.getDoc().clearHistory();
};

export const WKCWriteEditorSetCursor = function (param1, param2) {
	mod.ControlConfigureEditor(function (inputData) {
		inputData.setCursor(CodeMirror.Pos(param1, param2));
	});
};

import { OLSK_TESTING_BEHAVIOUR } from 'OLSKTesting';
import WKCWriteEditorLogic from './ui-logic.js';

const mod = {

	// VALUE

	_ValueEditorElement: undefined,

	_ValueEditorInstance: undefined,

	_ValueEditorPostInitializeQueue: [],

	// INTERFACE

	InterfaceEditorFieldDebugDidInput () {
		WKCWriteEditorDispatchUpdate(this.value);
	},

	// CONTROL

	ControlConfigureEditor (inputData) {
		if (mod._ValueEditorInstance) {
			return inputData(mod._ValueEditorInstance);
		};

		mod._ValueEditorPostInitializeQueue.push(inputData);
	},

	ControlOpenCursorObject (inputData) {
		let cursor = mod._ValueEditorInstance.getCursor();

		let currentObject = WKCWriteEditorLogic.WKCWriteEditorLineObjectsFor(mod._ValueEditorInstance.getLineTokens(cursor.line)).filter(function (e) {
			return Math.max(e.start, Math.min(e.end, cursor.ch)) === cursor.ch;
		}).shift();

		if (!currentObject.type.match('link')) {
			return;
		}

		mod.ControlOpenTextObject(currentObject.string);
	},

	ControlOpenTextObject (inputData) {
		if (URLParse(inputData, {}).protocol) {
			return window.open(inputData, '_blank');
		}

		let match = inputData.match(/\[\[(.*)\]\]/).pop();
		if (!match) {
			return;
		}

		event.stopPropagation();

		WKCWriteEditorDispatchOpen(match);
	},

	// SETUP

	SetupEverything () {
		mod.SetupEditor();
	},

	SetupEditor () {
		if (OLSK_TESTING_BEHAVIOUR()) {
			return;
		}

		mod._ValueEditorInstance = CodeMirror.fromTextArea(mod._ValueEditorElement, {
			mode: {
			  name: 'gfm',
			  gitHubSpice: false,
			  emoji: false,
			},
			
			lineNumbers: false,
			lineWrapping: true,

			extraKeys: {
			  Enter: 'newlineAndIndentContinueMarkdownList',
			  'Cmd-Enter': mod.ControlOpenCursorObject,
			  'Ctrl-Enter': mod.ControlOpenCursorObject,
			  'Cmd-H' (event) {
			  	return event.preventDefault();
			  },
			  Esc () {}, // overwrite to control via other binding
			  Tab: false,
			},

			theme: 'wkc',

			keyMap: 'sublime',
		});

		mod._ValueEditorInstance.setValue(WKCWriteEditorInitialValue);

		mod._ValueEditorInstance.on('change', function (instance, changeObject) {
			if (changeObject.origin === 'setValue') {
				return;
			}

			WKCWriteEditorDispatchUpdate(instance.getValue());
		});

		mod._ValueEditorPostInitializeQueue.splice(0, mod._ValueEditorPostInitializeQueue.length).forEach(function(e) {
			return e(mod._ValueEditorInstance);
		});

		WKCWriteEditorDispatchReady();
	},

	// LIFECYCLE

	LifecycleComponentDidMount () {
		mod.SetupEverything();
	},

};

import { onMount } from 'svelte';
onMount(mod.LifecycleComponentDidMount);
</script>

<div class="WKCWriteEditor">
	{#if OLSK_TESTING_BEHAVIOUR()}
		<textarea class="WKCWriteEditorFieldDebug" on:input={ mod.InterfaceEditorFieldDebugDidInput }>{ WKCWriteEditorInitialValue }</textarea>
	{/if}
	
	<textarea bind:this={ mod._ValueEditorElement }></textarea>
</div>
