export default defineNuxtRouteMiddleware(async () => {
  const { $supabase } = useNuxtApp();
  const { data } = await $supabase.auth.getUser();

  if (!data.user) {
    return navigateTo('/auth'); // Redirect to login if not logged in
  }
});
