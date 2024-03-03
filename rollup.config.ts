import type { RollupOptions } from 'rollup';
import path from 'node:path';
import ts from 'rollup-plugin-typescript2';

const tsPlugin = ts({
  tsconfig: path.resolve(__dirname, './tsconfig.json'),
})



function resolve(p: string) {
  return path.resolve(__dirname, './packages', p);
}


const rollupOptions: RollupOptions = {
  input: resolve('./vue/src/index.ts'),
  output: {
    format: 'es',
    file: resolve('dist/vue.esm-bundler.js')
  },
  plugins: [
    tsPlugin
  ]
};

export default rollupOptions;
