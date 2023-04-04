import { UAParser } from 'ua-parser-js';
import { variableTypeDetection } from './is';

export const isBrowserEnv = variableTypeDetection.isWindow(
  typeof window !== 'undefined' ? window : 0
);

export interface LeslieSupport {
  replaceFlag: any
  deviceInfo?: any
}
interface LESLIEGlobal {
  console?: Console
  __lesliejs__?: LeslieSupport
}

/**
 * 获取全局变量
 *
 * ../returns Global scope object
 */
export function getGlobal<T>() {
  if (isBrowserEnv) return window as unknown as LESLIEGlobal & T
}
const _global = getGlobal<Window>();
const _support = getGlobalSupport();
const uaResult = new UAParser().getResult();

// 获取设备信息
_support.deviceInfo = {
  browserVersion: uaResult.browser.version, // // 浏览器版本号 107.0.0.0
  browser: uaResult.browser.name, // 浏览器类型 Chrome
  osVersion: uaResult.os.version, // 操作系统 电脑系统 10
  os: uaResult.os.name, // Windows
  ua: uaResult.ua,
  device: uaResult.device.model ? uaResult.device.model : 'Unknown',
  device_type: uaResult.device.type ? uaResult.device.type : 'Pc',
};

_support.replaceFlag = _support.replaceFlag || {};
const replaceFlag = _support.replaceFlag;
export function setFlag(replaceType, isSet) {
  if (replaceFlag[replaceType]) return;
  replaceFlag[replaceType] = isSet;
}
export function getFlag(replaceType) {
  return replaceFlag[replaceType] ? true : false;
}
// 获取全部变量__lesliejs__的引用地址
export function getGlobalSupport() {
  _global.__lesliejs__ = _global.__lesliejs__ || ({} as LeslieSupport)
  return _global.__lesliejs__
}
// export function supportsHistory(): boolean {
//   const chrome = _global.chrome;
//   const isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
//   const hasHistoryApi =
//     'history' in _global && !!_global.history.pushState && !!_global.history.replaceState;
//   return !isChromePackagedApp && hasHistoryApi;
// }

export { _global, _support };