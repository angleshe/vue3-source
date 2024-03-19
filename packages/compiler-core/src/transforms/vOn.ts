import {
  DirectiveNode,
  ExpressionNode,
  NodeType,
  SimpleExpressionNode,
  createObjectProperty,
  createSimpleExpression,
} from '../ast';
import { DirectiveTransform } from '../options';

export interface VOnDirectiveNode extends DirectiveNode {
  arg: ExpressionNode;
  exp?: SimpleExpressionNode;
}

export const transformOn: DirectiveTransform = (dir: VOnDirectiveNode) => {
  const { arg } = dir;
  let eventName: ExpressionNode;
  if (arg.type === NodeType.SIMPLE_EXPRESSION) {
    eventName = createSimpleExpression(`on${arg.content}`);
  }

  const exp: ExpressionNode | undefined = dir.exp;
  // if (exp) {
  //   const isMemberExp = isMemberExpression(exp.content);
  //   if (isMemberExp) {
  //     exp = createCompoundExpression(['$event => (', exp, ')']);
  //   }
  // }

  return {
    props: [
      createObjectProperty(
        eventName,
        exp ?? createSimpleExpression('() => {}'),
      ),
    ],
  };
};
