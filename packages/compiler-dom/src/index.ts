import { baseCompile } from '@vue/compiler-core';
import { parserOptionsMinimal } from './parserOptionsMinimal';

export function compile(template: string) {
  return baseCompile(template, {
    ...parserOptionsMinimal,
  });
}
