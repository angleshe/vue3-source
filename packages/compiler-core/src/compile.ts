import { generate } from './codegen';
import { parse } from './parse';
import { transform } from './transform';
import { transformText } from './transforms/transformText';

export function baseCompile(template: string) {
  const ast = parse(template);
  transform(ast, {
    nodeTransforms: [transformText],
  });
  return generate(ast);
}
