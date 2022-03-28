import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
import globFast from 'fast-glob';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import { cleandir } from 'rollup-plugin-cleandir';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
const extensions = ['.js', '.ts'];

const ENV = process.env.NODE_ENV;
module.exports = {
  input: globFast.sync(['./src/**/*.ts'], { dot: true }),
  external:["imagemin"],
  plugins: [
    cleandir(),
    alias({
      '@/': './src/',
    }),
    typescript(),
    nodeResolve({
      extensions,
      modulesOnly: true,
      preferredBuiltins: false,
    }),
    nodePolyfills(),
    commonjs(),
    json(),
    babel({
      extensions,
      exclude: 'node_modules/**',
      include: './lib/**',
      babelHelpers: 'runtime',
    }),
    ENV === 'production' && uglify(),
  ],
  output: {
    dir: './lib',
    format: 'cjs',
  },
};
