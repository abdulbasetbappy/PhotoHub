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
    </div>

    <!-- 📂 Folder Links -->
    <div class="flex flex-wrap gap-4 justify-center">
      <NuxtLink
        v-for="folder in Object.keys(groupedImages)"
        :key="folder"
        :to="`/${folder}`"
        class="px-4 py-2 bg-[#4f4d88] text-white rounded-lg hover:bg-[#5f5da6] transition"
      >
        {{ folder }}
      </NuxtLink>
    </div>

    <!-- 🖼️ Display Images -->
    <div v-if="Object.keys(filteredImages).length" class="p-4">
      <div v-for="(images, folder) in filteredImages" :key="folder" class="mb-6">
        <NuxtLink :to="`/${folder}`" class="text-2xl flex items-center gap-1 mb-1 font-bold text-[#4f4d88]">
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
definePageMeta({ ssr: true });

const { data: groupedImages, error } = await useAsyncData('gallery', () =>
  $fetch('/api/cloudinary')
);

const searchQuery = ref("");

// 🔍 Computed Property: Search Images Globally
const filteredImages = computed(() => {
  if (!searchQuery.value) return groupedImages.value || {};
  
  const result = {};
  Object.entries(groupedImages.value || {}).forEach(([folder, images]) => {
    const matchingImages = images.filter(img =>
      img.url.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
    if (matchingImages.length) result[folder] = matchingImages;
  });

  return result;
});

if (error.value) {
  console.error("Error fetching images:", error.value);
}
</script>
