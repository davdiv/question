<script lang="ts">
	import { Capacitor } from "@capacitor/core";
	import { faDownload, faFile } from "@fortawesome/free-solid-svg-icons";
	import { clearAlerts, type Alerts } from "./alerts/alertsModel";
	import { createDownloadLink } from "./downloadLink";
	import FaIcon from "./FaIcon.svelte";
	import type { Question, QuestionValidation, Response } from "./model";
	import { defaultQuestion, chooseResponse } from "./model";
	import { formatTimestamp, formatDownloadFilename, buildTextResponse, saveResponse } from "./save";
	export let alerts: Alerts;
	export let question: Question;
	export let questionValidation: QuestionValidation;
	export let response: Response | null;

	const canDownload = !Capacitor.isNativePlatform();
	$: downloadLink = response && canDownload ? createDownloadLink(buildTextResponse(response)) : null;
	$: downloadName = response && canDownload ? formatDownloadFilename(response.timestamp) : null;

	async function responseClick() {
		response = chooseResponse(question);
		alerts = await saveResponse(response, alerts);
	}

	function reset() {
		response = null;
		alerts = clearAlerts();
		question = defaultQuestion();
	}
</script>

<div class="card mt-3">
	<div class="card-header">Réponse</div>
	<div class="card-body">
		{#if !response}
			<button type="button" class="btn btn-primary" disabled={!questionValidation.fullyValid} on:click={responseClick}>Réponse</button>
		{:else}
			<div>
				<div class="mb-1">{formatTimestamp(response.timestamp)}</div>
				<div class="mb-1 font-weight-bold">{response.question.question}</div>
				<ul>
					{#each response.question.options as option, i}
						<li class:font-weight-bold={i === response.responseIndex}>
							{option.label}
							{#if option.coefficient !== 1}
								<small class="text-secondary">(coefficient: {option.coefficient})</small>
							{/if}
						</li>
					{/each}
				</ul>
				{#if canDownload}
					<a href={$downloadLink} download={downloadName} class="btn btn-primary"><FaIcon icon={faDownload} /> Enregistrer</a>
				{/if}
				<button type="button" class="btn btn-danger" on:click={reset}><FaIcon icon={faFile} /> Nouvelle question</button>
			</div>
		{/if}
	</div>
</div>
