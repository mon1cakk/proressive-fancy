export interface behaviorRecordsOptions {
  maxBehaviorRecords: number;
}

export enum metricsName {
  RCR = "router-change-record",
  CBR = "click-behavior-record",
  CDR = "custom-define-record",
  HT = "http-record",
}

export interface behaviorStack {
  category: metricsName;
  page: string;
  timestamp: number | string;
  data: Object;
}

export default class BehaviorStore {
  //数组形式记录行为的stack
  private state: Array<behaviorStack>;
  //最大行为记录条目数
  private readonly maxBehaviorRecords: number;

  // 外部传入 options 初始化，
  constructor(options: behaviorRecordsOptions) {
    const { maxBehaviorRecords } = options;
    this.maxBehaviorRecords = maxBehaviorRecords;
    this.state = [];
  }

  //从底部插入一条数据，但不会超过maxBehaviorRecords的限制数量
  push(value: behaviorStack) {
    if (this.length() === this.maxBehaviorRecords) {
      this.shift();
    }
    this.state.push(value);
  }

  //从顶部删除一条数据并返回
  shift() {
    return this.state.shift();
  }

  length() {
    return this.state.length;
  }

  get() {
    return this.state;
  }

  clear() {
    this.state = [];
  }
}
