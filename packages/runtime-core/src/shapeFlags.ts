export enum ShapeFlags {
  UNKNOWN = 0,
  STATEFUL_COMPONENT = 0b0000_0010,
}

export function isComponentShapeFlag(shapeFlag: ShapeFlags) {
  const componentFlag = ShapeFlags.STATEFUL_COMPONENT;
  return !!(componentFlag & shapeFlag);
}
