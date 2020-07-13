import RollupStart from './main.svelte';

const KVCWriteMasterListItem = new RollupStart({
	target: document.body,
	props: Object.assign({
		KVCWriteMasterListItemDispatchTitle: (function _KVCWriteMasterListItemDispatchTitle (inputData) {
			return `_KVCWriteMasterListItemDispatchTitle(${ inputData })`;
		}),
		KVCWriteMasterListItemDispatchSnippet: (function _KVCWriteMasterListItemDispatchSnippet (inputData) {
			return `_KVCWriteMasterListItemDispatchSnippet(${ inputData })`;
		}),
	}, Object.fromEntries(Array.from((new window.URLSearchParams(window.location.search)).entries()).map(function (e) {
		if (e[0] === 'KVCWriteMasterListItemObject') {
			e[1] = JSON.parse(e[1]);
		}

		return e;
	}))),
});

export default KVCWriteMasterListItem;
