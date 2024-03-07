import { NOOP } from '@vue/shared';
import type {
  CompileFunction,
  Component,
  ComponentInternalInstance,
  VNode,
} from './type';

let compile: CompileFunction | undefined;

export function registerRuntimeCompile(_compile: CompileFunction) {
  compile = _compile;
}

export function createComponentInstance(
  vnode: VNode,
): ComponentInternalInstance {
  return {
    type: vnode.type as Component,
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
}
