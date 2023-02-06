import metricsStore, { metricsName, IMetrics } from './common/store'
import {
  getFP,
  getFCP,
  getLCP,
  getFID,
  getCLS,
  getNT,
  getRF
} from './utils/performanceUtils'

export interface PerformanceEntryHandler {
  (entry: any): void
}

export const afterLoad = (callback: any) => {
  if (document.readyState === 'complete') {
    setTimeout(callback);
  } else {
    window.addEventListener('pageshow', callback, {once: true, capture: true})
  }
}

export const observe = (type: string, callback: PerformanceEntryHandler): PerformanceObserver | undefined => {
  //类型合规，就返回observe
  if (PerformanceObserver.supportedEntryTypes?.includes(type)) {
    const ob: PerformanceObserver = new PerformanceObserver((listener) => listener.getEntries().map(callback));
    ob.observe({type, buffered: true});
    return ob
  }
  return undefined
}

export interface EngineInstance {
  [prop: string | number] : any
}

// 初始化入口，外部调用只需要 new WebVitals()
export default class WebVitals {
  private engineInstance: EngineInstance;

  //本地暂存数据在Map里（也可以自己用对象来存储）
  public metrics: metricsStore;

  constructor(engineInstance: EngineInstance) {
    this.engineInstance = engineInstance;
    this.metrics = new metricsStore();
    this.initLCP();
    this.initCLS();
    this.initResourceFlow();

    afterLoad(() => {
      this.initNavigationTiming();
      this.initFP();
      this.initFCP();
      this.initFID();
      this.perfSendHandler();
    })
  }

  // 性能数据的上报策略
  perfSendHandler = (): void => {
    // 如果你要监听 FID 数据。你就需要等待 FID 参数捕获完成后进行上报;
    // 如果不需要监听 FID，那么这里你就可以发起上报请求了;
  }

  // 初始化 FP 的获取以及返回
  initFP = (): void => {
    const entry = getFP();
    const metrics = {
      startTime: entry?.startTime.toFixed(2),
      entry,
    } as IMetrics;
    this.metrics.set(metricsName.FP, metrics);
  };

  // 初始化 FCP 的获取以及返回
  initFCP = (): void => {
    const entry = getFCP();
    const metrics = {
      startTime: entry?.startTime.toFixed(2),
      entry,
    } as IMetrics;
    this.metrics.set(metricsName.FCP, metrics);
  };

  // 初始化 LCP 的获取以及返回
  initLCP = (): void => {
    const entry = getLCP();
    const metrics = {
      startTime: entry?.startTime.toFixed(2),
      entry,
    } as IMetrics;
    this.metrics.set(metricsName.LCP, metrics);
  };

  // 初始化 FID 的获取以及返回
  initFID = (): void => {
    const entry = getFID();
    const metrics = {
      startTime: entry?.startTime.toFixed(2),
      entry,
    } as IMetrics;
    this.metrics.set(metricsName.FID, metrics);
  };

  // 初始化 CLS 的获取以及返回
  initCLS = (): void => {
    const entry = getCLS();
    const metrics = {
      startTime: entry?.startTime.toFixed(2),
      entry,
    } as IMetrics;
    this.metrics.set(metricsName.CLS, metrics);
  };

  // 初始化 NT 的获取以及返回
  initNavigationTiming = (): void => {
    const entry = getNT();
    const metrics = {
      startTime: entry?.startTime.toFixed(2),
      entry,
    } as IMetrics;
    this.metrics.set(metricsName.NT, metrics);
  };

  // 初始化 RF 的获取以及返回
  initResourceFlow = (): void => {
    const entry = getRF();
    const metrics = {
      startTime: entry?.startTime.toFixed(2),
      entry,
    } as IMetrics;
    this.metrics.set(metricsName.RF, metrics);
  };
}