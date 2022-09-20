//設置默認參數
const DEFAULTS = {
  method: "GET",
  //params來接收數量不固定的方法參數,這邊拿來接收requestHeader的資訊
  params: null,
  //Message Body可以接收一般json格是或是FormData格式
  // data: {
  //   username: 'alex',
  //   age: 18
  // }
  // data: FormData 數據
  data: null,

  contentType: CONTENT_TYPE_FORM_URLENCODED,
  responseType: "",
  timeoutTime: 0,
  withCredentials: false, //跨域是否能攜帶COOKIE

  // 建立http code連接成功和失敗的方法
  success() {}, //連接成功
  httpCodeError() {}, //狀態碼異常
  error() {}, //連接失敗
  abort() {}, //被終止
  timeout() {}, //超時連接
};
