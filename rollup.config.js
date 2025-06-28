// rollup.config.js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/bokx.umd.js",
      format: "umd",
      name: "bokx",
      sourcemap: true,
    },
    {
      file: "dist/bokx.esm.js",
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(), // so Rollup can find node_modules imports (if any)
    commonjs(), // convert CJS modules to ES for bundling
  ],
};
