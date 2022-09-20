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
}
