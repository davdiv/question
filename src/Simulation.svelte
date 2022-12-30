<script lang="ts">
	import { faTimes } from "@fortawesome/free-solid-svg-icons";
	import FaIcon from "./FaIcon.svelte";
	import type { Question, QuestionValidation, SimulationResponse } from "./model";
	import { simulateResponses } from "./model";
	import { settingSimulationsNumber } from "./save";

	export let question: Question;
	export let questionValidation: QuestionValidation;
	let simulation: SimulationResponse | null = null;
</script>

<div class="card mt-3">
	<div class="card-header">Simulation</div>
	<div class="card-body">
		<div class="form-row">
			<label for="simulationsInput" class="col-auto col-form-label">Nombre</label>
			<div class="col">
				<input type="number" class="form-control" id="simulationsInput" bind:value={$settingSimulationsNumber} />
			</div>
			<div class="col-auto">
				<button type="button" class="btn btn-primary" disabled={!questionValidation.fullyValid} on:click={() => (simulation = simulateResponses(question, $settingSimulationsNumber))}
					>Simulation</button
				>
			</div>
		</div>
		<br />
		{#if simulation}
			<div class="clearfix">
				<div class="float-left">
					<ul>
						{#each simulation as response}
							<li>
								{response.label} (coefficient: {response.coefficient}): {response.number}
							</li>
						{/each}
					</ul>
				</div>
				<div class="float-right">
					<button type="button" class="btn btn-secondary" on:click={() => (simulation = null)}><FaIcon icon={faTimes} /></button>
				</div>
			</div>
		{/if}
	</div>
</div>
