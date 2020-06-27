<script>
export let KVCWriteMasterListItemTitle;
export let KVCWriteMasterListItemSnippet;
</script>

<strong class="KVCWriteMasterListItemTitle" aria-hidden="true">{ KVCWriteMasterListItemTitle }</strong>
<span class="KVCWriteMasterListItemSnippet" aria-hidden="true">{ KVCWriteMasterListItemSnippet }</span>

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
