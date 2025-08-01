import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { TDesignResolver } from "@tdesign-vue-next/auto-import-resolver";
import { resolve } from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [
        //  'vue-next' ,chat
        TDesignResolver({
          library: "chat",
        }),
        TDesignResolver({
          library: "vue-next",
        }),
      ],
    }),
    Components({
      resolvers: [
        TDesignResolver({
          library: "chat",
        }),
        TDesignResolver({
          library: "vue-next",
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0", // 监听所有地址，包括局域网 IP
    port: 5173, // 可自定义端口号
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },

  build: {
    rollupOptions: {
      output: {
        // Vue3 项目分包策略
        manualChunks(id) {
          // 处理 node_modules 依赖
          if (id.includes("node_modules")) {
            // Vue 相关库合并
            if (id.includes("@vue") || id.includes("vue-router")) {
              return "vue-vendor";
            }

            // // UI 库单独分包
            // if (id.includes("element-plus")) {
            //   return "ui-lib";
            // }

            if (id.includes("axios")) {
              return "axios";
            }
            //@tdesign-vue-next/chat 单独分包
            if (id.includes("@tdesign-vue-next/chat")) {
              return "tdesign-chat";
            }

            //tdesign-icons-vue-next 单独分包
            if (id.includes("tdesign-icons-vue-next")) {
              return "tdesign-icons";
            }
            //tdesign-vue-next 单独分包
            if (id.includes("tdesign-vue-next")) {
              return "tdesign-vue-next";
            }
            // 其他依赖合并
            return "vendor";
          }

          // 业务代码分包
          if (id.includes("/src/views/")) {
            // 按视图页面分包
            const match = id.match(/\/src\/views\/([^\/]+)/);
            if (match && match[1]) {
              return `views-${match[1]}`;
            }
          }

          if (id.includes("/src/components/")) {
            // 公共组件单独分包
            return "components";
          }

          if (id.includes("/src/util/")) {
            // 工具函数单独分包
            return "util";
          }
        },

        // 输出文件命名规则
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
      //使用html模板配置
    },
  },
});
