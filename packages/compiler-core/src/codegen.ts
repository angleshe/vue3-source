import { RootNode } from './ast';

export interface CodegenResult {
  code: string;
  ast: RootNode;
}

export function generate(ast: RootNode): CodegenResult {
  return {
    code: 'hello world',
    ast,
  };
}
