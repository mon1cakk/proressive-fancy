import pako from "pako";
import { Base64 } from "js-base64";
import { setFlag, _support } from "./global";
import { InitOptions } from "@lesliejs/types";
import { EVENTTYPES } from "@lesliejs/common";

/**
 * 返回包含id、class、innerTextde字符串的标签
 * @param target html节点
 */
export function htmlElementAsString(target: HTMLElement): string {
  const tagName = target.tagName.toLowerCase();
  if (tagName === "body") {
    return "";
  }
  let classNames = target.classList.value;

  classNames = classNames !== "" ? ` class='${classNames}'` : "";
  const id = target.id ? ` id="${target.id}"` : "";
  const innerText = target.innerText;
  return `<${tagName}${id}${
    classNames !== "" ? classNames : ""
  }>${innerText}</${tagName}>`;
}
/**
 * 将地址字符串转换成对象，
 * 输入：'https://github.com/leslie/monica?token=123&name=11'
 * 输出：{
 *  "host": "github.com",
 *  "path": "/leslie/monica",
 *  "protocol": "https",
 *  "relative": "/leslie/monica?token=123&name=11"
 * }
 */
export function parseUrlToObj(url: string) {
  if (!url) {
    return {};
  }
  const match = url.match(
    // eslint-disable-next-line no-useless-escape
    /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/
  );
  if (!match) {
    return {};
  }
  const query = match[6] || "";
  const fragment = match[8] || "";
  return {
    host: match[4],
    path: match[5],
    protocol: match[2],
    relative: match[5] + query + fragment,
  };
}

// 压缩
export function zip(data: any): string {
  if (!data) return data;
  // 判断数据是否需要转为JSON
  const dataJson =
    typeof data !== "string" && typeof data !== "number"
      ? JSON.stringify(data)
      : data;
  // 使用Base64.encode处理字符编码，兼容中文
  const str = Base64.encode(dataJson as string);
  const binaryString = pako.gzip(str);
  const arr = Array.from(binaryString);
  let s = "";
  arr.forEach((item: number) => {
    s += String.fromCharCode(item);
  });
  return Base64.btoa(s);
}

export function setSilentFlag(paramOptions: InitOptions): void {
  setFlag(EVENTTYPES.XHR, !!paramOptions.silentXhr);
  setFlag(EVENTTYPES.FETCH, !!paramOptions.silentFetch);
  setFlag(EVENTTYPES.CLICK, !!paramOptions.silentClick);
  setFlag(EVENTTYPES.HISTORY, !!paramOptions.silentHistory);
  setFlag(EVENTTYPES.ERROR, !!paramOptions.silentError);
  setFlag(EVENTTYPES.HASHCHANGE, !!paramOptions.silentHashchange);
  setFlag(
    EVENTTYPES.UNHANDLEDREJECTION,
    !!paramOptions.silentUnhandledrejection
  );
  setFlag(EVENTTYPES.PERFORMANCE, !!paramOptions.silentPerformance);
  setFlag(EVENTTYPES.RECORDSCREEN, !paramOptions.silentRecordScreen);
  setFlag(EVENTTYPES.WHITESCREEN, !paramOptions.silentWhiteScreen);
}

// 对每一个错误详情，生成唯一的编码
export function getErrorUid(input: string): string {
  return window.btoa(encodeURIComponent(input));
}

export function hashMapExist(hash: string): boolean {
  const exist = _support.errorMap.has(hash);
  if (!exist) {
    _support.errorMap.set(hash, true);
  }
  return exist;
}
