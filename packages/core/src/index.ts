import pkg2 from "@lesliejs/web";

function fun2() {
  pkg2();
  console.log("I am package 1");
}

export default fun2;
export * from './helper'