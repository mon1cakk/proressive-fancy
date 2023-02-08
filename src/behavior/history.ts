// 派发出新的 Event
const wr = (type: keyof History) => {
  const orig = history[type];
  return function (this: unknown) {
    const rv = orig.apply(this, arguments);
    const e = new Event(type);
    window.dispatchEvent(e);
    return rv;
  };
};

// 添加 pushState replaceState 事件
export const wrHistory = (): void => {
  history.pushState = wr('pushState');
  history.replaceState = wr('replaceState');
};