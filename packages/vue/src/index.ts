import { compile } from '@vue/compiler-dom';
import { registerRuntimeCompile, type RenderFunction } from '@vue/runtime-dom';
function compileToFunction(template: string): RenderFunction {
  const { code } = compile(template);
  console.log('render==>', code);
  const render = new Function('Vue', code)();
  return render;
}
registerRuntimeCompile(compileToFunction);
export * from '@vue/runtime-dom';
