// const LANG = 'en_US';
// const TYPE = 'website';
// const URL = 'https://hippocrades.com';
// const SITE_NAME = 'hippocrades.com';

// https://nuxt.com/docs/api/configuration/nuxt-config
// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  preset: 'node-server',
  devServer: {
    port: 2425,
  },

  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-headlessui',
    'nuxt-gtag',
    '@nuxtjs/i18n',
    'nuxt-svgo',
    '@pinia/nuxt',
    'nuxt-mongoose',
    'nuxt-vuefire',
  ],

  runtimeConfig: {
    mongoose: { uri: 'mongodb://localhost:27017/group-gifts' },
  },
  mongoose: {
    uri: 'mongodb://localhost:27017/group-gifts',
  },

  ssr: false,

  app: {
    head: {
      title: 'Group Gifts',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css',
        },
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'icon', type: 'image/png', href: '/favicon/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
        { name: 'apple-mobile-web-app-title', content: 'Group Gifts' },
        { rel: 'manifest', href: '/favicon/site.webmanifest' },
      ],
      meta: [
        { name: 'og:type', content: 'website' },
        { name: 'og:site_name', content: 'gifts.filippo-orru.com' },
        { name: "og:image", content: "/images/social.png" },
      ],
      script: [
        // Plausible Analytics
        { defer: true, 'data-domain': 'gifts.filippo-orru.com', src: 'https://statistics.filippo-orru.com/psb.js' },
      ],
    },
  },

  css: ['~/assets/css/transitions.css'],

  tailwindcss: {
    cssPath: ["~/assets/css/tailwind.css", { injectPosition: "first" }],
    configPath: 'tailwind.config',
    exposeConfig: {
      level: 2,
    },
    config: {},
    viewer: true,
  },

  headlessui: {
    prefix: 'Headless',
  },

  build: {
    extend(config, ctx) {
      config.resolve.symlinks = false;
    },
  },

  image: {
    dir: 'assets/images',
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536,
      '3xl': 1920,
    },
  },

  devtools: {
    enabled: true,
  },

  nitro: {
    experimental: {
      websocket: true
    },
  },

  i18n: {
    seo: true,
    baseUrl: 'https://gifts.filippo-orru.com',
    locales: [ // used in URL path prefix
      {
        code: 'en',
        language: 'en-US'
      },
      {
        code: 'de',
        language: 'de-DE'
      },
    ],
    defaultLocale: 'en', // default locale of your project for Nuxt pages and routings
    strategy: 'prefix_and_default',
    detectBrowserLanguage: {
      redirectOn: 'no prefix',
      fallbackLocale: 'en',
    },
    vueI18n: './i18n.config.ts', // if you are using custom path, default
  },

  vuefire: {
    config: {
      // Keep in sync with public/firebase-messaging-sw.js!
      apiKey: "AIzaSyDqLgiOyZOsME9lDie0qRQwAxf-bfc7kUY",
      authDomain: "group-gifts-4b208.firebaseapp.com",
      projectId: "group-gifts-4b208",
      storageBucket: "group-gifts-4b208.firebasestorage.app",
      messagingSenderId: "530776730060",
      appId: "1:530776730060:web:7791cd422580be9d31d569",
    },
  },

  compatibilityDate: '2024-11-08',
});
