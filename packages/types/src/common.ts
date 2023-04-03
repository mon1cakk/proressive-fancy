// import { TransportData, Options } from '../core';

export interface Lesliejs {
  hasError: false; // 某段时间代码是否报错
  events: string[]; // 存储录屏的信息
  recordScreenId: string; // 本次录屏的id
  _loopTimer: number; // 白屏循环检测的timer
  transportData: any; // 数据上报
  options: any; // 配置信息
  replaceFlag: {
    // 订阅消息
    [key: string]: any;
  };
  deviceInfo: {
    // 设备信息
    [key: string]: any;
  };
}