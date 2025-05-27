// vite.config.ts
import path from "path";
import react from "file:///home/armand/dev/web/reactjs/Akevas/node_modules/.pnpm/@vitejs+plugin-react@4.3.3_vite@5.4.10_@types+node@22.9.0_terser@5.39.0_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///home/armand/dev/web/reactjs/Akevas/node_modules/.pnpm/vite@5.4.10_@types+node@22.9.0_terser@5.39.0/node_modules/vite/dist/node/index.js";
import { VitePWA } from "file:///home/armand/dev/web/reactjs/Akevas/node_modules/.pnpm/vite-plugin-pwa@0.21.1_vite@5.4.10_@types+node@22.9.0_terser@5.39.0__workbox-build@7.3._1dd7cc0f9c31e2676de2f1bf9f70b05c/node_modules/vite-plugin-pwa/dist/index.js";
var __vite_injected_original_dirname = "/home/armand/dev/web/reactjs/Akevas";
var manifestForPlugIn = {
  registerType: "autoUpdate",
  includeAssests: ["favicon.png", "service-worker.js"],
  devOptions: {
    enabled: true,
    type: "module"
  },
  manifest: {
    name: "Akevas",
    short_name: "Akevas",
    description: "Akevas",
    icons: [
      {
        src: "/favicon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "favicon"
      },
      {
        src: "/favicon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "favicon"
      },
      {
        src: "/favicon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon"
      },
      {
        src: "/favicon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ],
    theme_color: "#171717",
    background_color: "#f0e7db",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait"
  }
};
var vite_config_default = defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn)],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    sourcemap: true
  }
});
export {
  vite_config_default as default,
  manifestForPlugIn
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9hcm1hbmQvZGV2L3dlYi9yZWFjdGpzL0FrZXZhc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvYXJtYW5kL2Rldi93ZWIvcmVhY3Rqcy9Ba2V2YXMvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvYXJtYW5kL2Rldi93ZWIvcmVhY3Rqcy9Ba2V2YXMvdml0ZS5jb25maWcudHNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIlxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIlxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcblxuZXhwb3J0IGNvbnN0IG1hbmlmZXN0Rm9yUGx1Z0luID0ge1xuICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyBhcyBjb25zdCxcbiAgaW5jbHVkZUFzc2VzdHM6IFsnZmF2aWNvbi5wbmcnLCAnc2VydmljZS13b3JrZXIuanMnXSxcbiAgZGV2T3B0aW9uczoge1xuICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgdHlwZTogJ21vZHVsZScsXG4gIH0sXG4gIG1hbmlmZXN0OiB7XG4gICAgbmFtZTogXCJBa2V2YXNcIixcbiAgICBzaG9ydF9uYW1lOiBcIkFrZXZhc1wiLFxuICAgIGRlc2NyaXB0aW9uOiBcIkFrZXZhc1wiLFxuICAgIGljb25zOiBbe1xuICAgICAgc3JjOiAnL2Zhdmljb24ucG5nJyxcbiAgICAgIHNpemVzOiAnMTkyeDE5MicsXG4gICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgIHB1cnBvc2U6ICdmYXZpY29uJ1xuICAgIH0sXG4gICAge1xuICAgICAgc3JjOiAnL2Zhdmljb24ucG5nJyxcbiAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgIHB1cnBvc2U6ICdmYXZpY29uJ1xuICAgIH0sXG4gICAge1xuICAgICAgc3JjOiAnL2Zhdmljb24ucG5nJyxcbiAgICAgIHNpemVzOiAnMTgweDE4MCcsXG4gICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgIHB1cnBvc2U6ICdhcHBsZSB0b3VjaCBpY29uJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIHNyYzogJy9mYXZpY29uLnBuZycsXG4gICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICBwdXJwb3NlOiAnYW55IG1hc2thYmxlJyxcbiAgICB9XG4gICAgXSxcbiAgICB0aGVtZV9jb2xvcjogJyMxNzE3MTcnLFxuICAgIGJhY2tncm91bmRfY29sb3I6ICcjZjBlN2RiJyxcbiAgICBkaXNwbGF5OiBcInN0YW5kYWxvbmVcIiBhcyBjb25zdCxcbiAgICBzY29wZTogJy8nLFxuICAgIHN0YXJ0X3VybDogXCIvXCIsXG4gICAgb3JpZW50YXRpb246ICdwb3J0cmFpdCcgYXMgY29uc3RcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksVml0ZVBXQShtYW5pZmVzdEZvclBsdWdJbildLFxuXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcblxuICBidWlsZDoge1xuICAgIHNvdXJjZW1hcDogdHJ1ZVxuICB9XG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxPQUFPLFVBQVU7QUFDakIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsZUFBZTtBQUp4QixJQUFNLG1DQUFtQztBQU1sQyxJQUFNLG9CQUFvQjtBQUFBLEVBQy9CLGNBQWM7QUFBQSxFQUNkLGdCQUFnQixDQUFDLGVBQWUsbUJBQW1CO0FBQUEsRUFDbkQsWUFBWTtBQUFBLElBQ1YsU0FBUztBQUFBLElBQ1QsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFVBQVU7QUFBQSxJQUNSLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLGFBQWE7QUFBQSxJQUNiLE9BQU87QUFBQSxNQUFDO0FBQUEsUUFDTixLQUFLO0FBQUEsUUFDTCxPQUFPO0FBQUEsUUFDUCxNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsTUFDWDtBQUFBLE1BQ0E7QUFBQSxRQUNFLEtBQUs7QUFBQSxRQUNMLE9BQU87QUFBQSxRQUNQLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxNQUNYO0FBQUEsTUFDQTtBQUFBLFFBQ0UsS0FBSztBQUFBLFFBQ0wsT0FBTztBQUFBLFFBQ1AsTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLE1BQ1g7QUFBQSxNQUNBO0FBQUEsUUFDRSxLQUFLO0FBQUEsUUFDTCxPQUFPO0FBQUEsUUFDUCxNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsTUFDWDtBQUFBLElBQ0E7QUFBQSxJQUNBLGFBQWE7QUFBQSxJQUNiLGtCQUFrQjtBQUFBLElBQ2xCLFNBQVM7QUFBQSxJQUNULE9BQU87QUFBQSxJQUNQLFdBQVc7QUFBQSxJQUNYLGFBQWE7QUFBQSxFQUNmO0FBQ0Y7QUFDQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFFLFFBQVEsaUJBQWlCLENBQUM7QUFBQSxFQUU1QyxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFFQSxPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUEsRUFDYjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
