// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  app: {
    head: {
      title: 'Технодил',
      htmlAttrs: {
        lang: 'ru',
      },
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no, viewport-fit=cover',
      link: [
        { 
          rel: 'icon', 
          type: 'image/x-icon', 
          href: '/favicon-light.ico',
          media: '(prefers-color-scheme: light)' 
        },
        { 
          rel: 'icon', 
          type: 'image/x-icon', 
          href: '/favicon-dark.ico',
          media: '(prefers-color-scheme: dark)' 
        }
      ], 
      meta: [
        {
          name: 'description',
          content: 'Сервис для поиска дешевых товаров электроники.'
        },
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/ui', 'nuxt-telegram-auth', 'pinia-plugin-persistedstate/nuxt', '@nuxtjs/sitemap'],
  pinia: {
    storesDirs: ['./stores/**', './custom-folder/stores/**'],
  },

  components: {
    global: true,
    dirs: ['~/components']
  },
  

  devServer: {
    host: process.env.APP_URL,
    port: 80
  },

  site: { 
    url: 'https://technodil.ru', 
    name: 'Технодил' 
  }, 

  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
      TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
    },
    // apiSecret: '',

    // public: {
    //   apiUrl: '',
    //   TELEGRAM_TOKEN: ''
    // }
  },
  
})