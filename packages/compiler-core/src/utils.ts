import type { Position } from './ast';
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
