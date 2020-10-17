import RollupStart from './main.svelte';

const KVCWriteMasterListItem = new RollupStart({
	target: document.body,
	props: Object.assign({
		KVCWriteMasterListItemDispatchTitle: (function  (inputData) {
			return `_KVCWriteMasterListItemDispatchTitle(${ inputData })`;
		}),
		KVCWriteMasterListItemDispatchSnippet: (function  (inputData) {
			return `_KVCWriteMasterListItemDispatchSnippet(${ inputData })`;
		}),
	}, Object.fromEntries(Array.from((new window.URLSearchParams(window.location.search)).entries()).map(function (e) {
		if (['KVCWriteMasterListItemObject', 'KVCNoteIsArchived'].includes(e[0])) {
			e[1] = JSON.parse(e[1]);
		}

		return e;
	}))),
});

export default KVCWriteMasterListItem;
