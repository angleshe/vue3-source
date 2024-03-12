import {
  CompoundExpressionNode,
  InterpolationNode,
  NodeType,
  TemplateChildNode,
  TextNode,
} from '../ast';
import { NodeTransform } from '../options';

function isText(node: TemplateChildNode): node is TextNode | InterpolationNode {
  return node.type === NodeType.INTERPOLATION || node.type === NodeType.TEXT;
}

export const transformText: NodeTransform = (node) => {
  if (node.type === NodeType.ROOT) {
    return () => {
      const children = node.children;
      let currentContainer: CompoundExpressionNode | undefined = undefined;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (isText(child)) {
          for (let j = i + 1; j < children.length; j++) {
            const next = children[j];
            if (isText(next)) {
              if (!currentContainer) {
                currentContainer = children[i] = {
                  type: NodeType.COMPOUND_EXPRESSION,
                  children: [child],
                };
              }
              currentContainer.children.push('+', next);
              children.splice(j, 1);
              j--;
            }
          }
        }
      }
    };
  }
};
