import { EngineInstance } from '../performance/index';
import UserMetricsStore, { metricsName, IMetrics } from './store'
import BehaviorStore from '../behavior/index'
import { wrHistory } from '../behavior/history'
import type { PageInformation } from './types'
import {
  getPageInfo
} from './helper'

export default class UserVitals {
  private engineInstance: EngineInstance

  // 本地暂存数据在 Map 里 （也可以自己用对象来存储）
  public metrics: UserMetricsStore;

  public breadcrumbs: BehaviorStore;

  public customHandler: Function;

  // 最大行为追踪记录数
  public maxBehaviorRecords: number;

  // 允许捕获click事件的DOM标签 eg:button div img canvas
  clickMountList: Array<string>;

  constructor(engineInstance: EngineInstance, maxBehaviorRecords: number) {
    this.engineInstance = engineInstance;
    this.metrics = new UserMetricsStore();
    //限制最大场景追踪条目数
    this.maxBehaviorRecords = maxBehaviorRecords;
    //初始化行为追踪记录
    this.breadcrumbs = new BehaviorStore({maxBehaviorRecords: this.maxBehaviorRecords});
    //初始化用户自定义 事件捕获
    this.customHandler = this.initCustomerHandler();
    //初始化点击事件列表
    this.clickMountList = ['button'].map((x) => x.toLocaleLowerCase());
    //重写路由事件
    wrHistory();
    //初始化页面基本信息
    this.initPageInfo();
    // 初始化路由跳转获取
    this.initRouteChange();
    // 初始化用户来路信息获取
    this.initOriginInfo();
    // 初始化 PV 的获取;
    this.initPV();
    // 初始化 click 事件捕获
    this.initClickHandler(this.clickMountList);
    // 初始化 Http 请求事件捕获
    this.initHttpHandler();
  }

  // 初始化用户自定义埋点数据的获取上报
  initCustomerHandler = (): Function => {
      
  };

  //初始化页面的基本信息及返回
  initPageInfo = (): void => {
    const info: PageInformation = getPageInfo();
    const metrics = info as IMetrics;
    this.metrics.set(metricsName.PI, metrics);
  }

  //初始化路由的跳转获取及返回
  initRouteChange = (): void => {

  }

  //初始化用户来由获取及返回
  initOriginInfo = (): void => {

  }

  //初始化pv的获取及返回
  initPV = (): void => {

  }

  //初始化点击事件的获取及返回
  initClickHandler = (mountList: Array<string>): void => {

  }

  //初始化http请求数据的获取及返回
  initHttpHandler = (): void => {

  }
}