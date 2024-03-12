import {
  NodeType,
  type RootNode,
  type TemplateChildNode,
  createCallExpression,
} from './ast';
import { TransformContext, TransformOptions } from './options';
import { CREATE_BLOCK, FRAGMENT, TO_STRING } from './runtimeHelpers';
import { createBlockExpression } from './utils';

function createTransformContext({
  nodeTransforms = [],
}: TransformOptions): TransformContext {
  const context: TransformContext = {
    nodeTransforms,
    helpers: new Set(),
    helper(name) {
      context.helpers.add(name);
      return name;
    },
  };
  return context;
}

function traverseChildren(parent: RootNode, context: TransformContext) {
  for (let i = 0; i < parent.children.length; i++) {
    const child = parent.children[i];
    traverseNode(child, context);
  }
}

function traverseNode(
  node: RootNode | TemplateChildNode,
  context: TransformContext,
) {
  const { nodeTransforms, helper } = context;
  const exitFns: (() => void)[] = [];
  for (let i: number = 0; i < nodeTransforms.length; i++) {
    const onExit = nodeTransforms[i](node, context);
    if (onExit) {
      exitFns.push(onExit);
    }
  }

  switch (node.type) {
    case NodeType.ROOT:
      traverseChildren(node, context);
      break;
    case NodeType.INTERPOLATION:
      helper(TO_STRING);
      break;
  }

  let i: number = exitFns.length;
  while (i--) {
    exitFns[i]();
  }
}

function finalizeRoot(root: RootNode, context: TransformContext) {
  const { children } = root;
  const { helper } = context;
  if (children.length === 1) {
    const child = children[0];
    root.codegenNode = child;
  } else if (children.length > 1) {
    root.codegenNode = createBlockExpression(
      createCallExpression(helper(CREATE_BLOCK), [
        helper(FRAGMENT),
        'null',
        root.children,
      ]),
      context,
    );
  }

  root.helper = [...context.helpers];
}

export function transform(root: RootNode, options: TransformOptions): void {
  const context = createTransformContext(options);
  traverseNode(root, context);
  finalizeRoot(root, context);
}
