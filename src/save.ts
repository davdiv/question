import { Capacitor } from "@capacitor/core";
import { booleanLocalStorageStore, localStorageStore } from "./localStorage";
import { Filesystem, Encoding } from "@capacitor/filesystem";
import type { Response } from "./model";
import { get } from "svelte/store";
import { addAlert, type Alerts } from "./alerts/alertsModel";

export const settingSave = booleanLocalStorageStore("settingSave", false);
const defaultSaveFolder = Capacitor.getPlatform() === "android" ? "file:///storage/emulated/0/Documents/Question" : "";
export const settingSaveFolder = localStorageStore("settingSaveFolder", defaultSaveFolder);

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
	if (!Capacitor.isNativePlatform()) return alerts;
	const saveEnabled = get(settingSave);
	if (!saveEnabled) {
		return addAlert(alerts, "La question n'a pas été sauvegardée automatiquement.", "warning");
	}
	const dirName = get(settingSaveFolder);
	const fileName = formatSaveFilename(response.timestamp);
	const path = `${dirName}/${fileName}`;
	try {
		const data = buildTextResponse(response);
		let exist = false;
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
		return addAlert(alerts, `La sauvegarde automatique de cette question dans le ${exist ? "fichier existant" : "nouveau fichier"} ${fileName} (dans ${dirName}) a été faite avec succès.`, "success");
	} catch (error) {
		return addAlert(alerts, `La sauvegarde automatique de cette question dans le fichier ${fileName} (dans ${dirName}) a échoué: ${error}.`, "danger");
	}
};
