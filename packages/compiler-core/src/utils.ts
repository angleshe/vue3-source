import {
  createSequenceExpression,
  type CallExpression,
  type Position,
  type SequenceExpression,
  createCallExpression,
} from './ast';
import { TransformContext } from './options';
import { OPEN_BLOCK } from './runtimeHelpers';
const NEWLINE_CHAR_CODE = 10;
export function advancePositionWithMutation(
  pos: Position,
  source: string,
  numberOfCharacters: number,
): Position {
  let lineCount: number = 0;
  let lastNewLinePos: number = -1;
  for (let i = 0; i < numberOfCharacters; i++) {
    if (source.charCodeAt(i) === NEWLINE_CHAR_CODE) {
      lineCount++;
      lastNewLinePos = i;
    }
  }

  pos.line += lineCount;
  pos.offset += numberOfCharacters;
  pos.column =
    lastNewLinePos === -1
      ? pos.column + numberOfCharacters
      : Math.max(1, numberOfCharacters - lastNewLinePos);
  return pos;
}

const nonIdentifierRE = /^\d|[^$\w]/;

export function isSimpleIdentifier(name: string): boolean {
  return !nonIdentifierRE.test(name);
}

export function createBlockExpression(
  blockExp: CallExpression,
  context: TransformContext,
): SequenceExpression {
  return createSequenceExpression([
    createCallExpression(context.helper(OPEN_BLOCK)),
    blockExp,
  ]);
}

export function toValidAssetId(name: string, type: 'component'): string {
  return `_${type}_${name.replace(/[^\w]/g, '_')}`;
}

export function assert(condition: boolean, msg?: string) {
  if (!condition) {
    throw new Error(msg || `unexpected compiler condition`);
  }
}
