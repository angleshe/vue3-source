import { SourceLocation } from './ast';

export enum ErrorCodes {
  DUPLICATE_ATTRIBUTE,
  END_TAG_WITH_ATTRIBUTES,
  END_TAG_WITH_TRAILING_SOLIDUS,
  EOF_BEFORE_TAG_NAME,
  EOF_IN_TAG,
  MISSING_ATTRIBUTE_VALUE,
  MISSING_END_TAG_NAME,
  MISSING_WHITESPACE_BETWEEN_ATTRIBUTES,
  UNEXPECTED_CHARACTER_IN_ATTRIBUTE_NAME,
  UNEXPECTED_CHARACTER_IN_UNQUOTED_ATTRIBUTE_VALUE,
  UNEXPECTED_EQUALS_SIGN_BEFORE_ATTRIBUTE_NAME,
  X_MISSING_END_TAG,
  X_MISSING_INTERPOLATION_END,
}
export const errorMessages: Record<ErrorCodes, string> = {
  [ErrorCodes.DUPLICATE_ATTRIBUTE]: 'Duplicate attribute.',
  [ErrorCodes.END_TAG_WITH_ATTRIBUTES]: 'End tag cannot have attributes.',
  [ErrorCodes.END_TAG_WITH_TRAILING_SOLIDUS]: "Illegal '/' in tags.",
  [ErrorCodes.EOF_BEFORE_TAG_NAME]: 'Unexpected EOF in tag.',
  [ErrorCodes.EOF_IN_TAG]: 'Unexpected EOF in tag.',
  [ErrorCodes.MISSING_ATTRIBUTE_VALUE]: 'Attribute value was expected.',
  [ErrorCodes.MISSING_END_TAG_NAME]: 'End tag name was expected.',
  [ErrorCodes.MISSING_WHITESPACE_BETWEEN_ATTRIBUTES]:
    'Whitespace was expected.',
  [ErrorCodes.UNEXPECTED_CHARACTER_IN_UNQUOTED_ATTRIBUTE_VALUE]:
    'Unquoted attribute value cannot contain U+0022 ("), U+0027 (\'), U+003C (<), U+003D (=), and U+0060 (`).',
  [ErrorCodes.UNEXPECTED_CHARACTER_IN_ATTRIBUTE_NAME]:
    'Attribute name cannot contain U+0022 ("), U+0027 (\'), and U+003C (<).',
  [ErrorCodes.UNEXPECTED_EQUALS_SIGN_BEFORE_ATTRIBUTE_NAME]:
    "Attribute name cannot start with '='.",
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
