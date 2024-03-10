import { NodeType, type RootNode, type TemplateChildNode } from './ast';
import { TransformContext, TransformOptions } from './options';

function createTransformContext({
  nodeTransforms = [],
}: TransformOptions): TransformContext {
  const context: TransformContext = {
    nodeTransforms,
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
  const { nodeTransforms } = context;
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
  }

  let i: number = exitFns.length;
  while (i--) {
    exitFns[i]();
  }
}

function finalizeRoot(root: RootNode, _context: TransformContext) {
  const { children } = root;
  if (children.length === 1) {
    const child = children[0];
    root.codegenNode = child;
  }
}

export function transform(root: RootNode, options: TransformOptions): void {
  const context = createTransformContext(options);
  traverseNode(root, context);
  finalizeRoot(root, context);
}
