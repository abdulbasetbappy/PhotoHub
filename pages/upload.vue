<template>
  <Loading v-if="isLoading || status === 'pending'" />
  <div class="container flex flex-col items-center gap-4 pt-2 pb-8">
    <div class="flex justify-end gap-4 items-center mr-8">
      <LogoutButton />
      <NuxtLink
        to="/deletion"
        class="bg-primary text-white px-4 py-2 rounded mt-2 block"
      >
        Manage Deletion
      </NuxtLink>
    </div>
    <div class="flex flex-row items-start justify-center gap-12">
      <div class="max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">Upload Image</h2>

        <!-- Folder Selection -->
        <select v-model="selectedFolder" class="w-full p-2 border rounded mb-4">
          <option value="" disabled>Select Folder</option>
          <option
            v-for="folder in folders"
            :key="folder.name"
            :value="folder.name"
          >
            {{ folder.name }}
          </option>
        </select>

        <!-- Image Name Input -->
        <input
          v-model="imageName"
          type="text"
          placeholder="Enter image name..."
          class="w-full p-2 border rounded mb-4"
        />

        <!-- Drag & Drop / Upload Button -->
        <div
          class="border-2 border-dashed p-2 h-52 text-center rounded-lg cursor-pointer"
          @dragover.prevent
          @drop="handleDrop"
          @click="triggerFileInput"
        >
          <p v-if="!imagePreview">Drag & Drop or Click to Upload</p>
          <img
            v-if="imagePreview"
            :src="imagePreview"
            class="w-full h-full object-cover rounded-lg"
          />
        </div>

        <input type="file" ref="fileInput" hidden @change="handleFileSelect" />

        <!-- Upload Button -->
        <button
          class="w-full bg-primary text-white py-2 cursor-pointer rounded mt-4"
          :disabled="!selectedFile || !selectedFolder"
          @click="uploadImage"
        >
        <span v-if="isLoadingbtn">Uploading...</span>
        <span v-else>Upload</span>
        </button>

        <!-- Folder Images Preview -->
        <h3 v-if="folderImages.length" class="mt-6 font-bold">
          Images in Folder:
        </h3>
        <div class="grid grid-cols-3 gap-2 mt-2">
          <img
            v-for="img in folderImages"
            :key="img.id"
            :src="img.url"
            class="w-full h-20 object-cover rounded"
          />
        </div>
        <!-- Loading Indicator -->
        <p v-if="isLoading" class="text-blue-600">Processing...</p>

        <!-- Success/Error Messages -->
        <p v-if="message" class="text-green-600">{{ message }}</p>
        <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>
      </div>
      <CreateFolder />
    </div>
  </div>
</template>

<script setup>
const selectedFile = ref(null);
const imagePreview = ref(null);
const imageName = ref("");
const selectedFolder = ref("");
const folders = ref([]);
const folderImages = ref([]);
const fileInput = ref(null);
const router = useRouter();
const { $supabase } = useNuxtApp();
const isLoading = ref(true);
const isLoadingbtn = ref(false);
const message = ref('');
const errorMessage = ref('');
// Check authentication manually on component mount
onMounted(async () => {
  const { data, error } = await $supabase.auth.getUser();

  if (error || !data?.user) {
    router.push("/auth"); // Redirect to login page if not authenticated
  } else {
    isLoading.value = false; // Allow page rendering only if authenticated
    execute(); // Fetch folders immediately
  }
});
// Fetch folders from Cloudinary
const { data, execute, status } = useFetch("/api/get-folders", {
  immediate: false,
});

// Watch the data and update folders immediately
watchEffect(() => {
  if (data.value) {
    folders.value = data.value || []; // Ensure it's an array
  }
});

// Handle file select
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

// Handle drag & drop
const handleDrop = (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) {
    selectedFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const uploadImage = async () => {
  isLoadingbtn.value = true;
  if (!selectedFile.value || !selectedFolder.value) {
    errorMessage.value = "Please select a file and folder!";
    isLoadingbtn.value = false;
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile.value);
  formData.append("folder", selectedFolder.value);
  formData.append("name", imageName.value || selectedFile.value.name);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log("🔹 Server Response:", result);

    if (result.url) {
      message.value = "Image uploaded successfully!";
    } else {
      errorMessage.value = result.error || "Failed to upload image.";
    }
  } catch (error) {
  errorMessage.value = "An error occurred. Please try again.";
  } finally {
    isLoadingbtn.value = false;
    //reset
    selectedFile.value = null;
    imagePreview.value = null;
    imageName.value = "";
  }
};

// Trigger file input click
const triggerFileInput = () => {
  fileInput.value.click();
};
</script>

<style>
/* Add custom styles if needed */
</style>
