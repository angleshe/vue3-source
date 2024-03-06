import type { RollupOptions } from 'rollup';
import path from 'node:path';
import ts from 'rollup-plugin-typescript2';
import replace from '@rollup/plugin-replace';

const tsPlugin = ts({
  tsconfig: path.resolve(__dirname, './tsconfig.web.json'),
});

function resolve(p: string) {
  return path.resolve(__dirname, './packages', p);
}

const rollupOptions: RollupOptions = {
  input: resolve('./vue/src/index.ts'),
  output: {
    format: 'iife',
    file: resolve('dist/vue.global.js'),
    name: 'vue',
  },
  plugins: [
    tsPlugin,
    replace({
      __DEV__: true,
      __RUNTIME_COMPILE__: true,
    }),
  ],
};

export default rollupOptions;
