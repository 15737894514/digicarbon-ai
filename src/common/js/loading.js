import Vue from "vue";
const openLoading = function (parEle, customClass) {
  //删除之前的loading
  let loadingDom = document.querySelector(".el-loading-mask.loading");
  loadingDom && loadingDom.remove();

  const loading = Vue.prototype.$loading({
    // 声明一个loading对象
    // body: true,
    lock: true, // 是否锁屏
    text: "正在加载...", // 加载动画的文字
    // spinner: 'el-icon-loading',             // 引入的loading图标
    background: "rgba(255, 255, 255, 0.8)", // 背景颜色
    target: parEle || ".app-main", // 需要遮罩的区域
    customClass: customClass || "loading", // 遮罩层新增类名
  });
  // setTimeout(function () {                  // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
  //   loading.close();                        // 关闭遮罩层
  // }, 5000)
  return loading;
};
export { openLoading };
