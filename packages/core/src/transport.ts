export enum transportCategory {
  // PV访问数据
  PV = 'pv',
  // 性能数据
  PERF = 'perf',
  // api 请求数据
  API = 'api',
  // 报错数据
  ERROR = 'error',
  // 自定义行为
  CUS = 'custom',
}

export interface DimensionStructure {
  // 用户id，存储于cookie
  uid: string;
  // 会话id，存储于cookiestorage
  sid: string;
  // 应用id，使用方传入
  pid: string;
  // 应用版本号
  release: string;
  // 应用环境
  environment: string;
}

export interface TransportStructure {
  // 上报类别
  category: transportCategory;
  // 上报的维度信息
  dimension: DimensionStructure;
  // 上报对象(正文)
  context?: Object;
  // 上报对象数组
  contexts?: Array<Object>;
  // 捕获的sdk版本信息，版本号等...
  sdk: Object;
}

export default class TransportInstance {
  private readonly engineInstance: EngineInstance;

  public kernelTransportHandler: Function;

  private readonly options: TransportParams;

  constructor(engineInstance: EngineInstance, options: TransportParams) {
    this.engineInstance = engineInstance;
    this.options = options;
    this.kernelTransportHandler = this.initTransportHandler();
  }

  // 格式化数据,传入部分为 category 和 context \ contexts
  formatTransportData = (category: transportCategory, data: Object | Array<Object>): TransportStructure => {
    const transportStructure = {
      category,
      dimension: this.engineInstance.dimensionInstance.getDimension(),
      sdk: getSdkVersion(),
    } as TransportStructure;
    if (data instanceof Array) {
      transportStructure.contexts = data;
    } else {
      transportStructure.context = data;
    }
    return transportStructure;
  };

  // 初始化上报方法
  initTransportHandler = () => {
    return typeof navigator.sendBeacon === 'function' ? this.beaconTransport() : this.xmlTransport();
  };

  // beacon 形式上报
  beaconTransport = (): Function => {
    const handler = (data: TransportStructure) => {
      const status = window.navigator.sendBeacon(this.options.transportUrl, JSON.stringify(data));
      // 如果数据量过大，则本次大数据量用 XMLHttpRequest 上报
      if (!status) this.xmlTransport().apply(this, data);
    };
    return handler;
  };

  // XMLHttpRequest 形式上报
  xmlTransport = (): Function => {
    const handler = (data: TransportStructure) => {
      const xhr = new (window as any).oXMLHttpRequest();
      xhr.open('POST', this.options.transportUrl, true);
      xhr.send(JSON.stringify(data));
    };
    return handler;
  };
}