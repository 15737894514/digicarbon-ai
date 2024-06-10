import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    roles: [],
    agentId: "", //角色id
    agentName: "", //角色名字
    // sessionId: "", //话题列表id
    userData: {},
  },
  getters: {},
  mutations: {
    setAgentId(state, agentId) {
      state.agentId = agentId;
    },
    setAgentName(state, agentName) {
      state.agentName = agentName;
    },
    setRoles(state, roles) {
      state.roles = roles;
    },
    setUserData(state, userData) {
      console.log("userData", userData);
      state.userData = userData;
    },
    // setSessionId(state, sessionId) {
    //   state.sessionId = sessionId;
    // },
  },
  actions: {},
  modules: {},
});
