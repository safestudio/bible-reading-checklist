module.exports = {
  mode: "universal",
  env: {
    baseUrl: process.env.BASE_URL,
    firebaseCredentials: {
      apiKey: process.env.FIREBASE_APIKEY,
      authDomain: process.env.FIREBASE_AUTHDOMAIN,
      databaseURL: process.env.FIREBASE_DATABASEURL,
      projectId: process.env.FIREBASE_PROJECTID,
      storageBucket: process.env.FIREBASE_STORAGEBUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
    },
    browser: true,
    node: true
  },
  /*
   ** Headers of the page
   */
  head: {
    title: "Bible Reading Checklist",
    meta: [{
      charset: "utf-8"
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1"
    },
    {
      hid: "description",
      name: "description",
      content: "Bible reading checklist"
    }
    ],
    link: [{
      rel: "icon",
      type: "image/x-icon",
      href: "/favicon.ico"
    }]
  },
  router: {
    middleware: ["auth"]
  },
  plugins: [
    "~/plugins/firebaseAuth.js",
  ],
  modules: [
    [
      "nuxt-i18n", {
        strategy: "prefix_except_default",
        lazy: true,
        langDir: "locales/",
        locales: [{
          code: "en",
          iso: "en-US",
          file: "en-US.js",
        },
          // {
          //   code: 'vi',
          //   iso: 'vi-VN',
          //   file: 'vi-VN.js',
          // },
        ],
        defaultLocale: "en",
      },
      ["vue-warehouse/nuxt",
        {
          plugins: [
            "store/plugins/expire",
            "store/plugins/defaults"
          ],
          storages: [
            "store/storages/localStorage",
            "store/storages/cookieStorage"
          ],
          vuex: true
        }
      ],
    ]
  ],
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: "#3B8070"
  },
  /*
   ** Global CSS
   */
  css: [{
    src: "~/assets/scss/app.scss",
    lang: "scss"
  }, ],
  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    /*
     ** Run ESLint on save
     */
    extend(config, {
      isDev,
      isClient
    }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/,
        });
      }
    }
  }
};
