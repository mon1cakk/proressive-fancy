import type { PageInformation } from "./types";

// 获取页面基本信息
export const getPageInfo = (): PageInformation => {
  const {
    host,
    hostname,
    href,
    protocol,
    origin,
    port,
    pathname,
    search,
    hash,
  } = window.location;
  const { width, height } = window.screen;
  const { language, userAgent } = navigator;

  return {
    host,
    hostname,
    href,
    protocol,
    origin,
    port,
    pathname,
    search,
    hash,
    title: document.title,
    language: language.substr(0, 2),
    userAgent,
    winScreen: `${width}x${height}`,
    docScreen: `${
      document.documentElement.clientWidth || document.body.clientWidth
    }x${document.documentElement.clientHeight || document.body.clientHeight}`,
  };
};
