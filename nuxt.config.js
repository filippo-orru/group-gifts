// const LANG = 'en_US';
// const TYPE = 'website';
// const URL = 'https://hippocrades.com';
// const SITE_NAME = 'hippocrades.com';

// https://nuxt.com/docs/api/configuration/nuxt-config
// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  preset: 'node-server',

  ssr: false,
  devServer: {
    port: 2425,
  },

  modules: ['@nuxtjs/tailwindcss', 'nuxt-headlessui', 'nuxt-gtag', '@nuxtjs/i18n', 'nuxt-svgo', '@pinia/nuxt', 'nuxt-mongoose'],

  gtag: {
    id: '', // TODO: Add your google analytics 4 tag here
  },

  runtimeConfig: {
    public: {
      yourEnv: process.env.YOUR_ENV,
    },
  },

  plugins: [
    {
      src: '~/plugins/aos.js',
      mode: 'client',
    },
  ],

  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css',
        },
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
  mongoose: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/group-gifts',
  },

  nitro: {
    experimental: {
      websocket: true
    },
  },

  compatibilityDate: '2024-11-08',
});
