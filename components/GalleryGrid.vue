<template>
    <div>
      <!-- Search input only shows if 'showSearch' is true -->
      <input
        v-if="showSearch"
        v-model="searchQuery"
        type="text"
        placeholder="Search images..."
        class="w-full p-2 border rounded mb-4"
      />

      <div v-if="filteredImages.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        <div v-for="image in filteredImages" :key="image.url" class="relative group">
          <NuxtImg :src="image.url" alt="WeTechPro Images" class="w-full h-48 object-cover rounded-lg shadow-md" />
          <div
            class="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2 space-y-2"
          >
            <!-- View Button -->
            <a :href="image.url" target="_blank" rel="noopener noreferrer" class="text-white text-lg font-bold bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">
              View
            </a>

            <!-- Download Button -->
            <button @click="downloadImage(image.url)" class="text-white text-lg font-bold bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition">
              Download
            </button>
          </div>
        </div>
      </div>

      <p v-else class="text-center text-gray-500">No images found.</p>
    </div>
</template>
  
<script setup>
const props = defineProps({
  images: Array,
  showSearch: Boolean, // ✅ New prop to control search input visibility
});

const searchQuery = ref("");

// ✅ Computed property for filtered images based on search
const filteredImages = computed(() => {
  return props.images.filter((image) =>
    image.url.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// ✅ Function to force download an image
const downloadImage = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = imageUrl.split("/").pop(); // Extract filename from URL
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download failed:", error);
  }
};
</script>
