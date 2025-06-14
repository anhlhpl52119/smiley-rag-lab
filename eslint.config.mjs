// eslint.config.mjs
import antfu from "@antfu/eslint-config";

export default antfu({
  typescript: true,
  jsonc: true,
  stylistic: {
    semi: true,
    quotes: "double",
  },
  rules: {
    "no-console": "off",
    "node/prefer-global/process": "off",
  },
});
