<script lang="ts">
	import { clearAlerts, type Alerts } from "./alerts/alertsModel";
	import type { Response } from "./model";
	import { defaultQuestion, validate } from "./model";
	import AlertsPanel from "./alerts/Alerts.svelte";
	import QuestionPanel from "./Question.svelte";
	import SimulationPanel from "./Simulation.svelte";
	import SaveSettingsPanel from "./SaveSettings.svelte";
	import ResponsePanel from "./Response.svelte";
	let alerts: Alerts = clearAlerts();
	let question = defaultQuestion();
	$: questionValidation = validate(question);
	let response: Response | null = null;
</script>

<div class="container-fluid mt-3">
	<AlertsPanel bind:alerts />
	{#if !response}
		<QuestionPanel bind:question {questionValidation} />
		<SimulationPanel {question} {questionValidation} />
		<SaveSettingsPanel />
	{/if}
	<ResponsePanel bind:alerts bind:question bind:response {questionValidation} />
</div>

<div class="container-fluid mt-3">
	<p class="text-muted">
		Ce programme est un logiciel libre, sous license MIT. Son code source est <a target="_blank" rel="noopener noreferrer" href="https://github.com/davdiv/question">disponible ici</a>.
	</p>
</div>
