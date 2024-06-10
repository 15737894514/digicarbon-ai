"use strict";
const { defineConfig } = require("@vue/cli-service");
const CompressionPlugin = require("compression-webpack-plugin"); //压缩解决打包后文件过大的问题
const TerserPlugin = require("terser-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const path = require("path");
const _VERS = new Date().getTime();
let { NODE_ENV } = process.env;
console.log("NODE_ENV", NODE_ENV);
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  productionSourceMap: process.env.NODE_ENV === "development",
  devServer: {
    hot: true, //开启热更新
    port: "8000",
    open: true,
    client: {
      overlay: false,
    },
    proxy: {
      "^/api": {
        target: "http://101.132.121.151:8803",
        changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        ws: false, //如果要代理 websockets，配置这个参数
        secure: false, // 如果是https接口，需要配置这个参数
        pathRewrite: {
          // 路径重写，
          "^/api": "/api", // 会将 / 替换为 '',也就是 / 会移除
        },
      },
    },
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: "digicarbon",
    // optimization: { usedExports: true },
    mode: NODE_ENV, //只有是production环境时，TerserPlugin或者UglifyjsWebpackPlugin 插件才能生效
    devtool: NODE_ENV === "development" ? "source-map" : undefined,
    resolve: {
      alias: {
        "@": resolve("src"),
        api: resolve("src/api"),
        components: resolve("src/components"),
        utils: resolve("src/utils"),
        views: resolve("src/views"),
        styles: resolve("src/styles"),
        common: resolve("src/common"),
      },
    },
    optimization: {
      // 此处添加 移除console.log 和 debugger的代码
      minimizer: [
        //这个插件使用terser来缩小你的JavaScript
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true, // 清除 console 语句
              drop_debugger: false, // 清除 debugger 语句
            },
          },
        }),
      ],
    },
    plugins: [new CompressionPlugin(), new NodePolyfillPlugin()],
  },
  css: {
    extract: false, //css样式的热更新
    sourceMap: true,
    loaderOptions: {
      sass: {
        prependData: `@import "@/styles/variables.scss";`,
      },
    },
  },
  chainWebpack(config) {
    // 清除css，js版本号
    config.output.filename("static/js/[name]." + _VERS + ".js").end();
    config.output.chunkFilename("static/js/[name]." + _VERS + ".js").end();
  },
});
