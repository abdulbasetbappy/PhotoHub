<template>
  <div class="max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-bold mb-4 text-secondary">Create Folder</h2>

    <!-- Folder Name Input -->
    <input 
      v-model="folderName" 
      type="text" 
      placeholder="Enter folder name..." 
      class="w-full p-2 border rounded mb-4" 
    />

    <!-- Create Folder Button -->
    <button 
      class="w-full bg-primary text-white py-2 rounded mb-4"
      :disabled="!folderName || isLoading"
      @click="createFolder"
    >
      <span v-if="isLoading">Creating...</span>
      <span v-else>Create Folder</span>
    </button>

    <!-- Loading Indicator -->
    <p v-if="isLoading" class="text-blue-600">Processing...</p>

    <!-- Success/Error Messages -->
    <p v-if="message" class="text-green-600">{{ message }}</p>
    <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
const folderName = ref('');
const message = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

// Function to create a new folder
const createFolder = async () => {
  if (!folderName.value.trim()) {
    errorMessage.value = "Folder name cannot be empty!";
    return;
  }

  isLoading.value = true;
  message.value = '';
  errorMessage.value = '';

  try {
    const response = await fetch('/api/create-folder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: folderName.value.trim() })
    });

    const result = await response.json();

    if (result.success) {
      message.value = result.message;
      folderName.value = '';  // Clear input
    } else {
      errorMessage.value = result.error || "Failed to create folder.";
    }
  } catch (error) {
    errorMessage.value = "An error occurred. Please try again.";
  } finally {
    isLoading.value = false;
    refreshNuxtData();
  }
};
</script>
