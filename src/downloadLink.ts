import { readable } from "svelte/store";
export const createDownloadLink = (content: string) => {
	const blob = new Blob([content], { type: "text/plain;charset=utf8" });
	return readable("", (set) => {
		const objectURL = URL.createObjectURL(blob);
		set(objectURL);
		return () => {
			URL.revokeObjectURL(objectURL);
		};
	});
};
