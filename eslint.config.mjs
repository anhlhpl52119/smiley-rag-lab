import antfu from "@antfu/eslint-config";

export default antfu({
  typescript: true,
  ignores: [
    "node_modules",
  ],
  stylistic: {
    quotes: "double",
    semi: true,
  },
  rules: {
    "node/prefer-global/process": "off",
    "no-console": "warn",
  },
});
