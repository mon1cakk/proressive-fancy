export interface OriginInformation {
  referrer: string;
  type: number | string;
}

// 返回 OI 用户来路信息
export const getOriginInfo = (): OriginInformation => {
  return {
    referrer: document.referrer,
    type: window.performance?.navigation.type || "",
  };
};
