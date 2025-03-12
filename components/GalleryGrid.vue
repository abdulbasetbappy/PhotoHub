<template>
  <div>
    <div class="mb-4 flex justify-center">
      <input v-if="showSearch" v-model="searchQuery" type="text" placeholder="Search images..."
        class="w-full max-w-lg p-2 border rounded-lg outline-none border-[#847df6] border-opacity-70" />
        <NuxtLink v-if="showSearch" to="/auth" class="ml-2 px-4 py-2 bg-[#847df6] text-white rounded-lg hover:bg-[#5f5da6] transition">
        Upload Image
      </NuxtLink>
    </div>

    <div v-if="Array.isArray(imagesArray) && filteredImages.length"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      <div v-for="image in filteredImages" :key="image.url" class="bg-white rounded-lg shadow-sm  overflow-hidden">
        <div class="relative group rounded-lg overflow-hidden">
          <NuxtImg preload :src="image.url" alt="WeTechPro Images" class="w-full h-60 object-cover shadow-md" />
          <div
            class="absolute inset-0 bg-[#8079F5] bg-opacity-50 flex flex-row items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2 gap-4">
            <!-- View Button -->
            <a :href="image.url" target="_blank" rel="noopener noreferrer"
              class="text-white text-base font-semibold bg-[#8079f5] px-2 py-1 rounded-lg hover:bg-[#4f4d88] transition flex items-center gap-1">
              <span>View</span>
              <Icon name="mage:eye" class="w-4 h-4" />
            </a>

            <!-- Download Button -->
            <button @click="downloadImage(image.url)"
              class="text-white text-base font-semibold bg-[#4f4d88] px-2 py-1 rounded-lg hover:bg-[#8079f5] transition">
              <span>Download</span>
              <Icon name="mage:save-floppy" class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div class="p-2 flex flex-col gap-2">
          <div class="flex justify-between items-center h-1">
            <span class="text-sm font-semibold text-gray-500 flex items-center gap-2">
            <p class="truncate w-28">
              {{ image.name }}
            </p>
            <span>.{{ image.format }}</span>
            </span>
            <p class="text-sm text-gray-500">{{ image.width }}x{{ image.height }}</p>
          </div>
          <div class="flex justify-between items-center">
            <p class="text-sm text-gray-500">{{ image.size }}MB</p>
            <a :href="image.url" class="text-[#4f4d88] text-sm font-semibold flex items-center gap-1 underline"
              target="_blank" rel="noopener noreferrer">
              <span>View</span>
              <Icon name="mage:arrow-up-right" />
            </a>
          </div>
        </div>
      </div>

    </div>

    <p v-else class="text-center text-gray-500">No images found.</p>
  </div>
</template>

<script setup>
const props = defineProps({
  images: Array,
  showSearch: Boolean,
});

const searchQuery = ref("");

// ✅ Ensure `images` is always an array
const imagesArray = computed(() => Array.isArray(props.images) ? props.images : []);

// ✅ Computed property for filtered images
const filteredImages = computed(() => {
  return imagesArray.value.filter((image) =>
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
    link.download = imageUrl.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download failed:", error);
  }
};
</script>
<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
</style>