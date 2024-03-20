import { callWithErrorHandling } from '..';

// eslint-disable-next-line @typescript-eslint/ban-types
type EventValue = Function;

export function addEventListener(
  el: Element,
  event: string,
  handler: EventListener,
) {
  el.addEventListener(event, handler);
}

export function patchEvent(el: Element, name: string, value: EventValue) {
  if (value) {
    addEventListener(el, name, createInvoker(value));
  }
}

function createInvoker(initialValue: EventValue) {
  return (e: Event) => {
    callWithErrorHandling(initialValue, [e]);
  };
}
