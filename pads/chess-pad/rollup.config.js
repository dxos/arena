//
// Copyright 2020 DXOS.org
//

import babel from '@rollup/plugin-babel';
import externalGlobals from 'rollup-plugin-external-globals';
import json from '@rollup/plugin-json';
import nodeBuiltins from 'rollup-plugin-node-builtins';
import nodeGlobals from 'rollup-plugin-node-globals';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import commonjs from '@rollup/plugin-commonjs';

import pkg from './package.json';

const external = Object.keys(pkg.peerDependencies)
  .concat(Object.keys(pkg.devDependencies));

const externalsMap = {
  react: 'React',
  'react-dom': 'ReactDOM',
  '@dxos/react-client': 'DXOSReactClient',
  '@dxos/crypto': 'DXOSCrypto',
  '@dxos/echo-db': 'DXOSEchoDb'
};

const PORT = process.env.SERVE_PORT || 5000;
const DIST = './dist/esm';

const plugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG)
  }),
  json(),
  nodeBuiltins(),
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'bundled',
    extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx']
  }),

  resolve({
    browser: true,
    preferBuiltins: false,
    extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx']
  }),
  commonjs({
    ignore: (id) => externalsMap[id] || id.startsWith('@material-ui' || external.includes(id))
  }),
  nodeGlobals(),
  externalGlobals((id) => {
    let globalVar = externalsMap[id];

    if (id.startsWith('@material-ui')) {
      const [, ...parts] = id.split('/');
      globalVar = `MUI.${parts.join('.')}`;
    }
    // if(!globalVar) console.log(id)
    return globalVar;
  }),
  process.env.SERVE_PORT && serve({
    contentBase: DIST,
    port: PORT,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
].filter(Boolean);

export default {
  preserveSymlinks: true,
  input: './src/index.js',
  external,
  plugins,
  output: {
    file: `${DIST}/index.js`,
    format: 'es'
  }
};
