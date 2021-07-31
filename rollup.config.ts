import fs from "fs";
import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
// import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
// import serve from "rollup-plugin-serve";
import ts from "rollup-plugin-typescript2";
import replace from "@rollup/plugin-replace";
import filesize from "rollup-plugin-filesize";

const { BUILD_TYPE } = process.env;

function getPackages() {
  const packages = ["shared", "core", "browser"];
  const rootPath = path.join(__dirname, "packages");
  return packages
    .map((pkg) => path.join(rootPath, pkg))
    .filter((dir) => fs.statSync(dir).isDirectory())
    .map((location) => {
      return {
        location: location,
        pkgJson: require(path.resolve(location, "package.json"))
      };
    });
}

function configBuilder({ location, pkgJson }) {
  const tsPlugin = ts({
    check: true,
    tsconfig: path.resolve(location, "tsconfig.json"),
    cacheRoot: path.resolve(__dirname, "node_modules/.rts2_cache"),
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: true,
        declaration: true,
        declarationMap: true
      },
      exclude: ["**/__tests__", "test-dts"]
    }
  });

  const commonPlugins = [
    resolve({
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      preferBuiltins: true
    }),
    // babel({
    //   extensions: [".js", ".jsx", ".ts", ".tsx"],
    //   babelHelpers: "runtime",
    //   exclude: ["node_modules/**", "packages/**/node_modules/**"]
    // }),
    tsPlugin,
    commonjs(),
    replace({
      preventAssignment: true,
      __buildVersion: pkgJson.version
    })
  ];

  const input = path.join(location, "src", "index.ts");
  const external = Object.keys(pkgJson.dependencies || {});

  return {
    umd: (compress) => {
      let file = path.join(location, "dist", "umd.js");
      const plugins = [...commonPlugins];

      if (compress) {
        plugins.push(
          terser({
            output: {
              comments: false
            }
          }),
          filesize()
        );
        file = path.join(location, "dist", "umd.min.js");
      }

      return {
        input,
        output: [
          {
            file,
            name: "Dora",
            format: "umd",
            sourcemap: true
          }
        ],
        plugins
      };
    },
    module: () => {
      const plugins = [...commonPlugins];
      return {
        input,
        external,
        output: [
          {
            file: path.join(location, pkgJson.module),
            format: "es",
            sourcemap: true
          },
          {
            file: path.join(location, pkgJson.main),
            format: "commonjs",
            sourcemap: true
          }
        ],
        plugins
      };
    }
  };
}

function getUMD() {
  const pkgConfig = getPackages();
  const compress = pkgConfig.map((pkg) => configBuilder(pkg).umd(true));
  const unCompress = pkgConfig.map((pkg) => configBuilder(pkg).umd(false));
  return [...compress, ...unCompress];
}

function getModule() {
  const pkgConfig = getPackages();
  return pkgConfig.map((pkg) => configBuilder(pkg).module());
}

function getAll() {
  return [...getModule(), ...getUMD()];
}

let promises = [];
switch (BUILD_TYPE) {
  case "UMD":
    promises.push(...getUMD());
    break;
  case "MODULE":
    promises.push(...getModule());
    break;
  case "ALL":
    promises.push(...getAll());
    break;
  default:
    break;
}

export default Promise.all(promises);
