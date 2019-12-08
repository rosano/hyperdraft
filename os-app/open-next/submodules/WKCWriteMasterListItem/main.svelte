<script>
export let WKCWriteMasterListItemAccessibilitySummary;
export let WKCWriteMasterListItemTitle;
export let WKCWriteMasterListItemSnippet;
</script>

<div class="WKCWriteMasterListItem">

<strong class="WKCWriteMasterListItemAccessibilitySummary OLSKScreenReaderOnly">{ WKCWriteMasterListItemAccessibilitySummary }</strong>
<strong class="WKCWriteMasterListItemTitle" aria-hidden="true">{ WKCWriteMasterListItemTitle }</strong>
<span class="WKCWriteMasterListItemSnippet" aria-hidden="true">{ WKCWriteMasterListItemSnippet }</span>

</div>

<style>	

.WKCWriteMasterListItem {
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

.WKCWriteMasterListItemTitle {
	display: inline-block;
}

.WKCWriteMasterListItemSnippet {
	display: block;
	margin-top: 5px;
}
</style>
