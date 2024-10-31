import eslintPluginSvelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
	{
		ignores: ["dist", "**/.pnp.*", ".yarn/*", "android", "ios"]
	},
	...eslintPluginSvelte.configs["flat/recommended"],
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.browser
			}
		},

		rules: {
			"@typescript-eslint/consistent-type-imports": "error",
			"@typescript-eslint/no-unused-vars": "error",
			"@typescript-eslint/no-explicit-any": "off"
		}
	},
	{
		files: ["**/*.svelte"],
		rules: {
			"prefer-const": ["off"]
		},
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tseslint.parser
			}
		}
	}
);
