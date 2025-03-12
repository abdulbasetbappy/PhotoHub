<template>
  <div class="flex items-center justify-center ">
    <div class="w-96 p-4 border rounded shadow-lg">
      <h2 class="text-4xl text-center font-serif font-bold mb-4 text-secondary">Login</h2>
      <input v-model="email" type="email" placeholder="Email" class="w-full p-2 border border-secondary outline-none rounded mb-2">
      <input v-model="password" type="password" placeholder="Password" class="w-full border-secondary p-2 border outline-none rounded mb-4">

      <button :disabled="isLoading" @click="login" class="bg-secondary text-white px-4 py-2 rounded w-full gap-2 flex items-center justify-center">
        <Icon v-if="isLoading" name="line-md:loading-loop" class="w-6 h-6" />
        <span v-if="!isLoading">Login</span>
        <Icon v-if="!isLoading" name="mage:login" class="w-6 h-6" />
      </button>

      <p v-if="message" class="text-green-600 mt-2">{{ message }}</p>
      <p v-if="errorMessage" class="text-red-600 mt-2">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "guest",
});
const { $supabase } = useNuxtApp();
const email = ref('');
const password = ref('');
const user = ref(null);
const message = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
onMounted(async () => {
  const { data } = await $supabase.auth.getUser();
  user.value = data.user;
});

const login = async () => {
  message.value = '';
  errorMessage.value = '';
  isLoading.value = true;

  const { data, error } = await $supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });

  if (error) {
    errorMessage.value = error.message;
      isLoading.value = false;
  } else {
    message.value = 'Login successful!';
    user.value = data.user;
    navigateTo('/upload');
    isLoading.value = false;
  }
};

</script>