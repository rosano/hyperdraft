import RollupStart from './main.svelte';

const WKCEditor = new RollupStart({
	target: document.body,
	props: Object.assign({
		WKCEditorDispatchUpdate: (function _WKCEditorDispatchUpdate (inputData) {
			window.TestWKCEditorDispatchUpdate.innerHTML = parseInt(window.TestWKCEditorDispatchUpdate.innerHTML) + 1;
			window.TestWKCEditorDispatchUpdateData.innerHTML = inputData;
		}),
		WKCEditorDispatchOpen: (function _WKCEditorDispatchOpen () {}),
	}, Object.fromEntries((new window.URLSearchParams(window.location.search)).entries())),
});

window.WKCEditorBehaviour = {
	TestWKCEditorFocus () {
		WKCEditor.WKCEditorFocus();
	},
};

export default WKCEditor;
