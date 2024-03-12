import { NodeType, type SimpleExpressionNode } from '../ast';
import type { NodeTransform, TransformContext } from '../options';
// import { isSimpleIdentifier } from '../utils';

export const transformExpression: NodeTransform = (node, context) => {
  if (node.type === NodeType.INTERPOLATION) {
    node.content = processExpression(node.content, context);
  }
};

function processExpression(
  node: SimpleExpressionNode,
  _context: TransformContext,
): SimpleExpressionNode {
  // if (!node.content.trim()) {
  //   return node;
  // }

  // const rawExp = node.content;
  // if (isSimpleIdentifier(rawExp)) {
  //   node.content = `_ctx.${rawExp}`;
  // }

  return node;
}
