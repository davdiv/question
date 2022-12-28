<script lang="ts">
	import { faDownload, faFile } from "@fortawesome/free-solid-svg-icons";
	import { createDownloadLink } from "./downloadLink";
	import FaIcon from "./FaIcon.svelte";
	import type { Question, QuestionValidation, Response } from "./model";
	import {
		defaultQuestion,
		chooseResponse,
		formatTimestamp,
		formatFilename,
		buildTextResponse
	} from "./model";
	export let question: Question;
	export let questionValidation: QuestionValidation;
	export let response: Response | null;

	$: downloadLink = response
		? createDownloadLink(buildTextResponse(response))
		: null;
	$: downloadName = response ? formatFilename(response.timestamp) : null;

	function reset() {
		response = null;
		question = defaultQuestion();
	}
</script>

<div class="card mt-3">
	<div class="card-header">Réponse</div>
	<div class="card-body">
		{#if !response}
			<button
				type="button"
				class="btn btn-primary"
				disabled={!questionValidation.fullyValid}
				on:click={() => (response = chooseResponse(question))}>Réponse</button
			>
		{:else}
			<div>
				<div class="mb-1">{formatTimestamp(response.timestamp)}</div>
				<div class="mb-1 font-weight-bold">{response.question.question}</div>
				<ul>
					{#each response.question.options as option, i}
						<li class:font-weight-bold={i === response.responseIndex}>
							{option.label}
							{#if option.coefficient !== 1}
								<small class="text-secondary"
									>(coefficient: {option.coefficient})</small
								>
							{/if}
						</li>
					{/each}
				</ul>
				<a href={$downloadLink} download={downloadName} class="btn btn-primary"
					><FaIcon icon={faDownload} /> Enregistrer</a
				>
				<button type="button" class="btn btn-danger" on:click={reset}
					><FaIcon icon={faFile} /> Nouvelle question</button
				>
			</div>
		{/if}
	</div>
</div>
