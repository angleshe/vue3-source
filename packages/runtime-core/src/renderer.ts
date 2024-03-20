import { createAppAPI } from './apiApp';
import { createComponentInstance, setupStatefulComponent } from './component';
import { renderComponentRoot } from './componentRenderUtils';
import {
  ShapeFlags,
  isComponentShapeFlag,
  isElementShapeFlag,
  isTextChildren,
} from './shapeFlags';
import {
  type ComponentInternalInstance,
  type RendererOptions,
  type RootRenderFunction,
  type VNode,
  Text,
  Fragment,
  VNodeChildren,
} from './type';

export function createRenderer<HostNode, HostElement extends HostNode>(
  options: RendererOptions<HostNode, HostElement>,
) {
  const {
    createText: hostCreateText,
    insert: hostInsert,
    createElement: hostCreateElement,
    setElementText: hostSetElementText,
    patchProp: hostPatchProp,
  } = options;

  function patch(n1: VNode | null, n2: VNode, container: HostElement) {
    const { type, shapeFlag } = n2;

    switch (type) {
      case Text:
        processText(n2, container);
        break;
      case Fragment:
        processFragment(n2, container);
        break;
      default:
        if (isElementShapeFlag(shapeFlag)) {
          processElement(n2, container);
        } else if (isComponentShapeFlag(shapeFlag)) {
          processComponent(n2, container);
        }
        break;
    }
  }
  function setupRenderEffect(
    instance: ComponentInternalInstance,
    container: HostElement,
  ) {
    console.log('setupRenderEffect===>', instance);
    const subTree = renderComponentRoot(instance);

    patch(null, subTree, container);
  }

  function mountComponent(vnode: VNode, container: HostElement) {
    // 1.创建实例
    const instance: ComponentInternalInstance = (vnode.component =
      createComponentInstance(vnode));

    // 2.设置状态组件
    if (vnode.shapeFlag === ShapeFlags.STATEFUL_COMPONENT) {
      setupStatefulComponent(instance);
    }

    // 3.设置渲染效果
    setupRenderEffect(instance, container);
    console.log('mountComponent===>', vnode, container);
  }

  function mountChildren(children: VNodeChildren, container: HostElement) {
    for (let i = 0; i < children.length; i++) {
      patch(null, children[i] as VNode, container);
    }
  }

  function mountElement(vnode: VNode, container: HostElement) {
    const tag = vnode.type as string;
    const el = hostCreateElement(tag);
    const { shapeFlag, props } = vnode;

    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, props[key]);
      }
    }

    if (isTextChildren(shapeFlag)) {
      hostSetElementText(el, vnode.children as string);
    }

    hostInsert(el, container);
  }

  function processComponent(vnode: VNode, container: HostElement) {
    mountComponent(vnode, container);
  }

  function processText(vnode: VNode, container: HostElement) {
    hostInsert(hostCreateText(vnode.children as string), container);
  }

  function processFragment(vnode: VNode, container: HostElement) {
    mountChildren(vnode.children as VNodeChildren, container);
  }

  function processElement(vnode: VNode, container: HostElement) {
    mountElement(vnode, container);
  }

  const render: RootRenderFunction<HostElement> = (vnode, container) => {
    console.log('渲染界面', vnode);
    patch(null, vnode, container);
  };
  return createAppAPI<HostElement>(render);
}
