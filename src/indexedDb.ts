import { writable, get, type Writable, type Updater } from "svelte/store";

let opening: Promise<IDBDatabase> | null = null;

const openDatabase = () =>
	new Promise<IDBDatabase>((resolve, reject) => {
		const request = indexedDB.open("settings", 1);
		request.onsuccess = () => {
			resolve(request.result);
		};
		request.onerror = reject;
		request.onupgradeneeded = () => {
			const db = request.result;
			db.createObjectStore("settings");
		};
	});

const getSettingsDatabase = () => {
	if (!opening) {
		opening = openDatabase();
	}
	return opening;
};

export const getSetting = async (settingName: string) => {
	const db = await getSettingsDatabase();
	return new Promise<any>((resolve, reject) => {
		const request = db.transaction("settings").objectStore("settings").get(settingName);
		request.onsuccess = () => {
			resolve(request.result);
		};
		request.onerror = reject;
	});
};

export const setSetting = async (settingName: string, value: any) => {
	const db = await getSettingsDatabase();
	return new Promise<void>((resolve, reject) => {
		const request = db.transaction("settings", "readwrite").objectStore("settings").put(value, settingName);
		request.onsuccess = () => {
			resolve();
		};
		request.onerror = reject;
	});
};

export const removeSetting = async (settingName: string) => {
	const db = await getSettingsDatabase();
	return new Promise<void>((resolve, reject) => {
		const request = db.transaction("settings", "readwrite").objectStore("settings").delete(settingName);
		request.onsuccess = () => {
			resolve();
		};
		request.onerror = reject;
	});
};

const update: <U>(updater: Updater<U>) => void = function <U>(this: Writable<U>, updater: Updater<U>) {
	this.set(updater(get(this)));
};

export const indexedDbStore = <T>(name: string, defaultValue: T): Writable<T> => {
	let lastValue = defaultValue;
	const setInStore = (newValue: T) => {
		if (lastValue !== newValue) {
			lastValue = newValue;
			store.set(newValue);
		}
	};
	const updateStoreValue = async () => {
		setInStore((await getSetting(name)) ?? defaultValue);
	};
	updateStoreValue();
	const store = writable(defaultValue);
	return {
		subscribe: store.subscribe,
		set: (value: T) => {
			setInStore(value);
			// FIXME: removeSetting and setSetting return a promise, parallel calls should be prevented
			if (value === defaultValue) {
				removeSetting(name);
			} else {
				setSetting(name, value);
			}
		},
		update
	};
};
