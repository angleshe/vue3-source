import { isArray, isString, isSymbol } from '@vue/shared';
import {
  CallExpression,
  CompoundExpressionNode,
  InterpolationNode,
  JSChildNode,
  NodeType,
  RootNode,
  SequenceExpression,
  SimpleExpressionNode,
  TemplateChildNode,
  TextNode,
} from './ast';
import { TO_STRING, helperNameMap } from './runtimeHelpers';
import { assert } from './utils';

type CodegenNode = TemplateChildNode | JSChildNode;
export interface CodegenResult {
  code: string;
  ast: RootNode;
}

export interface CodegenContext {
  code: string;
  indentLevel: number;
  push(code: string): void;
  indent(): void;
  deindent(): void;
  newline(): void;
  helper(key: symbol): string;
}

function createCodegenContext(): CodegenContext {
  const context: CodegenContext = {
    code: '',
    indentLevel: 0,
    push(code) {
      context.code += code;
    },
    indent() {
      newLine(++context.indentLevel);
    },
    deindent() {
      newLine(--context.indentLevel);
    },
    newline() {
      newLine(context.indentLevel);
    },
    helper(key) {
      return `_${helperNameMap[key]}`;
    },
  };
  function newLine(n: number) {
    context.push(`\n` + '  '.repeat(n));
  }
  return context;
}

function genNodeListAsArray(
  nodes: TemplateChildNode[],
  context: CodegenContext,
) {
  const { push } = context;
  push('[');
  genNodeList(nodes, context);
  push(']');
}

function genNodeList(
  nodes: (CodegenNode | string | symbol | TemplateChildNode[])[],
  context: CodegenContext,
) {
  const { push } = context;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (isString(node)) {
      // 这个其实可以放在genNode中
      push(node);
    } else if (isArray(node)) {
      genNodeListAsArray(node, context);
    } else {
      genNode(node, context);
    }
    if (i < nodes.length - 1) {
      push(',');
    }
  }
}

function genText(node: TextNode, context: CodegenContext) {
  context.push(JSON.stringify(node.content));
}

function genSequenceExpression(
  node: SequenceExpression,
  context: CodegenContext,
) {
  context.push('(');
  genNodeList(node.expressions, context);
  context.push(')');
}

function genCallExpression(node: CallExpression, context: CodegenContext) {
  const { helper, push } = context;
  push(`${helper(node.callee)}(`);
  genNodeList(node.arguments, context);
  push(')');
}

function genInterpolation(node: InterpolationNode, context: CodegenContext) {
  context.push(`${context.helper(TO_STRING)}(`);
  genNode(node.content, context);
  context.push(')');
}

function genExpression(node: SimpleExpressionNode, context: CodegenContext) {
  context.push(node.content);
}

function genCompoundExpression(
  node: CompoundExpressionNode,
  context: CodegenContext,
) {
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (isString(child)) {
      context.push(child);
    } else {
      genNode(child, context);
    }
  }
}

function genNode(node: CodegenNode | symbol, context: CodegenContext) {
  if (isSymbol(node)) {
    context.push(context.helper(node));
    return;
  }
  switch (node.type) {
    case NodeType.TEXT:
      genText(node, context);
      break;
    case NodeType.SIMPLE_EXPRESSION:
      genExpression(node, context);
      break;
    case NodeType.COMPOUND_EXPRESSION:
      genCompoundExpression(node, context);
      break;
    case NodeType.INTERPOLATION:
      genInterpolation(node, context);
      break;
    case NodeType.JS_CALL_EXPRESSION:
      genCallExpression(node, context);
      break;
    case NodeType.JS_SEQUENCE_EXPRESSION:
      genSequenceExpression(node, context);
      break;
    case NodeType.ELEMENT:
      __DEV__ &&
        assert(
          !!node.codegenNode,
          `Codegen node is missing for element/if/for node. ` +
            `Apply appropriate transforms first.`,
        );
      genNode(node.codegenNode!, context);
      break;
    case NodeType.TEXT_CELL:
      genNode(node.codegenNode, context);
      break;
    default:
      if (__DEV__) {
        const exhaustiveCheck: never = node;
        return exhaustiveCheck;
      }
      break;
  }
}

export function generate(ast: RootNode): CodegenResult {
  const context = createCodegenContext();
  const { push, indent, deindent, newline } = context;
  const hasHelper = ast.helper.length > 0;
  if (hasHelper) {
    push('const _Vue = vue\n');
  }
  newline();
  push('return ');
  push('function render() {');
  indent();
  push('with (this) {');
  indent();
  if (hasHelper) {
    push(
      `const { ${ast.helper.map((s) => `${helperNameMap[s]}: _${helperNameMap[s]}`).join(',')} } = _Vue`,
    );
    newline();
  }
  push('return ');
  if (ast.codegenNode) {
    genNode(ast.codegenNode, context);
  } else {
    push('null');
  }
  deindent();
  push('}');
  deindent();
  push('}');

  return {
    code: context.code,
    ast,
  };
}
