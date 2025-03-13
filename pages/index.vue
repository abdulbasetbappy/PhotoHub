<template>
  <div>
    <!-- 🔍 Search Input -->
    <div class="mb-4 flex justify-center">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search images..."
        class="w-full max-w-lg p-2 border rounded-lg outline-none border-[#847df6] border-opacity-70"
      />
      <NuxtLink to="/auth" class="ml-2 px-4 py-2 bg-[#847df6] text-white rounded-lg hover:bg-[#5f5da6] transition">
        Upload Image
      </NuxtLink>
    </div>
 
    <!-- 📂 Folder Links -->
    <div class="flex flex-wrap gap-4 justify-center">
      <NuxtLink
        v-for="folder in Object.keys(groupedImages)"
        :key="folder"
        :to="`category/${folder}`"
        class="px-4 py-2 bg-[#4f4d88] text-white rounded-lg hover:bg-[#5f5da6] transition"
      >
        {{ folder }}
      </NuxtLink>
    </div>

    <!-- 🖼️ Display Images -->
    <div v-if="Object.keys(filteredImages).length" class="p-4">
      <div v-for="(images, folder) in filteredImages" :key="folder" class="mb-6">
        <NuxtLink :to="`category/${folder}`" class="text-2xl flex items-center gap-1 mb-1 font-bold text-[#4f4d88]">
          {{ folder }}
          <Icon name="mage:arrow-up-right-square" class="inline-block w-6 h-6" />
        </NuxtLink>
        <hr>
        <GalleryGrid :title="folder" :images="images" :showSearch="false" />
      </div>
    </div>

    <p v-else class="text-center text-gray-500">No images found.</p>
  </div>
</template>

<script setup>
import { NuxtLink } from '#components';

definePageMeta({ ssr: true });

const { data: groupedImages, error } = await useAsyncData('gallery', () =>
  $fetch('/api/cloudinary')
);

const searchQuery = ref("");

// 🔍 Computed Property: Search Images Globally
const filteredImages = computed(() => {
  if (!searchQuery.value) {
    // Limit each category to a max of 8 images
    return Object.fromEntries(
      Object.entries(groupedImages.value || {}).map(([folder, images]) => [
        folder,
        images.slice(0, 5), // Limit to 8 images per folder
      ])
    );
  }

  // 🔍 Apply search filter while limiting to 8 images per category
  const result = {};
  Object.entries(groupedImages.value || {}).forEach(([folder, images]) => {
    const matchingImages = images.filter(img =>
      img.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
    if (matchingImages.length) result[folder] = matchingImages.slice(0, 8);
  });

  return result;
});

if (error.value) {
  console.error("Error fetching images:", error.value);
}
</script>
