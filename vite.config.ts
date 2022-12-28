import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svelte(),
		VitePWA({
			registerType: "autoUpdate",
			injectRegister: null,
			manifest: {
				name: "Question",
				short_name: "Question",
				description:
					"Application permettant d'écrire une question avec un ensemble de réponses possibles (éventuellement munies de coefficients de probabilité), et d'obtenir une réponse aléatoire. ",
				icons: [
					{
						src: "/android-chrome-192x192.png",
						sizes: "192x192",
						type: "image/png"
					},
					{
						src: "/android-chrome-512x512.png",
						sizes: "512x512",
						type: "image/png"
					}
				],
				theme_color: "#ffffff",
				background_color: "#ffffff",
				display: "standalone",
				lang: "fr"
			}
		})
	]
});
