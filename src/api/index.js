import { get, post } from "@/utils/http";
export const smscodeApi = (params) => post(`/auth/smscode`, params); // 获取验证码
export const loginApi = (params) => post(`/auth/login`, params); // 用户登录
export const customerInfoApi = (params) => post(`/auth/basicInfo`, params); // 获取用户信息
export const customerInfoModifyApi = (params) => post(`/auth/basicInfo/modify`, params); // 更新用户信息
export const logoutApi = (params) => post(`/auth/logout`, params); // 退出登录
export const picUploadApi = (params) => post(`/auth/basicInfo/pic`, params); //图片上传

// 角色对话
export const agentListV1Api = (params) => post(`/llm/v1/agentList`, params); //获取智能体列表
export const agentListApi = (params) => post(`/llm/agentList`, params); // 获取角色列表
export const sessionListApi = (params) => post(`/llm/agent/sessionList`, params); // 获取角色会话列表
// export const sessionQueryApi = (params) => post(`/llm/agent/session/query`, params); // 获取角色会话历史记录
export const sessionQueryApi = (params) => post(`/llm/v1/agent/session/query`, params); // 获取角色会话历史记录
export const sessionSendApi = (params) => post(`/llm/agent/sessionSend`, params); // 发送消息（sse推动方式）
export const sessionSendV1Api = (params) => post(`/llm/agent/v1/sessionSend`, params); // 发送消息(一下返回)
export const sessionSendV2Api = (params) => post(`/llm/agent/v2/sessionSend`, params); // 发送消息(长轮循)
export const sessionKillApi = (params) => post(`/llm/agent/v2/sessionKill`, params); // 终止会话

export const sessionAddApi = (params) => post(`/llm/agent/session/add`, params); // 新建会话
export const sessionUpdateApi = (params) => post(`/llm/agent/session/update`, params); //重命名回话
export const sessionDeleteApi = (params) => post(`/llm/agent/session/delete`, params); //删除会话
export const feedbackApi = (params) => post(`/llm/agent/feedback`, params); //添加反馈
