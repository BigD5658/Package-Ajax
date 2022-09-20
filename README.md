# Package-Ajax
//提供簡易方法 去使用AJAX 判斷輸入資料重組輸出

import Ajax from "./ajax.js";

const ajax = (url, options) => {
  return new Ajax(url, options).getXHR();
};

const get = (url, options) => {
  return ajax(url, { ...options, method: "GET" });
};

const getJSON = (url, options) => {
  return ajax(url, { ...options, method: "GET", responseType: "json" });
};

const post = (url, options) => {
  return ajax(url, { ...options, method: "POST" });
};

export { ajax, get, getJSON, post };
