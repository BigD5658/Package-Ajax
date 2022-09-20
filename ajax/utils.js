//工具函數

//數據序列化成 urlencoded 格式的字符串
const serialize = (param) => {
  //接收到object先拆解放入array當中,再用for of迴圈放出來排成一般字符串

  const results = []; //放最終結果
  //一般object不能直接用foe of訪問的要調用entries()才能
  //訪問完的Object.entries(param)直接附值到[key, value]裡面
  for (const [key, value] of Object.entries(param)) {
    results.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  }
  //照理來說跑完上面的for of 可以拿到像是 results =['username=BigD', 'age=22'];的結果
  //加入&防止資料連在一起
  return results.join("&");
};

// 給 URL 添加參數
// www.imooc.com?words=js&
const addURLData = (url, data) => {
  if (!data) return "";
  //判斷URL有沒有? 判定沒有那就在URL最後面加上?   判定有那就加上&
  const mark = url.includes("?") ? "&" : "?";

  return `${mark}${data}`;
};
export { serialize, addURLData };
