import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.svelte";

const app = new App({
	target: document.getElementById("app") as Element
});

if ("serviceWorker" in navigator && import.meta.env.MODE === "production") {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("/sw.js", { scope: "/" });
	});
}

export default app;
