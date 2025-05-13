// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
 modules: ['usebootstrap', '@nuxt/eslint', '@pinia/nuxt'], devtools: { enabled: false },
 css: [
  './assets/scss/custom.scss',
 ],
 compatibilityDate: '2024-07-03',
 devServer: {
  host: '127.0.0.1',
  port: 3000
 },
 vite: {
  css: {
   preprocessorOptions: {
    scss: {
     additionalData: `
           @import "@/assets/scss/_variables.scss";
           `,
    },
   },
  },
 },
 eslint: {
  config: {
   stylistic: {
    indent: 1,
    semi: true,
   },
  },
 },
 usebootstrap: {
  integration: {
   protocol: {
    reqres: {
     type: 'fetch',
     prefix: 'https://reqres.in/api/',
     headers: {
      'x-api-key': ' reqres-free-v1',
     },
    },
   },
  },
 },
},
);
