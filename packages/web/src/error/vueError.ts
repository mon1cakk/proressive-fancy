export interface Vue {
  config: {
    errorHandler?: any;
    warnHandler?: any;
  };
}

export interface ViewModel {
  _isVue?: boolean;
  __isVue?: boolean;
  $root: ViewModel;
  $parent?: ViewModel;
  $props: { [key: string]: any };
  $options: {
    name?: string;
    propsData?: { [key: string]: any };
    _componentTag?: string;
    __file?: string;
  };
}

// 获取报错组件名
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str: string) =>
  str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
const ROOT_COMPONENT_NAME = "<Root>";
const ANONYMOUS_COMPONENT_NAME = "<Anonymous>";
export const formatComponentName = (vm: ViewModel, includeFile: Boolean) => {
  if (!vm) {
    return ANONYMOUS_COMPONENT_NAME;
  }
  if (vm.$root === vm) {
    return ROOT_COMPONENT_NAME;
  }
  const options = vm.$options;
  let name = options.name || options._componentTag;
  const file = options.__file;
  if (!name && file) {
    const match = file.match(/([^/\\]+)\.vue$/);
    if (match) {
      name = match[1];
    }
  }
  return (
    (name ? `<${classify(name)}>` : ANONYMOUS_COMPONENT_NAME) +
    (file && includeFile !== false ? ` at ${file}` : "")
  );
};
