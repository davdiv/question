import { Capacitor } from "@capacitor/core";
import { Filesystem, Encoding } from "@capacitor/filesystem";
import type { Response } from "./model";
import { get } from "svelte/store";
import { addAlert, type Alerts } from "./alerts/alertsModel";
import { indexedDbStore } from "./indexedDb";

export const settingSave = indexedDbStore("save", false);
const defaultSaveFolder = Capacitor.getPlatform() === "android" ? "file:///storage/emulated/0/Documents/Question" : undefined;
export const settingSaveFolder = indexedDbStore<string | FileSystemDirectoryHandle | undefined>("saveFolder", defaultSaveFolder);

export const showDirectoryPicker = (window as any).showDirectoryPicker;
export const canAutomaticallySave = Capacitor.isNativePlatform() || !!showDirectoryPicker;

const f2 = (value: number) => {
	return `${value < 10 ? "0" : ""}${value}`;
};

export const formatTimestamp = (timestamp: number) => {
	const date = new Date(timestamp);
	return `${f2(date.getDate())}/${f2(1 + date.getMonth())}/${date.getFullYear()} ${f2(date.getHours())}h${f2(date.getMinutes())}`;
};

export const formatDownloadFilename = (timestamp: number) => {
	const date = new Date(timestamp);
	return `question-${date.getFullYear()}-${f2(1 + date.getMonth())}-${f2(date.getDate())}-${f2(date.getHours())}h${f2(date.getMinutes())}m${f2(date.getSeconds())}s${date.getMilliseconds()}.txt`;
};

export const formatSaveFilename = (timestamp: number) => {
	const date = new Date(timestamp);
	return `${date.getFullYear()}/${date.getFullYear()}-${f2(1 + date.getMonth())}-${f2(date.getDate())}.txt`;
};

export const buildTextResponse = (response: Response) => {
	const textResponse = [];
	textResponse.push(`${formatTimestamp(response.timestamp)}:\n\n${response.question.question}\n`);
	response.question.options.forEach((option, index) => {
		textResponse.push(` ${index === response.responseIndex ? " ->" : " - "} ${option.label}`);
		if (option.coefficient !== 1) {
			textResponse.push(` (coefficient ${option.coefficient})`);
		}
		textResponse.push("\n");
	});
	textResponse.push("\n");
	return textResponse.join("");
};

export const saveResponse = async (response: Response, alerts: Alerts): Promise<Alerts> => {
	if (!canAutomaticallySave) return alerts;
	const saveEnabled = get(settingSave);
	const saveFolder = get(settingSaveFolder);
	if (!saveEnabled || !saveFolder) {
		return addAlert(alerts, "La question n'a pas été sauvegardée automatiquement.", "warning");
	}
	const data = buildTextResponse(response);
	const fileName = formatSaveFilename(response.timestamp);
	const saveFolderName = Capacitor.isNativePlatform() ? (saveFolder as string) : (saveFolder as FileSystemDirectoryHandle).name;
	try {
		let exist = false;
		if (Capacitor.isNativePlatform()) {
			const path = `${saveFolder}/${fileName}`;
			try {
				await Filesystem.stat({ path });
				exist = true;
			} catch (error) {
				// ignore error if file does not exist
			}
			if (exist) {
				await Filesystem.appendFile({
					data,
					path,
					encoding: Encoding.UTF8
				});
			} else {
				await Filesystem.writeFile({
					recursive: true,
					data,
					path,
					encoding: Encoding.UTF8
				});
			}
		} else {
			const fileParts = fileName.split("/");
			let dirHandle = saveFolder as FileSystemDirectoryHandle;
			const permission = await (dirHandle as any).requestPermission({ mode: "readwrite" });
			if (permission !== "granted") {
				return addAlert(alerts, `La question n'a pas pu être sauvegardée automatiquement: permission non accordée (${permission}).`, "danger");
			}
			while (fileParts.length > 1) {
				dirHandle = await dirHandle.getDirectoryHandle(fileParts.shift()!, { create: true });
			}
			const fileHandle = await dirHandle.getFileHandle(fileParts[0], { create: true });
			const file = await fileHandle.getFile();
			const size = file.size;
			exist = size > 0;
			const writable = await (fileHandle as any).createWritable({ keepExistingData: true });
			await writable.write({ type: "write", data, position: size });
			await writable.close();
		}
		return addAlert(
			alerts,
			`La sauvegarde automatique de cette question dans le ${exist ? "fichier existant" : "nouveau fichier"} ${fileName} (dans ${saveFolderName}) a été faite avec succès.`,
			"success"
		);
	} catch (error) {
		return addAlert(alerts, `La sauvegarde automatique de cette question dans le fichier ${fileName} (dans ${saveFolderName}) a échoué: ${error}`, "danger");
	}
};
