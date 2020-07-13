<script>
export let KVCWriteMasterListItemObject;
export let KVCWriteMasterListItemDispatchTitle;
export let KVCWriteMasterListItemDispatchSnippet;
</script>

<strong class="KVCWriteMasterListItemTitle" aria-hidden="true">{ KVCWriteMasterListItemDispatchTitle(KVCWriteMasterListItemObject.KVCNoteBody) }</strong>
<span class="KVCWriteMasterListItemSnippet" aria-hidden="true">{ KVCWriteMasterListItemDispatchSnippet(KVCWriteMasterListItemObject.KVCNoteBody) }</span>

<style>	

:global(.KVCWriteMasterListItem) {
	min-height: 46px;
	padding: 10px;
	border-bottom: var(--WKCBorderStyle);

	overflow: hidden;
	text-overflow: ellipsis;

	/* prevent breaking from long urls */
	overflow-wrap: break-word;
	word-wrap: break-word;
	word-break: break-word;
	hyphens: auto;
}

.KVCWriteMasterListItemTitle {
	display: inline-block;
}

.KVCWriteMasterListItemSnippet {
	display: block;
	margin-top: 5px;
}
</style>
