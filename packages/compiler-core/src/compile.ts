import { generate } from './codegen';
import { parse } from './parse';
import { transform } from './transform';

export function baseCompile(template: string) {
  const ast = parse(template);
  transform(ast);
  return generate(ast);
}
