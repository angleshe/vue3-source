import type { RendererOptions } from '@vue/runtime-core';

const doc = document;

export const nodeOps: Omit<RendererOptions<Node, Element>, 'patchProp'> = {
  createText(text: string) {
    return doc.createTextNode(text);
  },
  insert(el: Node, parent: Element) {
    parent.appendChild(el);
  },
  createComment(text: string) {
    return doc.createComment(text);
  },
  createElement(type: string) {
    return doc.createElement(type);
  },
  setElementText(node: Element, text: string) {
    node.textContent = text;
  },
};
