//根据访问终端，去动态跳转到相应的服务(pc--mobile)
export const getHost = {
  development: "http://101.132.121.151:8050/mobi/ai",
  "cn-pre": "//101.132.121.151:8050/mobi/ai",
  cn: `//Carbonchat.cn/mobi/ai`,
};

export const agentIconPath = {
  development: "//101.132.121.151:8092/api/basic/pic/",
  "cn-pre": "//101.132.121.151:8092/api/basic/pic/",
  cn: `//Carbonchat.cn/api/basic/pic/`,
};
export const sseHost = {
  development: "//101.132.121.151:8803",
  "cn-pre": "//101.132.121.151:8803",
  cn: `//Carbonchat.cn`,
};
