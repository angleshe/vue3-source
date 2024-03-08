export interface Node {
  type: NodeType;
}

export interface TextNode extends Node {
  type: NodeType.TEXT;
  content: string;
}

export type TemplateChildNode = TextNode;
export interface RootNode extends Node {
  type: NodeType.ROOT;
  children: TemplateChildNode[];
}

export enum NodeType {
  ROOT,
  TEXT,
}
