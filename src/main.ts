import { Capacitor } from "@capacitor/core";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.svelte";
import { mount } from "svelte";

mount(App, {
	target: document.getElementById("app")!
});

if (!Capacitor.isNativePlatform() && "serviceWorker" in navigator && import.meta.env.MODE === "production") {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("/sw.js", { scope: "/" });
	});
}
