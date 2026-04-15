const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const importPlugin = require("eslint-plugin-import");

module.exports = defineConfig([
  expoConfig,

  {
    ignores: ["dist/*"],
  },

  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/no-unresolved": ["error", { caseSensitive: true }],
    },
  },
]);