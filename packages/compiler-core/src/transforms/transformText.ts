import {
  CallExpression,
  CompoundExpressionNode,
  ElementTypes,
  InterpolationNode,
  NodeType,
  TemplateChildNode,
  TextNode,
  createCallExpression,
} from '../ast';
import { NodeTransform } from '../options';
import { CREATE_TEXT } from '../runtimeHelpers';

function isText(node: TemplateChildNode): node is TextNode | InterpolationNode {
  return node.type === NodeType.INTERPOLATION || node.type === NodeType.TEXT;
}

export const transformText: NodeTransform = (node, context) => {
  if (node.type === NodeType.ROOT || node.type === NodeType.ELEMENT) {
    return () => {
      const children = node.children;
      let currentContainer: CompoundExpressionNode | undefined = undefined;
      let hasText: boolean = false;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (isText(child)) {
          hasText = true;
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

      if (
        !hasText ||
        // TODO: 为啥对于组件根节点的单文本节点不用createTextVNode?
        (children.length === 1 &&
          (node.type === NodeType.ROOT ||
            (node.type === NodeType.ELEMENT &&
              node.tagType === ElementTypes.ELEMENT)))
      ) {
        return;
      }

      // 修改成createTextVNode
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (isText(child) || child.type === NodeType.COMPOUND_EXPRESSION) {
          const callArgs: CallExpression['arguments'] = [child];
          children[i] = {
            type: NodeType.TEXT_CELL,
            content: child,
            codegenNode: createCallExpression(
              context.helper(CREATE_TEXT),
              callArgs,
            ),
          };
        }
      }
    };
  }
};
