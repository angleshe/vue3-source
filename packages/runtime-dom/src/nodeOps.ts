import type { RendererOptions } from '@vue/runtime-core';

const doc = document;

export const nodeOps: RendererOptions<Node, Element> = {
  createText(text: string) {
    return doc.createTextNode(text);
  },
  insert(el: Node, parent: Element) {
    parent.appendChild(el);
  },
};
