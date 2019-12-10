import RollupStart from './main.svelte';

const KVCWriteFooter = new RollupStart({
	target: document.body,
	props: Object.assign({
		KVCWriteFooterDispatchStorage: (function _KVCWriteFooterDispatchStorage () {
			window.TestKVCWriteFooterDispatchStorage.innerHTML = parseInt(window.TestKVCWriteFooterDispatchStorage.innerHTML) + 1;
		}),
		_KVCWriteFooterDispatchExport: (function __KVCWriteFooterDispatchExport () {}),
		_KVCWriteFooterDispatchImport: (function __KVCWriteFooterDispatchImport () {}),
	}, Object.fromEntries(Array.from((new window.URLSearchParams(window.location.search)).entries()))),
});

export default KVCWriteFooter;
