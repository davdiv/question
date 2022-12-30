<script lang="ts">
	import { Capacitor } from "@capacitor/core";
	import { settingSave, settingSaveFolder, canAutomaticallySave, showDirectoryPicker } from "./save";

	async function pickFolderClick() {
		try {
			const folder = await showDirectoryPicker({ id: "saveResult", mode: "readwrite", startsIn: $settingSaveFolder ?? "documents" });
			$settingSaveFolder = folder;
		} catch (error) {
			// ignore error, the user probably canceled
		}
	}
</script>

{#if canAutomaticallySave}
	<div class="card mt-3">
		<div class="card-header">Sauvegarde</div>
		<div class="card-body">
			<div class="form-check">
				<label class="form-check-label">
					<input type="checkbox" class="form-check-input" bind:checked={$settingSave} />
					Sauvegarder
				</label>
			</div>
			{#if Capacitor.isNativePlatform()}
				<div class="form-row">
					<label for="saveFolderInput" class="col-auto col-form-label">Dossier de sauvegarde</label>
					<div class="col">
						<input type="text" class="form-control" id="saveFolderInput" bind:value={$settingSaveFolder} disabled={!$settingSave} />
					</div>
				</div>
			{:else}
				<div class="form-row">
					<label for="saveFolderInput" class="col-auto col-form-label">Dossier de sauvegarde</label>
					<div class="col">
						<input
							type="text"
							class="form-control-plaintext"
							id="saveFolderInput"
							value={$settingSaveFolder && typeof $settingSaveFolder === "object" ? $settingSaveFolder.name : ""}
							readonly
							disabled={!$settingSave}
						/>
					</div>
					<button type="button" class="btn btn-outline-secondary" disabled={!$settingSave} on:click={pickFolderClick}>Choisir...</button>
				</div>
			{/if}
		</div>
	</div>
{/if}
