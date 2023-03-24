export interface PageInformation {
  host: string;
  hostname: string;
  href: string;
  protocol: string;
  origin: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  // 网页标题
  title: string;
  // 浏览器的语种 (eg:zh) ; 这里截取前两位，有需要也可以不截取
  language: string;
  // 用户 userAgent 信息
  userAgent?: string;
  // 屏幕宽高 (eg:1920x1080)  屏幕宽高意为整个显示屏的宽高
  winScreen: string;
  // 文档宽高 (eg:1388x937)   文档宽高意为当前页面显示的实际宽高（有的同学喜欢半屏显示）
  docScreen: string;
}

// 这里参考了 谷歌GA 的自定义埋点上报数据维度结构
export interface customAnalyticsData {
  // 事件类别 互动的对象 eg:Video
  eventCategory: string;
  // 事件动作 互动动作方式 eg:play
  eventAction: string;
  // 事件标签 对事件进行分类 eg:
  eventLabel: string;
  // 事件值 与事件相关的数值   eg:180min
  eventValue?: string;
}
