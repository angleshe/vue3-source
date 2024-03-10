import { NodeType, RootNode, TemplateChildNode, TextNode } from './ast';

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
  };
  function newLine(n: number) {
    context.push(`\n` + '  '.repeat(n));
  }
  return context;
}

function genText(node: TextNode, context: CodegenContext) {
  context.push(JSON.stringify(node.content));
}

function genNode(node: TemplateChildNode, context: CodegenContext) {
  switch (node.type) {
    case NodeType.TEXT:
      genText(node, context);
      break;
    default:
      if (__DEV__) {
        console.error(`未处理 codegen 类型: ${node.type}`);
        // TemplateChildNode 有多个类型时才能用
        // const exhaustiveCheck: never = node as never;
        // return exhaustiveCheck;
      }
      break;
  }
}

export function generate(ast: RootNode): CodegenResult {
  const context = createCodegenContext();
  const { push, indent, deindent } = context;
  push('return ');
  push('function render() {');
  indent();
  push('return ');
  if (ast.codegenNode) {
    genNode(ast.codegenNode, context);
  } else {
    push('null');
  }
  deindent();
  push('}');

  return {
    code: context.code,
    ast,
  };
}
