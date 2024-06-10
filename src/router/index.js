import Vue from "vue";
import VueRouter from "vue-router";

// hack router push callback
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/ai" },
  {
    path: "/ai",
    component: () => import(/* webpackChunkName: "AI" */ "@/views/digiHome"),
  },
  {
    path: "/protocol",
    component: () => import(/* webpackChunkName: "AI" */ "@/views/protocol"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
