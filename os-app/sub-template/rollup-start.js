import RollupStart from './main.svelte';

const KVCWriteTemplate = new RollupStart({
	target: document.body,
	props: Object.assign({
		KVCWriteTemplateData: Math.random().toString(),
		KVCWriteTemplateDispatchUpdate: (function (inputData) {
			window.TestKVCWriteTemplateDispatchUpdate.innerHTML = parseInt(window.TestKVCWriteTemplateDispatchUpdate.innerHTML) + 1;
			window.TestKVCWriteTemplateDispatchUpdateData.innerHTML = inputData;
		}),
	}, Object.fromEntries((new window.URLSearchParams(window.location.search)).entries())),
});

export default KVCWriteTemplate;
