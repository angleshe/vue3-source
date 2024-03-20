import { EMPTY_OBJ, NOOP } from '@vue/shared';
import type {
  CompileFunction,
  Component,
  ComponentInternalInstance,
  VNode,
} from './type';
import { publicInstanceProxyHandlers } from './componentProxy';
import { applyOptions } from './apiOptions';

let compile: CompileFunction | undefined;

export function registerRuntimeCompile(_compile: CompileFunction) {
  compile = _compile;
}

export function createComponentInstance(
  vnode: VNode,
): ComponentInternalInstance {
  return {
    type: vnode.type as Component,
    proxy: null,
    data: EMPTY_OBJ,
    renderContext: EMPTY_OBJ,
  };
}

export function finishComponentSetup(instance: ComponentInternalInstance) {
  const Component = instance.type;
  if (__RUNTIME_COMPILE__ && !Component.render && Component.template) {
    if (compile) {
      Component.render = compile(Component.template);
    } else {
      __DEV__ &&
        console.warn(
          '运行时解析模版需要调用registerRuntimeCompile注册模板解析函数',
        );
    }
  }

  instance.render = Component.render ?? NOOP;

  if (__FEATURE_OPTIONS__) {
    applyOptions(instance, Component);
  }
}

export function setupStatefulComponent(instance: ComponentInternalInstance) {
  instance.proxy = new Proxy(instance, publicInstanceProxyHandlers);
  finishComponentSetup(instance);
}
