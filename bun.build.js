/* eslint-disable no-undef */
/* eslint-disable antfu/no-top-level-await */
await Bun.build({
  entrypoints: ["./app.ts"], // Replace with your entry file
  outdir: "./dist", // Output directory
  minify: true, // Optional: Minify the output
  bundle: true,
  format: "esm", // Output format (e.g., esm, commonjs)
  target: "bun", // Target environment (e.g., browser, bun, node)
});
