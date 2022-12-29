<script lang="ts">
	import { removeAlert, type Alerts } from "./alertsModel";

	export let alerts: Alerts;
</script>

{#each alerts as alert, i}
	<div class="alert alert-{alert.type}">
		<button type="button" class="close" on:click={() => (alerts = removeAlert(alerts, i))}>
			<span aria-hidden="true">&times;</span>
		</button>
		{alert.message}
	</div>
{/each}
