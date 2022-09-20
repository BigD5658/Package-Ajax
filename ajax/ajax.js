// 常量
import {
  HTTP_GET,
  CONTENT_TYPE_FORM_URLENCODED,
  CONTENT_TYPE_JSON,
} from "./constants.js";

// 引入工具函數
import { serialize, addURLData } from "./utils.js";

import DEFAULTS from "./defaults.js";
//Ajax class
class Ajax {
  //用構造方法來建立要請求的url和用戶配置參數
  constructor(url, options) {
    //用this保存url可以讓 ajax class裡面的其他function也可以使用這個url,
    //沒用this就只有這個constructor function可以使用了,作用域
    this.url = url;
    //設定默認參數,用戶輸入的options會覆蓋掉前面的
    this.options = Object.assign({}, DEFAULTS, options);

    //初始化
    this.init();
  }

  //初始化
  this() {
    const xhr = new XMLHttpRequest();

    this.xhr = xhr; //讓別的function也可以訪問這個xhr

    //綁定響應事件處理程序
    this.bindEvents();
    //他原本是xhr.open('GET', url, true); 'GET'要替換成defaults裡面預設的method: "GET",
    //url +addParam是為了在requestHeader上攜帶資料它可以把json格式轉換為一般的值敘式
    // params: {
    //   username: 'BigD',
    //   age: 22
    // }
    // username=BigD&age=22 值敘式放在URL後面  轉換的方法寫在addParam()裡面
    xhr.open(this.options.method, this.url + this.addParam(), true);
    // 設置 responseType
    this.setResponseType();
    // 設置跨域是否攜帶 cookie
    this.setCookie();
    // 設置超時
    this.setTimeout();
    // 發送請求
    this.sendData();
  }

  bindEvents() {
    const xhr = this.xhr; //其實這邊可以只寫this.xhr 但是bindEvents裡面有xhr的都要改成this.xhr
    const { success, httpCodeError, error, abort, timeout } = this.options; //解構附值
    xhr.addEventListener(
      "load",
      () => {
        if (this.ok()) {
          success(xhr.response, xhr);
        } else {
          httpCodeError(xhr.status, xhr);
        }
      },
      false
    );
    // error
    // 當請求遇到錯誤時，將觸發 error 事件
    xhr.addEventListener(
      "error",
      () => {
        error(xhr);
      },
      false
    );
    // abort
    xhr.addEventListener(
      "abort",
      () => {
        abort(xhr);
      },
      false
    );

    // timeout
    xhr.addEventListener(
      "timeout",
      () => {
        timeout(xhr);
      },
      false
    );
  }
  // 檢測響應的 HTTP 狀態碼是否正常
  ok() {
    const xhr = this.xhr;
    return (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304;
  }
  //在URL上添加數據
  addParam() {
    const { params } = this.options; //從上面解構附值的options撈出params處理

    if (!params) return ""; //如果params 拿到預設的null就回傳""空的

    return addURLData(this.url, serialize(params));
  }
  // 設置 responseType
  setResponseType() {
    this.xhr.responseType = this.options.responseType;
  }
  // 設置跨域是否攜帶 cookie
  setCookie() {
    if (this.options.withCredentials) {
      this.xhr.withCredentials = true;
    }
  }
  // 設置超時
  setTimeout() {
    const { timeoutTime } = this.options;

    if (timeoutTime > 0) {
      this.xhr.timeout = timeoutTime;
    }
  }
  // 發送請求
  sendData() {
    const xhr = this.xhr;
    //判斷message body攜帶的data是否為null? 是null就send null退出sendData函式
    if (!this.isSendData()) {
      return xhr.send(null);
    }

    let resultData = null; //放置最終的資料

    // 判斷發送 FormData 格式的數據
    if (this.isFormData()) {
      resultData = data; //如果確定是FormData格式就可以直接賦值給他
    } else if (this.isFormURLEncodedData()) {
      // 發送 application/x-www-form-urlencoded 格式的數據
      this.setContentType(CONTENT_TYPE_FORM_URLENCODED);
      resultData = serialize(data);
    } else if (this.isJSONData()) {
      // 發送 application/json 格式的數據
      this.setContentType(CONTENT_TYPE_JSON);
      resultData = serializeJSON(data);
    } else {
      // 發送其他格式的數據

      this.setContentType();
      resultData = data;
    }
    xhr.send(resultData);
  }
  // 是否需要使用 send 發送數據
  isSendData() {
    const { data, method } = this.options;

    if (!data) return false; //如果data 是null回傳false
    //如果method傳入的指令是get 回傳false
    if (method.toLowerCase() === HTTP_GET.toLowerCase()) return false;

    return true; //除了上面兩個案例以外都回傳true
  }

  // 是否發送 FormData 格式的數據
  isFormData() {
    //判斷this.options.data 是不是FormData的實例,
    //因為this.options.data如果要傳值給data他就可以寫成 data:new FormData();
    return this.options.data instanceof FormData;
  }
  // 是否發送 application/x-www-form-urlencoded 格式的數據
  isFormURLEncodedData() {
    return (
      this.options.contentType
        .toLowerCase()
        //有可能CONTENT_TYPE_FORM_URLENCODED的參數url會變動
        .includes(CONTENT_TYPE_FORM_URLENCODED)
    );
  }
  // 是否發送 application/json 格式的數據
  isJSONData() {
    return this.options.contentType.toLowerCase().includes(CONTENT_TYPE_JSON);
  }
  // 設置 Content-Type
  setContentType(contentType = this.options.contentType) {
    if (!contentType) return;

    this.xhr.setRequestHeader("Content-Type", contentType);
  }
  // 獲取 XHR 對象
  getXHR() {
    return this.xhr;
  }
}
