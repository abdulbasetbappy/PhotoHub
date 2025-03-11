<template>
  <div>
    <nuxt-link to="/">home</nuxt-link>
    <h1 class="text-2xl font-bold text-center my-6">Category: {{ category }}</h1>
    <GalleryGrid v-if="images.length" :title="category" :images="images" :showSearch="true" />
    <p v-else>No images found in this category.</p>
  </div>
</template>

<script setup>
definePageMeta({ ssr: true });

const route = useRoute();
const category = route.params.category;

const { data, error } = await useAsyncData(`images-${category}`, () =>
  $fetch(`/api/cloudinary?category=${category}`)
);

const images = computed(() => {
  return data.value?.[category] || []; // Extract category array or empty array
});

if (error.value) {
  console.error("Error fetching category images:", error.value);
}
</script>
