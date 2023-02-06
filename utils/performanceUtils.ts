// 获取 FP
export const getFP = (): PerformanceEntry | undefined => {
  const [entry] = performance.getEntriesByName('first-paint');
  return entry;
};

//获取 FCP
export const getFCP = (): PerformanceEntry | undefined => {
  const [entry] = performance.getEntriesByName('first-contentful-paint');
  return entry;
}

//获取 LCP
export const getLCP = (): PerformanceEntry | undefined => {
  const [entry] = performance.getEntriesByName('largest-contentful-paint');
  return entry;
}

//获取 FID
export const getFID = (): PerformanceEntry | undefined => {
  const [entry] = performance.getEntriesByName('first-input-delay');
  return entry;
}

//获取 CLS
export const getCLS = (): PerformanceEntry | undefined => {
  const [entry] = performance.getEntriesByName('cumulative-largest-shift');
  return entry;
}

//获取 NT
export const getNT = (): PerformanceEntry | undefined => {
  const [entry] = performance.getEntriesByName('navigation-timing');
  return entry;
}

//获取 RF
export const getRF = (): PerformanceEntry | undefined => {
  const [entry] = performance.getEntriesByName('resource-flow');
  return entry;
}