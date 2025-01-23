export default {
  // Server settings
  server: {
    port: process.env.NUXT_ENV_PORT || 3000, // Port server
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "blueray-frontend-nuxt",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["ant-design-vue/dist/antd.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["@/plugins/antd-ui"],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/axios", "@nuxtjs/auth-next"],

  // Axios configuration
  axios: {
    baseURL: `${process.env.API_URL}/api`,
    credentials: true,
    init(axios) {
      axios.interceptors.request.use(async (config) => {
        if (!document.cookie.includes("XSRF-TOKEN")) {
          await axios.get(`${process.env.API_URL}/sanctum/csrf-cookie`);
        }
        return config;
      });
    },
  },

  // Auth configuration
  auth: {
    strategies: {
      laravelSanctum: {
        provider: "laravel/sanctum",
        url: process.env.API_URL,
        endpoints: {
          login: {
            url: "/api/login",
            method: "post",
          },
          logout: {
            url: "/api/logout",
            method: "post",
          },
          user: {
            url: "/api/user",
            method: "get",
          },
        },
        token: {
          property: "access_token",
        },
        user: {
          property: "user",
        },
        csrf: {
          cookie: true,
        },
      },
    },
    watchLoggedIn: true,
    rewriteRedirects: true,
    redirect: {
      login: "/login",
      logout: "/login",
      callback: "/login",
      home: "/",
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ["ufo"],
    babel: {
      presets({ envName }) {
        return [
          [
            require.resolve("@nuxt/babel-preset-app"),
            {
              corejs: { version: 3 },
              targets:
                envName === "server"
                  ? { node: "current" }
                  : { browsers: ["last 2 versions", "ie 11"] },
            },
          ],
        ];
      },
    },
    extend(config, _) {
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      });
      // Include the compiler version of Vue so that <component-name> works
      config.resolve.alias.vue$ = "vue/dist/vue.esm.js";
    },
  },

  // Router middleware
  router: {
    middleware: ["auth", "role"],
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
  ],

  layouts: {
    default: "~/layouts/default.tsx",
  },
};
