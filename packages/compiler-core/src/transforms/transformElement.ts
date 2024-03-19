import {
  CallExpression,
  ElementNode,
  NodeType,
  ObjectExpression,
  Property,
  SimpleExpressionNode,
  createCallExpression,
  createObjectExpression,
  createObjectProperty,
} from '../ast';
import { NodeTransform, TransformContext } from '../options';
import { CREATE_VNODE } from '../runtimeHelpers';

function createSimpleExpression(
  content: SimpleExpressionNode['content'],
): SimpleExpressionNode {
  return {
    type: NodeType.SIMPLE_EXPRESSION,
    content,
  };
}

function buildProps(node: ElementNode, context: TransformContext) {
  const { props } = node;

  const properties: Property[] = [];

  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    if (prop.type === NodeType.ATTRIBUTE) {
      const { name, value } = prop;
      properties.push(
        createObjectProperty(
          createSimpleExpression(name),
          createSimpleExpression(value ? value.content : ''),
        ),
      );
    } else {
      const { name } = prop;

      const directiveTransform = context.directiveTransforms[name];

      if (directiveTransform) {
        const { props } = directiveTransform(prop, context);
        properties.push(...props);
      } else {
        // TODO 什么case
      }
    }
  }

  let propsExpression: ObjectExpression | undefined;
  if (properties.length) {
    propsExpression = createObjectExpression(properties);
  }

  return {
    props: propsExpression,
  };
}

export const transformElement: NodeTransform = (node, context) => {
  if (node.type !== NodeType.ELEMENT) {
    return;
  }

  return function postTransformElement() {
    const { tag, props } = node;
    const hasProps = props.length > 0;

    const args: CallExpression['arguments'] = [`"${tag}"`];

    if (hasProps) {
      const propsBuildResult = buildProps(node, context);
      args.push(propsBuildResult.props);
    }

    const hasChildren = node.children.length > 0;
    if (hasChildren) {
      if (!hasProps) {
        args.push(null);
      }

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
