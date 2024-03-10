import { NodeType } from '../ast';
import { NodeTransform } from '../options';

export const transformText: NodeTransform = (node) => {
  if (node.type === NodeType.ROOT) {
    return () => {};
  }
};
