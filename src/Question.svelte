<script lang="ts">
	import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
	import FaIcon from "./FaIcon.svelte";
	import type { Question, QuestionValidation } from "./model";
	import { addOption, removeOption, defaultQuestion } from "./model";

	export let question: Question;
	export let questionValidation: QuestionValidation;
</script>

<div class="card mt-3">
	<div class="card-header">Question</div>
	<div class="card-body">
		<div class="form-group">
			<label for="question">Question</label>
			<textarea
				class="form-control"
				id="question"
				rows="3"
				class:is-invalid={!questionValidation.questionValid}
				bind:value={question.question}
			/>
		</div>
		<div>
			<div class="clearfix mb-2">
				<div class="float-left">Possibilités ({question.options.length})</div>
				<div class="float-right">
					<button
						type="button"
						class="btn btn-danger btn-xs"
						on:click={() => (question = defaultQuestion())}
						>Réinitialiser</button
					>
					<button
						type="button"
						class="btn btn-secondary"
						on:click={() => (question = addOption(question))}
						><FaIcon icon={faPlus} /></button
					>
				</div>
			</div>
			{#each question.options as option, index}
				<div class="form-row">
					<div class="form-group col">
						<input
							type="text"
							class="form-control"
							bind:value={option.label}
							class:is-invalid={!questionValidation.options[index].labelValid}
						/>
					</div>
					<div class="form-group col-md-1 col-3">
						<input
							type="number"
							class="form-control"
							bind:value={option.coefficient}
							class:is-invalid={!questionValidation.options[index]
								.coefficientValid}
						/>
					</div>
					<div class="col-auto">
						<button
							type="button"
							class="btn btn-danger"
							on:click={() => (question = removeOption(question, index))}
							><FaIcon icon={faTimes} /></button
						>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
