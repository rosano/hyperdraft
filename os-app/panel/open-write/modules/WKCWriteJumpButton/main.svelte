<script>
export let inputData = [];
export let didClick = null;
function interfaceButtonDidClick() {
	setTimeout(function () {
		window.Launchlet.instanceCreate(inputData, {
			runMode: window.Launchlet.kRunModeJump,
		});
	});
}
</script>

<button on:click={ interfaceButtonDidClick  } class="WKCWriteJumpButton WKCSharedToolbarButton WKCSharedElementTappable WKCSharedButtonNoStyle" disabled={ !inputData.length } accesskey="r" style="background-image: url('/panel/_shared/ui-assets/wIKWriteJump.svg')" title="Jump"></button>

<style>
</style>
