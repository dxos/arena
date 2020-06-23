import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import externalGlobals from 'rollup-plugin-external-globals';
import nodeBuiltins from 'rollup-plugin-node-builtins';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';

import pkg from './package.json';

const external = Object.keys(pkg.peerDependencies)
  .concat(Object.keys(pkg.devDependencies));

const externalsMap = {
  'react': 'React',
  'react-dom': 'ReactDOM',
  '@dxos/react-client': 'DXOSReactClient',
  '@dxos/crypto': 'DXOSCrypto'
};

const PORT = process.env.SERVE_PORT || 5000;
const DIST = './dist/esm';

const plugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.NODE_DEBUG': JSON.stringify(process.env.NODE_DEBUG)
  }),
  babel({
    exclude: 'node_modules/**',
    runtimeHelpers: true
  }),
  nodeBuiltins(),
  resolve({
    browser: true,
    preferBuiltins: false
  }),
  commonjs({
    include: /node_modules/
  }),
  externalGlobals((id) => {
    let globalVar = externalsMap[id];

    if (id.startsWith('@material-ui')) {
      const [, ...parts] = id.split('/');
      globalVar = `MUI.${parts.join('.')}`;
    }

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
