<div class="OLSKToolbarElementGroup">
	<slot></slot>
</div>

<style>
.OLSKToolbarElementGroup {
	margin: 10px 2px;
}

.OLSKToolbarElementGroup :global(button) {
	margin: 0 2px;
}

@media screen and (max-width: 760px) {

.OLSKToolbarElementGroup :global(button) {
	margin: 0 8px;
}

}
</style>
