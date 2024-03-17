import { CallExpression, NodeType, createCallExpression } from '../ast';
import { NodeTransform } from '../options';
import { CREATE_VNODE } from '../runtimeHelpers';

export const transformElement: NodeTransform = (node, context) => {
  if (node.type !== NodeType.ELEMENT) {
    return;
  }

  return function postTransformElement() {
    const { tag } = node;

    const args: CallExpression['arguments'] = [`"${tag}"`, 'null'];

    const hasChildren = node.children.length > 0;
    if (hasChildren) {
      if (node.children.length === 1) {
        const child = node.children[0];
        const type = child.type;

        const hasDynamicTextChild =
          type === NodeType.INTERPOLATION ||
          type === NodeType.COMPOUND_EXPRESSION;
        if (hasDynamicTextChild) {
          args.push(child);
        }
      }
    }

    const vnode = createCallExpression(context.helper(CREATE_VNODE), args);

    node.codegenNode = vnode;
  };
};
