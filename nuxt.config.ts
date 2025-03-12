// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', '@nuxt/image',],
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: { 
            primary: '#8079f5',
            secondary: '#4f4d88',
            white: '#ffffff',
            black: '#000000',
          },
          fontFamily: {
            sans: ['Playwrite HU', 'sans-serif'],
            serif: ['Merriweather', 'serif'],
          },

        }
      }
    }
  },
  runtimeConfig: {
    public: {
      supabaseUrl: "https://icdoclvaeiivwzxhsbhk.supabase.co",
      supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZG9jbHZhZWlpdnd6eGhzYmhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NDM5ODQsImV4cCI6MjA1NzMxOTk4NH0.KDSUVaAuEWNNRrqFXbE4YF2lXIqJvh4PgC6nCCWPVmM"
    }
  }
})