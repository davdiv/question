import { derived, writable, get, type Writable, type Updater } from "svelte/store";

const update: <U>(updater: Updater<U>) => void = function <U>(this: Writable<U>, updater: Updater<U>) {
	this.set(updater(get(this)));
};

export const localStorageStore = (name: string, defaultValue: string): Writable<string> => {
	let lastValue = defaultValue;
	const setInStore = (newValue: string) => {
		if (lastValue !== newValue) {
			lastValue = newValue;
			store.set(newValue);
		}
	};
	const updateStoreValue = () => {
		setInStore(localStorage.getItem(name) ?? defaultValue);
	};
	const listener = (ev: StorageEvent) => {
		if (ev.storageArea === localStorage && ev.key === name) {
			updateStoreValue();
		}
	};
	const store = writable(defaultValue, () => {
		updateStoreValue();
		window.addEventListener("storage", listener);
		return () => {
			window.removeEventListener("storage", listener);
		};
	});
	return {
		subscribe: store.subscribe,
		set: (value: string) => {
			if (value === defaultValue) {
				localStorage.removeItem(name);
			} else {
				localStorage.setItem(name, value);
			}
			setInStore(value);
		},
		update
	};
};

const toBoolean = (value: string) => value === "true";
const fromBoolean = (value: boolean) => (value ? "true" : "false");

export const booleanLocalStorageStore = (name: string, defaultValue: boolean): Writable<boolean> => {
	const baseStore = localStorageStore(name, fromBoolean(defaultValue));
	const store = derived(baseStore, toBoolean);
	return {
		subscribe: store.subscribe,
		set: (value: boolean) => {
			baseStore.set(fromBoolean(value));
		},
		update
	};
};
