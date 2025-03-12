export default defineNuxtRouteMiddleware(async () => {
  const nuxtApp = useNuxtApp();
  const { $supabase } = nuxtApp;

  // Wait for Supabase auth to be ready
  const { data, error } = await $supabase.auth.getUser();

  if (!error && data?.user) {
    return navigateTo('/upload', { replace: true });
  }
});
