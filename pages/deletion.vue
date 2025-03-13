<template>
  <Loading v-if="isLoading" />
<div class="container flex flex-col items-center gap-4">
  <div class=" flex justify-end gap-4 items-center mr-8">
    <LogoutButton />
    <NuxtLink to="/upload" class="bg-primary text-white px-4 py-2 rounded mt-2 block">
      Manage Image
    </NuxtLink>
  </div>
  <div class=" mx-auto p-6 bg-white rounded-lg shadow">
    <h2 class="text-4xl font-bold mb-6 text-secondary font-serif text-center">Manage Deletion</h2>

    <div class="grid grid-cols-2 gap-6">
      <!-- Delete Folder Section -->
      <div class="p-4 border rounded-lg">
        <h3 class="text-xl font-semibold mb-4">Delete Folder</h3>
        <ul>
          <li v-for="folder in folders" :key="folder.name" class="flex justify-between items-center mb-2">
            <span>{{ folder.name }}</span>
            <button class="bg-red-600 text-white px-3 py-1 rounded" @click="deleteFolder(folder.name)">
              Delete
            </button>
          </li>
          <!--Loading if status pending-->
          <li v-if="status === 'pending'">
            Loading...
          </li>
        </ul>
      </div>

      <!-- Delete Image Section -->
      <div class="p-4 border rounded-lg w-96">
        <h3 class="text-xl font-semibold mb-4">Delete Images</h3>
        <select v-model="selectedFolder" @change="fetchImages" class="w-full p-2 border rounded mb-4">
          <option value="" disabled>Select Folder</option>
          <option v-for="folder in folders" :key="folder.name" :value="folder.name">
            {{ folder.name }}
          </option>
        </select>

        <div v-if="imageloading" class="text-center text-gray-600">
  <p>Loading...</p>
</div>
<div v-else-if="folderImages.length">
  <ul>
    <li v-for="img in folderImages" :key="img.public_id" class="flex justify-between items-center mb-2">
      <div class="flex items-center gap-2">
        <img :src="img.url" alt="Image" class="w-16 h-16 object-cover rounded-lg">
        <span>{{ img.public_id.split("/").pop().split('_').pop() }}</span>
      </div>
      <button class="bg-red-600 text-white px-3 py-1 rounded" @click="deleteImage(img.public_id)">
        Delete
      </button>
    </li>
  </ul>
</div>
<p v-else class="text-gray-500">No images found in this folder.</p>

      </div>
    </div>

    <!-- Success/Error Messages -->
    <p v-if="message" class="text-green-600 mt-4">{{ message }}</p>
    <p v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</p>
  </div>
</div>
</template>

<script setup>
// State variables
const folders = ref([]);
const folderImages = ref([]);
const selectedFolder = ref('');
const message = ref('');
const errorMessage = ref('');
const router = useRouter();
const { $supabase } = useNuxtApp();
const isLoading = ref(true);
const imageloading = ref(false);
// Check authentication manually on component mount
onMounted(async () => {
  const { data, error } = await $supabase.auth.getUser();

  if (error || !data?.user) {
    router.push('/auth'); // Redirect to login page if not authenticated
  } else {
    isLoading.value = false; // Allow page rendering only if authenticated
    execute();
  }
});

// Fetch folders from API
const { data, refresh, execute, status } = useFetch('/api/get-folders',{ immediate: false });

watchEffect(() => {
  if (data.value) {
    folders.value = data.value || [];
  }
});

// Fetch images from a selected folder
const fetchImages = async () => {
  if (!selectedFolder.value) return;
  imageloading.value = true;
  const folderNameConverter = selectedFolder.value;
  try {
    const response = await fetch(`/api/get-images?folder=${folderNameConverter}`);
    const result = await response.json();
    console.log(result);
    folderImages.value = result.images || [];
  } catch (error) {
    console.error(error);
    errorMessage.value = "Failed to fetch images.";
  } finally {
    imageloading.value = false;
  }
};


// Delete a folder with all images
const deleteFolder = async (folderName) => {
  if (!confirm(`Are you sure you want to delete the folder "${folderName}" and all its images?`)) return;

  try {
    const response = await fetch('/api/delete-folder', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: folderName })
    });

    const result = await response.json();

    if (result.success) {
      message.value = "Folder deleted successfully!";
      errorMessage.value = '';
      await refresh(); // Refresh folders list
    } else {
      errorMessage.value = result.error || "Failed to delete folder.";
    }
  } catch (error) {
    errorMessage.value = "An error occurred while deleting the folder.";
  }
};

// Delete an individual image
const deleteImage = async (publicId) => {
  if (!confirm(`Are you sure you want to delete this image?`)) return;

  try {
    const response = await fetch('/api/delete-image', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId })
    });

    const result = await response.json();

    if (result.success) {
      message.value = "Image deleted successfully!";
      errorMessage.value = '';
      await fetchImages(); // Refresh images list
    } else {
      errorMessage.value = result.error || "Failed to delete image.";
    }
  } catch (error) {
    errorMessage.value = "An error occurred while deleting the image.";
  }
};
</script>