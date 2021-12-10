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
import camelcase from "camelcase";

const { BUILD_TYPE } = process.env;

const printSizePkg = ["@doras/browser"];

function getPackages() {
  // const packages = ["types", "shared", "core"];
  const packages = ["types", "shared", "core", "browser"];
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
    tsconfig: path.resolve(location, "tsconfig.build.json"),
    cacheRoot: path.resolve(__dirname, "node_modules/.rts2_cache"),
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: true,
        declaration: true,
        declarationMap: true
      }
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
      __PkgName: pkgJson.name,
      __PkgVersion: pkgJson.version,
      __BuildTime: new Date().toLocaleString()
    })
  ];

  const input = path.join(location, "src", "index.ts");
  const external = Object.keys(pkgJson.dependencies || {});

  return {
    umd: (compress) => {
      let file = path.join(location, "dist", "umd.js");
      const plugins = [...commonPlugins];

      if (compress) {
        file = path.join(location, "dist", "umd.min.js");
        plugins.push(terser({ output: { comments: false } }));
      }

      if (printSizePkg.includes(pkgJson.name) && file.indexOf("min.js") > -1) {
        plugins.push(filesize());
      }

      const globalName = camelcase(pkgJson.name);
      const globals = {};
      external.forEach((pkgName) => {
        globals[pkgName] = camelcase(pkgName);
      });

      return {
        input,
        external: {},
        output: [
          {
            file,
            name: globalName,
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

function getProd() {
  const pkgConfig = getPackages();

  return pkgConfig.reduce((acc, pkg) => {
    acc.push(configBuilder(pkg).module());
    acc.push(configBuilder(pkg).umd(false));
    acc.push(configBuilder(pkg).umd(true));
    return acc;
  }, []);
}

function getDev() {
  const pkgConfig = getPackages();

  return pkgConfig.reduce((acc, pkg) => {
    acc.push(configBuilder(pkg).module());
    acc.push(configBuilder(pkg).umd(false));
    return acc;
  }, []);
}

let promises = [];
switch (BUILD_TYPE) {
  case "dev":
    promises.push(...getDev());
    break;
  case "prod":
    promises.push(...getProd());
    break;
  default:
    break;
}

export default Promise.all(promises);
