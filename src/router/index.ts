// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import ChatAI from "@/views/chatAI/index.vue";
import Index from "@/views/index/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/chat",
    },
    {
      path: "/chat",
      component: ChatAI,
    },
    {
      path: "/login",
      component: Index,
    },

    {
      path: "/chat/:id",
      component: ChatAI,
      props: true, // 可选：将参数作为 props 传递
    },

    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});
router.beforeEach(async (to, _from, next) => {
  const token = localStorage.getItem("token");

  // 判断是否是登录页面
  if (to.path === "/login") {
    console.log("login");
    // 判断token是否存在
    if (token) {
      next("/");
      return;
    }
    next();
    return;
  }
  // 判断token是否存在
  if (!token) {
    next("/login");
    return;
  }

  next();
});
export default router;
