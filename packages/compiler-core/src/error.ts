import { SourceLocation } from './ast';

export enum ErrorCodes {
  X_MISSING_INTERPOLATION_END,
}
export const errorMessages: Record<ErrorCodes, string> = {
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
