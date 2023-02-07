import metricsStore, { metricsName, IMetrics } from '../common/store'
import type { ResourceFlowTiming } from '../utils/performanceUtils'
import {
  getFP,
  getFCP,
  getLCP,
  getFID,
  getCLS,
  getNavigationTiming,
  getResourceFlow
} from '../utils/performanceUtils'

export const afterLoad = (callback: any) => {
  if (document.readyState === 'complete') {
    setTimeout(callback);
  } else {
    window.addEventListener('pageshow', callback, {once: true, capture: true})
  }
}

export interface EngineInstance {
  [prop: string | number] : any
}

export interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
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
    const entryHandler = (entry: PerformanceEntry) => {
      const metrics = {
        startTime: entry?.startTime.toFixed(2),
        entry,
      } as IMetrics;
      this.metrics.set(metricsName.LCP, metrics);
    };
    getLCP(entryHandler);
  };

  // 初始化 FID 的获取以及返回
  initFID = (): void => {
    const entryHandler = (entry: PerformanceEventTiming) => {
      const metrics = {
        delay: entry.processingStart - entry.startTime,
        entry,
      } as IMetrics;
      this.metrics.set(metricsName.FID, metrics);
    };
    getFID(entryHandler);
  };

  // 初始化 CLS 的获取以及返回
  initCLS = (): void => {
    let clsValue = 0;
    let clsEntries = [];
  
    let sessionValue = 0;
    let sessionEntries: Array<LayoutShift> = [];
  
    const entryHandler = (entry: LayoutShift) => {
      if (!entry.hadRecentInput) {
        const firstSessionEntry = sessionEntries[0];
        const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
  
        // 如果条目与上一条目的相隔时间小于 1 秒且
        // 与会话中第一个条目的相隔时间小于 5 秒，那么将条目
        // 包含在当前会话中。否则，开始一个新会话。
        if (
          sessionValue &&
          entry.startTime - lastSessionEntry.startTime < 1000 &&
          entry.startTime - firstSessionEntry.startTime < 5000
        ) {
          sessionValue += entry.value;
          sessionEntries.push(entry);
        } else {
          sessionValue = entry.value;
          sessionEntries = [entry];
        }
  
        // 如果当前会话值大于当前 CLS 值，
        // 那么更新 CLS 及其相关条目。
        if (sessionValue > clsValue) {
          clsValue = sessionValue;
          clsEntries = sessionEntries;
  
          // 记录 CLS 到 Map 里
          const metrics = {
            entry,
            clsValue,
            clsEntries,
          } as IMetrics;
          this.metrics.set(metricsName.CLS, metrics);
        }
      }
    };
    getCLS(entryHandler);
  };

  // 初始化 NT 的获取以及返回
  initNavigationTiming = (): void => {
    const navigationTiming = getNavigationTiming();
    const metrics = navigationTiming as IMetrics;
    this.metrics.set(metricsName.NT, metrics);
  };

  // 初始化 RF 的获取以及返回
  initResourceFlow = (): void => {
    const resourceFlow: Array<ResourceFlowTiming> = [];
    const resObserve = getResourceFlow(resourceFlow);
  
    const stopListening = () => {
      if (resObserve) {
        resObserve.disconnect();
      }
      const metrics = resourceFlow as IMetrics;
      this.metrics.set(metricsName.RF, metrics);
    };
    // 当页面 pageshow 触发时，中止
    window.addEventListener('pageshow', stopListening, { once: true, capture: true });
  };
}