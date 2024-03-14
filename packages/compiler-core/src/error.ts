import { SourceLocation } from './ast';

export enum ErrorCodes {
  END_TAG_WITH_TRAILING_SOLIDUS,
  EOF_BEFORE_TAG_NAME,
  EOF_IN_TAG,
  MISSING_END_TAG_NAME,
  X_MISSING_END_TAG,
  X_MISSING_INTERPOLATION_END,
}
export const errorMessages: Record<ErrorCodes, string> = {
  [ErrorCodes.END_TAG_WITH_TRAILING_SOLIDUS]: "Illegal '/' in tags.",
  [ErrorCodes.EOF_BEFORE_TAG_NAME]: 'Unexpected EOF in tag.',
  [ErrorCodes.EOF_IN_TAG]: 'Unexpected EOF in tag.',
  [ErrorCodes.MISSING_END_TAG_NAME]: 'End tag name was expected.',
  [ErrorCodes.X_MISSING_END_TAG]: 'Element is missing end tag.',
  [ErrorCodes.X_MISSING_INTERPOLATION_END]:
    'Interpolation end sign was not found.',
};

export interface CompilerError extends SyntaxError {
  code: number;
  loc?: SourceLocation;
}

export function defaultOnError(error: CompilerError) {
  throw error;
}

export function createCompilerError<T extends number>(
  code: T,
  loc?: SourceLocation,
  messages?: Record<number, string>,
): CompilerError {
  const msg = __DEV__ ? (messages ?? errorMessages)[code] : code;
  const error = new SyntaxError(String(msg)) as CompilerError;
  error.code = code;
  error.loc = loc;
  return error;
}
