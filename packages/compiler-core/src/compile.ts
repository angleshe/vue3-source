import { generate } from './codegen';
import { parse } from './parse';
import { transform } from './transform';
import { transformText } from './transforms/transformText';
import { transformExpression } from './transforms/transformExpression';
import { ParserOptions } from './options';

export function baseCompile(template: string, options: ParserOptions) {
  const ast = parse(template);
  transform(ast, {
    ...options,
    nodeTransforms: [transformText, transformExpression],
  });
  return generate(ast);
}
