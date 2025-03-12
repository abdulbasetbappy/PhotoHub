<template>
  <button @click="logout" class="bg-secondary text-white px-4 py-2 rounded mt-2">
    Logout
  </button>
</template>

<script setup>
const { $supabase } = useNuxtApp();
const router = useRouter();

const logout = async () => {
  await $supabase.auth.signOut();
  router.push('/auth'); // Redirect to login page
};
</script>