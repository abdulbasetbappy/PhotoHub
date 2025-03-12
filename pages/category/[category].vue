<template>
  <div>
    <h1 class="text-4xl font-bold text-center my-4 mb-4 text-secondary font-serif">{{ category }}</h1>
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
