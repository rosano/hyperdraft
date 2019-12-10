import RollupStart from './main.svelte';

const KVCWriteMasterListItem = new RollupStart({
	target: document.body,
	props: Object.assign({
	}, Object.fromEntries((new window.URLSearchParams(window.location.search)).entries())),
});

export default KVCWriteMasterListItem;
