<script>
export let KVCWriteEditorDispatchHeaderTokens;
export let KVCWriteEditorDispatchUpdate;
export let KVCWriteEditorDispatchOpen;
export let KVCWriteEditorDispatchReady;

export const KVCWriteEditorFocus = function () {
	mod.ControlConfigureEditor(function (inputData) {
		inputData.focus();
	});
};

export const KVCWriteEditorSetValue = function (inputData) {
	if (OLSK_TESTING_BEHAVIOUR()) {
		return mod.ReactValueSet(mod._ValueEditorFieldDebugValue = inputData);
	}
	
	mod.ControlConfigureEditor(function () {
		mod._ValueEditorInstance.setValue(inputData);
		mod._ValueEditorInstance.getDoc().clearHistory();
	});
};

export const KVCWriteEditorSetCursor = function (param1, param2) {
	mod.ControlConfigureEditor(function (inputData) {
		inputData.setCursor(CodeMirror.Pos(param1, param2));
	});
};

export const KVCWriteEditorScrollIntoView = function (param1, param2) {
	mod.ControlConfigureEditor(function (inputData) {
		inputData.scrollIntoView(CodeMirror.Pos(param1, param2), 300);
	});
};

export const KVCWriteEditorSetSelection = function (param1, param2, param3, param4) {
	mod.ControlConfigureEditor(function (inputData) {
		inputData.setSelection(CodeMirror.Pos(param1, param2), CodeMirror.Pos(param3, param4));
	});
};

import { OLSK_TESTING_BEHAVIOUR } from 'OLSKTesting';
import KVCWriteEditorLogic from './ui-logic.js';

const mod = {

	// VALUE

	_ValueEditorElement: undefined,

	_ValueEditorInstance: undefined,

	_ValueEditorPostInitializeQueue: [],
	
	_ValueEditorFieldDebugValue: '',

	// INTERFACE

	InterfaceWindowDidKeydown (event) {
		if (event.key !== 'Escape') {
			return;
		}

		if (!mod._ValueEditorInstance) {
			return;
		}

		if (mod._ValueEditorInstance.getDoc().listSelections().length <= 1) {
			return;
		}

		mod._ValueEditorInstance.setSelections(mod._ValueEditorInstance.getDoc().listSelections().slice(0, 1));

		event.stopPropagation();
	},

	InterfaceEditorDidTouchDown (instance, event) {
		if (!event.target.className.match('cm-link'))  {
			return;
		}

		event.preventDefault();
	},

	InterfaceEditorDidTouchUp (event) {
		if (!event.target.className.match('cm-link'))  {
			return;
		}

		mod.ControlOpenTextObject(event.target.textContent);
	},

	InterfaceEditorFieldDebugDidInput () {
		mod.ReactValueInput(this.value)
	},

	// CONTROL

	ControlConfigureEditor (inputData) {
		if (OLSK_TESTING_BEHAVIOUR()) {
			return;
		}
		
		if (mod._ValueEditorInstance) {
			return inputData(mod._ValueEditorInstance);
		};

		mod._ValueEditorPostInitializeQueue.push(inputData);
	},

	ControlOpenCursorObject (inputData) {
		const cursor = mod._ValueEditorInstance.getCursor();

		const currentObject = KVCWriteEditorLogic.KVCWriteEditorLineObjectsFor(mod._ValueEditorInstance.getLineTokens(cursor.line)).filter(function (e) {
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

		const match = inputData.match(/\[\[(.*)\]\]/).pop();

		if (!match) {
			return;
		}

		event.stopPropagation();

		KVCWriteEditorDispatchOpen(match);
	},

	// REACT

	ReactValueSet (inputData) {
		mod._ReactValueHeaderTokens(inputData);
	},

	ReactValueInput (inputData) {
		KVCWriteEditorDispatchUpdate(inputData);

		mod._ReactValueHeaderTokens(inputData);
	},

	_ReactValueHeaderTokens (inputData) {
		KVCWriteEditorDispatchHeaderTokens(KVCWriteEditorLogic.KVCWriteEditorHeaderTokensFrom(inputData.split('\n').map(function (e, i) {
			return KVCWriteEditorLogic.KVCWriteEditorLineObjectsFor(OLSK_TESTING_BEHAVIOUR() ? KVCWriteEditorLogic.uStubLineTokensFor(e) : mod._ValueEditorInstance.getLineTokens(i));
		})));
	},

	// SETUP

	SetupEverything () {
		mod.SetupEditor();
	},

	SetupEditor () {
		if (OLSK_TESTING_BEHAVIOUR()) {
 			return KVCWriteEditorDispatchReady();
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

		mod._ValueEditorInstance.on('change', function (instance, changeObject) {
			if (changeObject.origin === 'setValue') {
				return mod.ReactValueSet(instance.getValue());
			}

			mod.ReactValueInput(instance.getValue());
		});

		mod._ValueEditorPostInitializeQueue.splice(0, mod._ValueEditorPostInitializeQueue.length).forEach(function(e) {
			return e(mod._ValueEditorInstance);
		});

		KVCWriteEditorDispatchReady();

		mod._ValueEditorInstance.on('keydown', function (instance, event) {
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

		mod._ValueEditorInstance.on('mousedown', mod.InterfaceEditorDidTouchDown);

		mod._ValueEditorInstance.on('touchstart', mod.InterfaceEditorDidTouchDown);

		document.querySelector('.CodeMirror').addEventListener('mouseup', mod.InterfaceEditorDidTouchUp);

		document.querySelector('.CodeMirror').addEventListener('touchend', mod.InterfaceEditorDidTouchUp);
	},

	// LIFECYCLE

	LifecycleComponentDidMount () {
		mod.SetupEverything();
	},

};

import { onMount } from 'svelte';
onMount(mod.LifecycleComponentDidMount);
</script>
<svelte:window on:keydown={ mod.InterfaceWindowDidKeydown } />

<div class="KVCWriteEditor">
	{#if OLSK_TESTING_BEHAVIOUR()}
		<textarea class="KVCWriteEditorFieldDebug" on:input={ mod.InterfaceEditorFieldDebugDidInput }>{ mod._ValueEditorFieldDebugValue }</textarea>
	{/if}
	
	<textarea bind:this={ mod._ValueEditorElement }></textarea>
</div>
