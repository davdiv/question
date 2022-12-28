<script lang="ts">
	import type { Response } from "./model";
	import { defaultQuestion, validate } from "./model";
	import QuestionPanel from "./Question.svelte";
	import SimulationPanel from "./Simulation.svelte";
	import ResponsePanel from "./Response.svelte";
	let question = defaultQuestion();
	$: questionValidation = validate(question);
	let response: Response | null = null;
</script>

<div class="container-fluid">
	{#if !response}
		<QuestionPanel bind:question {questionValidation} />
		<SimulationPanel {question} {questionValidation} />
	{/if}
	<ResponsePanel bind:question bind:response {questionValidation} />
</div>

<div class="container-fluid mt-3">
	<p class="text-muted ">
		Ce programme est un logiciel libre, sous license MIT. Son code source est <a
			href="https://github.com/davdiv/question">disponible ici</a
		>.
	</p>
</div>
