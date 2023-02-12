import { mechanismType } from './types';
import type { ErrorVitalsInitOptions, ExceptionMetrics } from './types'
import { EngineInstance } from '../performance/index';

//判断是js异常还是静态资源异常 跨域异常
export const getErrorKey = (event: ErrorEvent | Event) => {
  const isJsError = event instanceof ErrorEvent;
  if (!isJsError) return mechanismType.RS;
  return event.message === 'Script error.' ? mechanismType.CS : mechanismType.JS;
}

//初始化的类
export default class ErrorVitals {
  private engineInstance: EngineInstance;

  //已上报错误的uid
  private submitErrorUids: Array<string>;

  constructor(engineInstance: EngineInstance, options: ErrorVitalsInitOptions) {
    const { Vue } = options;
    this.engineInstance = engineInstance;
    this.submitErrorUids = [];
    // 初始化 js错误
    this.initJsError();
    // 初始化 静态资源加载错误
    this.initResourceError();
    // 初始化 Promise异常
    this.initPromiseError();
    // 初始化 HTTP请求异常
    this.initHttpError();
    // 初始化 跨域异常
    this.initCorsError();
    // 初始化 Vue异常
    this.initVueError(Vue);
  }

  // 封装错误的上报入口，上报前，判断错误是否已经发生过
  errorSendHandler = (data: ExceptionMetrics) => {
    // 统一加上 用户行为追踪 和 页面基本信息
    const submitParams = {
      ...data,
      breadcrumbs: this.engineInstance.userInstance.breadcrumbs.get(),
      pageInformation: this.engineInstance.userInstance.metrics.get('page-information'),
    } as ExceptionMetrics;
    // 判断同一个错误在本次页面访问中是否已经发生过;
    const hasSubmitStatus = this.submitErrorUids.includes(submitParams.errorUid);
    // 检查一下错误在本次页面访问中，是否已经产生过
    if (hasSubmitStatus) return;
    this.submitErrorUids.push(submitParams.errorUid);
    // 记录后清除 breadcrumbs
    this.engineInstance.userInstance.breadcrumbs.clear();
    // 一般来说，有报错就立刻上报;
    this.engineInstance.transportInstance.kernelTransportHandler(
      // this.engineInstance.transportInstance.formatTransportData(transportCategory.ERROR, submitParams)
    );
  };

  // 初始化 JS异常 的数据获取和上报
  initJsError = (): void => {
  };

  // 初始化 静态资源异常 的数据获取和上报
  initResourceError = (): void => {
  };

  // 初始化 Promise异常 的数据获取和上报
  initPromiseError = (): void => {
  };

  // 初始化 HTTP请求异常 的数据获取和上报
  initHttpError = (): void => {
  };

  // 初始化 跨域异常 的数据获取和上报
  initCorsError = (): void => {
  };

  // 初始化 Vue异常 的数据获取和上报
  //todo:后续需要将app的类型转化为vue
  initVueError = (app: any): void => {
  };
}