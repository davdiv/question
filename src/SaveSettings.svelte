<script lang="ts">
	import { settingSave, settingSaveFolder } from "./save";
</script>

<div class="card mt-3">
	<div class="card-header">Sauvegarde</div>
	<div class="card-body">
		<div class="form-check">
			<label class="form-check-label">
				<input type="checkbox" class="form-check-input" bind:checked={$settingSave} />
				Sauvegarder
			</label>
		</div>
		<div class="form-row">
			<label for="saveFolderInput" class="col-auto col-form-label">Dossier de sauvegarde</label>
			<div class="col">
				<input type="text" class="form-control" id="saveFolderInput" bind:value={$settingSaveFolder} disabled={!$settingSave} />
			</div>
		</div>
	</div>
</div>
