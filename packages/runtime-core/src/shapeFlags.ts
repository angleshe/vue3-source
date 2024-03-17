export enum ShapeFlags {
  UNKNOWN = 0,
  ELEMENT = 1,
  STATEFUL_COMPONENT = 0b0000_0100,
  TEXT_CHILDREN = 0b0000_1000,
}

export function isComponentShapeFlag(shapeFlag: ShapeFlags) {
  const componentFlag = ShapeFlags.STATEFUL_COMPONENT;
  return !!(componentFlag & shapeFlag);
}

export function isElementShapeFlag(shapeFlag: ShapeFlags) {
  return !!(shapeFlag & ShapeFlags.ELEMENT);
}

export function isTextChildren(shapeFlag: ShapeFlags) {
  return !!(shapeFlag & ShapeFlags.TEXT_CHILDREN);
}
